import asyncHandler from 'express-async-handler';
import FarmWallet from '../models/FarmWallet.js';
import WithdrawalRequest from '../models/WithdrawalRequest.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { sendWithdrawalNotificationEmail } from '../utils/emailService.js';
import productsData from '../data/products.js';

// In-memory fallback stores
let memoryWallets = [];
let memoryWithdrawals = [];

/**
 * Helper to credit each farm/brand wallet when an order is delivered.
 * Called from updateOrderToDelivered.
 */
export const creditFarmsForDeliveredOrder = async (order) => {
  if (!order || !order.orderItems || order.orderItems.length === 0) {
    return;
  }

  // 1. Group items by farm brand
  const brandEarningsMap = {};

  for (const item of order.orderItems) {
    let brand = item.brand;

    // If brand not directly present on item, find in DB or productsData
    if (!brand || brand === 'Organi Farm') {
      try {
        const prodId = (item.product || item._id)?.toString();
        const foundProd = await Product.findById(prodId);
        if (foundProd && foundProd.brand) {
          brand = foundProd.brand;
        } else {
          const sampleProd = productsData.find((p) => p._id === prodId || p.name === item.name);
          if (sampleProd && sampleProd.brand) {
            brand = sampleProd.brand;
          }
        }
      } catch (err) {
        const sampleProd = productsData.find((p) => p.name === item.name);
        if (sampleProd && sampleProd.brand) {
          brand = sampleProd.brand;
        }
      }
    }

    brand = brand || 'Organi Farm';
    const itemTotal = Number((Number(item.price || 0) * Number(item.qty || 1)).toFixed(2));

    if (!brandEarningsMap[brand]) {
      brandEarningsMap[brand] = {
        total: 0,
        items: [],
      };
    }

    brandEarningsMap[brand].total = Number((brandEarningsMap[brand].total + itemTotal).toFixed(2));
    brandEarningsMap[brand].items.push({
      item,
      itemTotal,
    });
  }

  // 2. Credit each brand's wallet
  const orderIdStr = order._id?.toString() || 'ORD-' + Date.now();
  const orderNumStr = orderIdStr.substring(0, 8).toUpperCase();
  const customerName = order.user?.name || order.shippingAddress?.address || 'Customer';

  for (const [brand, data] of Object.entries(brandEarningsMap)) {
    try {
      let wallet = await FarmWallet.findOne({ brand });
      if (!wallet) {
        wallet = new FarmWallet({
          brand,
          balance: 0,
          totalEarned: 0,
          totalWithdrawn: 0,
          pendingWithdrawal: 0,
          transactions: [],
        });
      }

      wallet.balance = Number((wallet.balance + data.total).toFixed(2));
      wallet.totalEarned = Number((wallet.totalEarned + data.total).toFixed(2));

      for (const entry of data.items) {
        wallet.transactions.unshift({
          type: 'DELIVERY_EARNING',
          amount: entry.itemTotal,
          orderId: orderIdStr,
          orderNumber: orderNumStr,
          productName: entry.item.name,
          productImage: entry.item.image,
          qty: entry.item.qty,
          price: entry.item.price,
          customerName,
          description: `Delivered ${entry.item.qty}x ${entry.item.name} for Order #${orderNumStr}`,
          createdAt: new Date(),
        });
      }

      await wallet.save();
      console.log(`🌾 [Farm Wallet] Successfully credited $${data.total} to ${brand} wallet (Order #${orderNumStr})`);
    } catch (dbErr) {
      // In-memory fallback
      let memWallet = memoryWallets.find((w) => w.brand === brand);
      if (!memWallet) {
        memWallet = {
          _id: 'wallet-' + brand.toLowerCase().replace(/\s+/g, '-'),
          brand,
          balance: 0,
          totalEarned: 0,
          totalWithdrawn: 0,
          pendingWithdrawal: 0,
          transactions: [],
        };
        memoryWallets.push(memWallet);
      }

      memWallet.balance = Number((memWallet.balance + data.total).toFixed(2));
      memWallet.totalEarned = Number((memWallet.totalEarned + data.total).toFixed(2));

      for (const entry of data.items) {
        memWallet.transactions.unshift({
          type: 'DELIVERY_EARNING',
          amount: entry.itemTotal,
          orderId: orderIdStr,
          orderNumber: orderNumStr,
          productName: entry.item.name,
          productImage: entry.item.image,
          qty: entry.item.qty,
          price: entry.item.price,
          customerName,
          description: `Delivered ${entry.item.qty}x ${entry.item.name} for Order #${orderNumStr}`,
          createdAt: new Date(),
        });
      }
      console.log(`🌾 [Memory Wallet] Credited $${data.total} to ${brand} wallet (Order #${orderNumStr})`);
    }
  }
};

/**
 * @desc    Get current farm wallet & stats
 * @route   GET /api/farm/wallet
 * @access  Private (Farm/Admin)
 */
export const getMyFarmWallet = asyncHandler(async (req, res) => {
  // If user has a specific brand (e.g. BerryField), use it.
  // If admin, allow passing query param ?brand=BerryField or default to user's brand / BerryField
  let targetBrand = req.user?.brand;

  if ((!targetBrand || req.user?.role === 'admin' || req.user?.isAdmin) && req.query.brand) {
    targetBrand = req.query.brand;
  }

  if (!targetBrand) {
    targetBrand = req.user?.role === 'admin' ? 'BerryField' : 'Organi Farm';
  }

  let wallet;
  try {
    wallet = await FarmWallet.findOne({ brand: targetBrand });
    if (!wallet) {
      wallet = await FarmWallet.create({
        brand: targetBrand,
        balance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
        pendingWithdrawal: 0,
        transactions: [],
      });
    }
  } catch (dbErr) {
    wallet = memoryWallets.find((w) => w.brand === targetBrand);
    if (!wallet) {
      wallet = {
        _id: 'wallet-' + targetBrand.toLowerCase().replace(/\s+/g, '-'),
        brand: targetBrand,
        balance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
        pendingWithdrawal: 0,
        transactions: [],
      };
      memoryWallets.push(wallet);
    }
  }

  // Also fetch any withdrawal requests for this brand
  let withdrawals = [];
  try {
    withdrawals = await WithdrawalRequest.find({ brand: targetBrand }).sort({ createdAt: -1 });
  } catch (err) {
    withdrawals = memoryWithdrawals.filter((w) => w.brand === targetBrand);
  }

  // Get list of all available brands in store for admin inspection selector
  const availableBrands = [
    'BerryField',
    'Organi Farm',
    'Green Earth',
    'Orchard Gold',
    'SunValley',
    'SunnyMeadow',
    'NutriPure',
    'Artisan Bakery',
  ];

  res.json({
    wallet,
    withdrawals,
    availableBrands,
    currentBrand: targetBrand,
    userBankInfo: req.user?.bankInfo || {},
  });
});

/**
 * @desc    Submit a withdrawal request & dispatch alert to 1904duy@gmail.com
 * @route   POST /api/farm/withdraw
 * @access  Private (Farm/Admin)
 */
export const requestWithdrawal = asyncHandler(async (req, res) => {
  const { amount, bankInfo } = req.body;
  const numAmount = Number(amount);

  if (!numAmount || numAmount <= 0) {
    res.status(400);
    throw new Error('Please enter a valid withdrawal amount greater than $0.00');
  }

  if (!bankInfo || !bankInfo.bankName || !bankInfo.accountNumber || !bankInfo.accountName) {
    res.status(400);
    throw new Error('Please provide complete bank details (Bank Name, Account Number, Account Name)');
  }

  const brand = req.user?.brand || req.body.brand || 'BerryField';

  let wallet;
  try {
    wallet = await FarmWallet.findOne({ brand });
  } catch (dbErr) {
    // Fall through
  }

  if (!wallet) {
    wallet = memoryWallets.find((w) => w.brand === brand);
  }

  if (!wallet || wallet.balance < numAmount) {
    res.status(400);
    throw new Error(
      `Insufficient wallet balance. Available: $${(wallet?.balance || 0).toFixed(2)}, Requested: $${numAmount.toFixed(2)}`
    );
  }

  // 1. Lock funds in wallet: deduct from available balance, add to pendingWithdrawal
  wallet.balance = Number((wallet.balance - numAmount).toFixed(2));
  wallet.pendingWithdrawal = Number(((wallet.pendingWithdrawal || 0) + numAmount).toFixed(2));

  let withdrawal;
  const withdrawalData = {
    farmUser: req.user?._id,
    brand,
    amount: numAmount,
    bankInfo: {
      bankName: bankInfo.bankName.trim(),
      accountNumber: bankInfo.accountNumber.trim(),
      accountName: bankInfo.accountName.trim(),
      routingNumber: (bankInfo.routingNumber || '').trim(),
      note: (bankInfo.note || '').trim(),
    },
    status: 'PENDING',
    recipientEmail: '1904duy@gmail.com',
    emailStatus: 'PENDING',
    requestedAt: new Date(),
  };

  try {
    withdrawal = new WithdrawalRequest(withdrawalData);
    await withdrawal.save();

    // Append transaction to wallet
    wallet.transactions.unshift({
      type: 'WITHDRAWAL_REQUEST',
      amount: -numAmount,
      withdrawalId: withdrawal._id.toString(),
      description: `Withdrawal request to ${bankInfo.bankName} (Acc: ${bankInfo.accountNumber})`,
      createdAt: new Date(),
    });

    await wallet.save();

    // Save bank info to user profile for future ease of use
    if (req.user?._id) {
      try {
        await User.findByIdAndUpdate(req.user._id, { bankInfo: withdrawalData.bankInfo });
      } catch (e) {
        // ignore
      }
    }
  } catch (dbErr) {
    // Memory fallback
    withdrawal = {
      _id: 'wd-' + Date.now(),
      ...withdrawalData,
      createdAt: new Date().toISOString(),
    };
    memoryWithdrawals.unshift(withdrawal);

    wallet.transactions.unshift({
      type: 'WITHDRAWAL_REQUEST',
      amount: -numAmount,
      withdrawalId: withdrawal._id,
      description: `Withdrawal request to ${bankInfo.bankName} (Acc: ${bankInfo.accountNumber})`,
      createdAt: new Date(),
    });
  }

  // 2. Dispatch email notification alert to 1904duy@gmail.com
  const emailResult = await sendWithdrawalNotificationEmail({
    withdrawal,
    wallet,
    farmUser: req.user,
  });

  if (withdrawal && typeof withdrawal.save === 'function') {
    withdrawal.emailStatus = emailResult?.mode || 'SENT';
    await withdrawal.save();
  }

  res.status(201).json({
    message: 'Withdrawal request submitted successfully! An alert has been dispatched to 1904duy@gmail.com.',
    withdrawal,
    wallet,
  });
});

/**
 * @desc    Get withdrawal requests history for logged-in farm
 * @route   GET /api/farm/withdrawals
 * @access  Private (Farm/Admin)
 */
export const getMyWithdrawals = asyncHandler(async (req, res) => {
  const brand = req.user?.brand || req.query.brand || 'BerryField';

  try {
    const withdrawals = await WithdrawalRequest.find({ brand }).sort({ createdAt: -1 });
    return res.json(withdrawals);
  } catch (dbErr) {
    const memList = memoryWithdrawals.filter((w) => w.brand === brand);
    return res.json(memList);
  }
});

/**
 * @desc    Update farm banking info
 * @route   PUT /api/farm/bank-info
 * @access  Private (Farm)
 */
export const updateFarmBankInfo = asyncHandler(async (req, res) => {
  const { bankName, accountNumber, accountName, routingNumber } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.bankInfo = {
        bankName: bankName || user.bankInfo?.bankName || '',
        accountNumber: accountNumber || user.bankInfo?.accountNumber || '',
        accountName: accountName || user.bankInfo?.accountName || '',
        routingNumber: routingNumber || user.bankInfo?.routingNumber || '',
      };
      await user.save();
      return res.json({ message: 'Bank details updated successfully', bankInfo: user.bankInfo });
    }
  } catch (err) {
    // Memory fallback
  }

  if (req.user) {
    req.user.bankInfo = {
      bankName: bankName || '',
      accountNumber: accountNumber || '',
      accountName: accountName || '',
      routingNumber: routingNumber || '',
    };
    return res.json({ message: 'Bank details updated', bankInfo: req.user.bankInfo });
  }

  res.status(404);
  throw new Error('User not found');
});

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

/**
 * @desc    Get all withdrawal requests across all farms
 * @route   GET /api/farm/admin/withdrawals
 * @access  Private/Admin
 */
export const getAllWithdrawals = asyncHandler(async (req, res) => {
  try {
    const withdrawals = await WithdrawalRequest.find({})
      .populate('farmUser', 'name email brand')
      .sort({ createdAt: -1 });
    if (withdrawals && withdrawals.length > 0) {
      return res.json(withdrawals);
    }
  } catch (dbErr) {
    // Fall through
  }

  res.json(memoryWithdrawals);
});

/**
 * @desc    Admin approves withdrawal after transferring money to the farm
 * @route   PUT /api/farm/admin/withdrawals/:id/approve
 * @access  Private/Admin
 */
export const approveWithdrawal = asyncHandler(async (req, res) => {
  const { adminNotes } = req.body;

  let withdrawal;
  try {
    withdrawal = await WithdrawalRequest.findById(req.params.id);
  } catch (err) {
    // Fall through
  }

  if (!withdrawal) {
    withdrawal = memoryWithdrawals.find((w) => w._id.toString() === req.params.id);
  }

  if (!withdrawal) {
    res.status(404);
    throw new Error('Withdrawal request not found');
  }

  if (withdrawal.status !== 'PENDING') {
    res.status(400);
    throw new Error(`Withdrawal request is already ${withdrawal.status}`);
  }

  withdrawal.status = 'APPROVED';
  withdrawal.processedAt = new Date();
  withdrawal.adminNotes = adminNotes || 'Transferred by Admin via Bank';

  // Update wallet: move from pendingWithdrawal to totalWithdrawn
  let wallet;
  try {
    wallet = await FarmWallet.findOne({ brand: withdrawal.brand });
    if (wallet) {
      wallet.pendingWithdrawal = Math.max(0, Number(((wallet.pendingWithdrawal || 0) - withdrawal.amount).toFixed(2)));
      wallet.totalWithdrawn = Number(((wallet.totalWithdrawn || 0) + withdrawal.amount).toFixed(2));

      wallet.transactions.unshift({
        type: 'WITHDRAWAL_PAID',
        amount: -withdrawal.amount,
        withdrawalId: withdrawal._id.toString(),
        description: `Payout completed by Admin: $${withdrawal.amount.toFixed(2)} to ${withdrawal.bankInfo?.bankName}`,
        createdAt: new Date(),
      });

      await wallet.save();
    }
    await withdrawal.save();
    return res.json({ message: 'Withdrawal marked as approved and paid', withdrawal, wallet });
  } catch (err) {
    // Memory fallback
    wallet = memoryWallets.find((w) => w.brand === withdrawal.brand);
    if (wallet) {
      wallet.pendingWithdrawal = Math.max(0, Number(((wallet.pendingWithdrawal || 0) - withdrawal.amount).toFixed(2)));
      wallet.totalWithdrawn = Number(((wallet.totalWithdrawn || 0) + withdrawal.amount).toFixed(2));
      wallet.transactions.unshift({
        type: 'WITHDRAWAL_PAID',
        amount: -withdrawal.amount,
        withdrawalId: withdrawal._id.toString(),
        description: `Payout completed by Admin: $${withdrawal.amount.toFixed(2)} to ${withdrawal.bankInfo?.bankName}`,
        createdAt: new Date(),
      });
    }
    return res.json({ message: 'Withdrawal marked as approved and paid', withdrawal, wallet });
  }
});

/**
 * @desc    Admin rejects withdrawal request and refunds money back to farm balance
 * @route   PUT /api/farm/admin/withdrawals/:id/reject
 * @access  Private/Admin
 */
export const rejectWithdrawal = asyncHandler(async (req, res) => {
  const { adminNotes } = req.body;

  let withdrawal;
  try {
    withdrawal = await WithdrawalRequest.findById(req.params.id);
  } catch (err) {
    // Fall through
  }

  if (!withdrawal) {
    withdrawal = memoryWithdrawals.find((w) => w._id.toString() === req.params.id);
  }

  if (!withdrawal) {
    res.status(404);
    throw new Error('Withdrawal request not found');
  }

  if (withdrawal.status !== 'PENDING') {
    res.status(400);
    throw new Error(`Withdrawal request is already ${withdrawal.status}`);
  }

  withdrawal.status = 'REJECTED';
  withdrawal.processedAt = new Date();
  withdrawal.adminNotes = adminNotes || 'Rejected by Admin';

  // Restore funds back to available balance
  let wallet;
  try {
    wallet = await FarmWallet.findOne({ brand: withdrawal.brand });
    if (wallet) {
      wallet.pendingWithdrawal = Math.max(0, Number(((wallet.pendingWithdrawal || 0) - withdrawal.amount).toFixed(2)));
      wallet.balance = Number(((wallet.balance || 0) + withdrawal.amount).toFixed(2));

      wallet.transactions.unshift({
        type: 'WITHDRAWAL_REJECTED',
        amount: withdrawal.amount,
        withdrawalId: withdrawal._id.toString(),
        description: `Withdrawal request refunded back to balance. Reason: ${adminNotes || 'Admin rejected'}`,
        createdAt: new Date(),
      });

      await wallet.save();
    }
    await withdrawal.save();
    return res.json({ message: 'Withdrawal request rejected and funds returned to farm balance', withdrawal, wallet });
  } catch (err) {
    // Memory fallback
    wallet = memoryWallets.find((w) => w.brand === withdrawal.brand);
    if (wallet) {
      wallet.pendingWithdrawal = Math.max(0, Number(((wallet.pendingWithdrawal || 0) - withdrawal.amount).toFixed(2)));
      wallet.balance = Number(((wallet.balance || 0) + withdrawal.amount).toFixed(2));
      wallet.transactions.unshift({
        type: 'WITHDRAWAL_REJECTED',
        amount: withdrawal.amount,
        withdrawalId: withdrawal._id.toString(),
        description: `Withdrawal request refunded back to balance: ${adminNotes || 'Admin rejected'}`,
        createdAt: new Date(),
      });
    }
    return res.json({ message: 'Withdrawal request rejected and funds returned to farm balance', withdrawal, wallet });
  }
});

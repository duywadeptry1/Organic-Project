import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import { checkProductStock, updateProductStock } from './productController.js';
import { creditFarmsForDeliveredOrder } from './farmController.js';

// In-memory fallback store for orders
let memoryOrders = [];

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Validate stock availability before creating order
  for (const item of orderItems) {
    const prodId = item._id || item.product;
    const stockCheck = await checkProductStock(prodId, item.qty);
    if (!stockCheck.available) {
      res.status(400);
      throw new Error(
        `Product "${stockCheck.name}" has insufficient stock (Available: ${stockCheck.countInStock}, Requested: ${item.qty})`
      );
    }
  }

  const userId = req.user?._id || 'demo-user-id';

  try {
    const mappedItems = orderItems.map((item) => ({
      ...item,
      product: item._id,
      brand: item.brand || 'Organi Farm',
      _id: undefined,
    }));

    const order = new Order({
      orderItems: mappedItems,
      user: userId,
      shippingAddress,
      paymentMethod,
      itemsPrice: Number(itemsPrice),
      taxPrice: Number(taxPrice),
      shippingPrice: Number(shippingPrice),
      totalPrice: Number(totalPrice),
    });

    const createdOrder = await order.save();
    return res.status(201).json(createdOrder);
  } catch (err) {
    // In-memory fallback
  }

  const newOrder = {
    _id: 'order-' + Date.now(),
    orderItems: orderItems.map((item) => ({
      ...item,
      product: item._id,
      brand: item.brand || 'Organi Farm',
    })),
    user: {
      _id: userId,
      name: req.user?.name || 'Customer',
      email: req.user?.email || 'customer@organi.com',
    },
    shippingAddress,
    paymentMethod,
    itemsPrice: Number(itemsPrice),
    taxPrice: Number(taxPrice),
    shippingPrice: Number(shippingPrice),
    totalPrice: Number(totalPrice),
    isPaid: false,
    isDelivered: false,
    createdAt: new Date().toISOString(),
  };

  memoryOrders.unshift(newOrder);
  res.status(201).json(newOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user?._id?.toString() || 'demo-user-id';

  try {
    const orders = await Order.find({ user: req.user._id });
    if (orders && orders.length > 0) {
      return res.json(orders);
    }
  } catch (err) {
    // Fall through
  }

  const userOrders = memoryOrders.filter(
    (o) => o.user?._id?.toString() === userId || o.user === userId || !o.user
  );
  res.json(userOrders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      return res.json(order);
    }
  } catch (err) {
    // Fall through
  }

  const order = memoryOrders.find((o) => o._id.toString() === req.params.id);
  if (order) {
    return res.json(order);
  }

  res.status(404);
  throw new Error('Order not found');
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer?.email_address,
      };

      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    }
  } catch (err) {
    // Fall through
  }

  const order = memoryOrders.find((o) => o._id.toString() === req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = new Date().toISOString();
    order.paymentResult = {
      id: req.body.id || 'paypal-tx-' + Date.now(),
      status: req.body.status || 'COMPLETED',
      update_time: new Date().toISOString(),
      email_address: req.body.payer?.email_address || 'buyer@organi.com',
    };
    return res.json(order);
  }

  res.status(404);
  throw new Error('Order not found');
});

// @desc    Update order to delivered and deduct in-stock inventory
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  let order;
  try {
    order = await Order.findById(req.params.id);
  } catch (err) {
    // Fall through
  }

  if (!order) {
    order = memoryOrders.find((o) => o._id.toString() === req.params.id);
  }

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Idempotency check: if order was already delivered, do not deduct stock again
  if (order.isDelivered) {
    return res.json(order);
  }

  // 1. Deduct in-stock for all items in order
  if (order.orderItems && order.orderItems.length > 0) {
    for (const item of order.orderItems) {
      const prodId = item.product || item._id;
      const qty = Number(item.qty) || 1;
      await updateProductStock(prodId, qty);
    }
  }

  // 2. Mark order as delivered
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  // 3. If COD order, mark as paid upon successful delivery
  if (!order.isPaid && order.paymentMethod === 'COD') {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: `COD_${Date.now()}`,
      status: 'COMPLETED_ON_DELIVERY',
      update_time: new Date().toISOString(),
      email_address: order.user?.email || 'customer@organi.com',
    };
  }

  // 4. Automatically credit delivered revenue to each farm/brand wallet
  try {
    await creditFarmsForDeliveredOrder(order);
  } catch (farmErr) {
    console.error('Error crediting farm wallet on delivery:', farmErr.message);
  }

  if (typeof order.save === 'function') {
    const updatedOrder = await order.save();
    return res.json(updatedOrder);
  }

  res.json(order);
});


// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    if (orders && orders.length > 0) {
      return res.json(orders);
    }
  } catch (err) {
    // Fall through
  }

  res.json(memoryOrders);
});

export default {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};



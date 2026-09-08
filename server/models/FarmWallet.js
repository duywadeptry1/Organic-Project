import mongoose from 'mongoose';

const farmTransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['DELIVERY_EARNING', 'WITHDRAWAL_REQUEST', 'WITHDRAWAL_PAID', 'WITHDRAWAL_REJECTED'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String,
    },
    orderNumber: {
      type: String,
    },
    productName: {
      type: String,
    },
    productImage: {
      type: String,
    },
    qty: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      default: 0,
    },
    customerName: {
      type: String,
    },
    description: {
      type: String,
    },
    withdrawalId: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const farmWalletSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    totalEarned: {
      type: Number,
      required: true,
      default: 0,
    },
    totalWithdrawn: {
      type: Number,
      required: true,
      default: 0,
    },
    pendingWithdrawal: {
      type: Number,
      required: true,
      default: 0,
    },
    transactions: [farmTransactionSchema],
  },
  {
    timestamps: true,
  }
);

const FarmWallet = mongoose.models.FarmWallet || mongoose.model('FarmWallet', farmWalletSchema);
export default FarmWallet;

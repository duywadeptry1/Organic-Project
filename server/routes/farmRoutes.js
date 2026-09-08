import express from 'express';
import {
  getMyFarmWallet,
  requestWithdrawal,
  getMyWithdrawals,
  updateFarmBankInfo,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from '../controllers/farmController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Farm Partner Routes
router.route('/wallet').get(protect, getMyFarmWallet);
router.route('/withdraw').post(protect, requestWithdrawal);
router.route('/withdrawals').get(protect, getMyWithdrawals);
router.route('/bank-info').put(protect, updateFarmBankInfo);

// Admin Routes for Payout Management
router.route('/admin/withdrawals').get(protect, admin, getAllWithdrawals);
router.route('/admin/withdrawals/:id/approve').put(protect, admin, approveWithdrawal);
router.route('/admin/withdrawals/:id/reject').put(protect, admin, rejectWithdrawal);

export default router;

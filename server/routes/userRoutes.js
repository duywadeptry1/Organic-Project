import express from 'express';
import { registerUser, authUser, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to register a new user
router.post('/', registerUser);
// Route to log in an existing user
router.post('/login', authUser);

// Profile routes (GET & PUT)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;



import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserProfile, createReview,getOnlineUsers } from '../controllers/userController.js';
const router = express.Router();

router.route('/profile').get(protect, getUserProfile);
router.route('/reviews').post(protect, createReview);
router.route('/online').get(protect, getOnlineUsers);

export default router;
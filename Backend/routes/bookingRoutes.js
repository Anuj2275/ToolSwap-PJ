import express from 'express';
import {
  createBookingRequest,
  getUserBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBookingRequest);

router.route('/my-bookings')
  .get(protect, getUserBookings);
  
router.route('/:id/status')
  .put(protect, updateBookingStatus);

export default router;
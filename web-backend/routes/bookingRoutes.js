import express from 'express';
import { createBooking, getUserBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';


const router = express.Router();

/* Route to create a new booking. Requires authentication using authMiddleware */
router.post('/', authMiddleware, createBooking);
/* Route to fetch all bookings for the authenticated user. Requires authentication using authMiddleware */
router.get('/', authMiddleware, getUserBookings);
/* Route to update booking status. Requires authentication and admin privileges using authMiddleware and adminMiddleware */
router.put('/:id', authMiddleware, adminMiddleware, updateBookingStatus);

export default router;
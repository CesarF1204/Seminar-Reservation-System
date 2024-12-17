import express from 'express';
import { createBooking, getUserBookings, getBookingsForNotification, updateBookingStatus } from '../controllers/bookingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import multer from 'multer';
import { check } from "express-validator";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 /* 5MB */
    }
});

/* Route to create a new booking. Requires authentication using authMiddleware */
router.post('/', authMiddleware, upload.single('proofOfPayment'), createBooking);

/* Route to fetch all bookings for the authenticated user. Requires authentication using authMiddleware */
router.get('/', authMiddleware, getUserBookings);

/* Route to get all bookings for notification/reminder. Requires authentication using authMiddleware */
router.get('/get_bookings', authMiddleware, getBookingsForNotification);

/* Route to update booking status. Requires authentication and admin privileges using authMiddleware and adminMiddleware */
router.put('/:id', 
    authMiddleware, 
    adminMiddleware,
    [
        check('paymentStatus')
            .isLength({ min: 1 }).withMessage('Payment Status is required'),
    ],
    updateBookingStatus
);

export default router;
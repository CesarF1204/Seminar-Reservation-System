import Booking from '../models/Booking.js';
import Seminar from '../models/Seminar.js';

/**
* DOCU: This function is used to handle the booking of a seminar. <br>
* This is being called when user wants to book a seminar. <br>
* Last Updated Date: December 6, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const createBooking = async (req, res) => {
    try {
        const { seminarId } = req.body;

        /* Find the seminar by its ID */
        const seminar = await Seminar.findById(seminarId);

        /* Check if the seminar exists */
        if (!seminar) return res.status(404).json({ message: 'Seminar not found' });
        
        /* Check if the seminar has available slots */
        if (seminar.slotsAvailable <= 0) return res.status(400).json({ message: 'Seminar is full' });

        /* Create a booking record for the user and seminar */
        const booking = await Booking.create({ user: req.user.id, seminar: seminarId });
        
        /* Decrement the available slots for the seminar */
        seminar.slotsAvailable -= 1;
        await seminar.save();

        res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error });
    }
};

/**
* DOCU: This function is used to fetch all booked seminars. <br>
* This is being called when user wants fetch booked seminars. <br>
* Last Updated Date: December 6, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const getUserBookings = async (req, res) => {
    try {
        /* Find all bookings for the logged-in user and populate the seminar details */
        const bookings = await Booking.find({ user: req.user.id }).populate('seminar');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};

/**
* DOCU: This function is used to update a booked seminar. <br>
* This is being called when admin wants to update the status of a booked seminar. <br>
* Last Updated Date: December 6, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const updateBookingStatus = async (req, res) => {
    try {
        /* Extract the booking ID from the request parameters and paymentStatus from the body */
        const { id } = req.params;
        const { paymentStatus } = req.body;

        /* Validate the paymentStatus to ensure it is one of the allowed values */
        if (!['pending', 'confirmed', 'rejected'].includes(paymentStatus)) {
        return res.status(400).json({ message: 'Invalid payment status' });
        }

        /* Find the booking by ID and update its payment status */
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { paymentStatus },
            { new: true, runValidators: true }
        );

        /* Check if the booking exists */
        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        /* Respond with the updated booking details */
        res.status(200).json({
            message: 'Booking status updated successfully',
            booking: updatedBooking,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking status', error });
    }
};

export { createBooking, getUserBookings, updateBookingStatus };
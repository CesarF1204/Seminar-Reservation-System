import Booking from '../models/Booking.js';
import Seminar from '../models/Seminar.js';
import User from '../models/User.js';
import { getUploadedImageUrl } from '../helpers/globalHelper.js';
import createPaymentIntent from '../utils/stripe.js';

/**
* DOCU: This function is used to handle the booking of a seminar. <br>
* This is being called when user wants to book a seminar. <br>
* Last Updated Date: December 14, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const createBooking = async (req, res) => {
    try {
        /* Get seminar id from request body */
        const { seminarId } = req.body;

        /* Find the seminar by its ID */
        const seminar = await Seminar.findById(seminarId);

        /* Check if the seminar exists */
        if (!seminar) return res.status(404).json({ message: 'Seminar not found' });
        
        /* Check if the seminar has available slots */
        if (seminar.slotsAvailable <= 0) return res.status(400).json({ message: 'Seminar is full' });

        let proofOfPayment = "";
        let clientSecret = null;

        /* Check if there is an uploaded proof of payment */
        if (req.file) {
            const image_url = await getUploadedImageUrl(req.file);
            proofOfPayment = image_url;
        } else {
            /* Desctructure to get amount and title of the seminar */
            const { fee: amount, title } = seminar;

            /* Find the user by its ID */
            const user = await User.findById(req.user.id).select('email');

            /* Check if user exists */
            if (!user) return res.status(404).json({ message: 'User not found' });
            
            /* Contruct the payment data */
            const payment_data = {
                amount,
                title,
                email: user.email
            }

            /* Call createPaymentIntentHandler for Credit Card Payment */
            const response = await createPaymentIntentHandler(payment_data);
            clientSecret = response.clientSecret;
        }

        /* Create a booking record in the database with proof of payment */
        const booking = await Booking.create({ user: req.user.id, seminar: seminarId, proofOfPayment });

        /* Decrement the available slots for the seminar */
        seminar.slotsAvailable -= 1;

        /* Save the seminar updates to the database */
        await seminar.save();

        res.status(201).json({ message: 'Booking created successfully', booking, clientSecret });
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

/**
* DOCU: This function is used for payment intent using stripe api. <br>
* This is being called when user book a seminar using credit card. <br>
* Last Updated Date: December 14, 2024 <br>
* @function
* @param {object} payment_data - { amount - seminar fee, title - seminar title, email - user email address }
* @author Cesar
*/
const createPaymentIntentHandler = async (payment_data) => {
    try {

        /* Check if amount is provided, return error if not */
        if (!payment_data.amount) {
            throw new Error('Amount is required');
        }

        /* Call paymentIntent function to create the payment intent with amount and description */
        const paymentIntent = await createPaymentIntent(payment_data);

        /* Respond with the client secret for the payment intent */
        return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
        throw new Error('Error creating payment intent', error.message);
    }
};

export { createBooking, getUserBookings, updateBookingStatus };
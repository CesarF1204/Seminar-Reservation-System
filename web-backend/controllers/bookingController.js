import Booking from '../models/Booking.js';
import Seminar from '../models/Seminar.js';
import User from '../models/User.js';
import { getUploadedImageUrl, paginationAndSorting } from '../helpers/globalHelper.js';
import mongoose from 'mongoose';
import createPaymentIntent from '../utils/stripe.js';
import { 
    sendEmailBookingReservation, 
    sendEmailConfirmedReservation, 
    sendEmailRejectedReservation,
    sendEmailPendingReservation,
} from '../helpers/emailTemplate.js';


/**
* DOCU: This function is used to handle the booking of a seminar. <br>
* This is being called when user wants to book a seminar. <br>
* Last Updated Date: December 15, 2024 <br>
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

        /* Find the user by its ID */
        const user = await User.findById(req.user.id).select('firstName lastName email');

        /* Check if user exists */
        if (!user) return res.status(404).json({ message: 'User not found' });

        let proofOfPayment = "";
        let clientSecret = null;

        /* Check if there is an uploaded proof of payment */
        if (req.file) {
            const image_url = await getUploadedImageUrl(req.file);
            proofOfPayment = image_url;
        } else {
            /* Desctructure to get amount and title of the seminar */
            const { fee: amount, title } = seminar;

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

        /* Call sendEmailBookingReservation to send an email automatically when booking a seminar */
        await sendEmailBookingReservation(user, seminar);

        /* Create a booking record in the database with proof of payment */
        const booking = await Booking.create({ user: req.user.id, seminar: seminarId, proofOfPayment });

        /* Check if booking is created successfully */
        if(booking){
            /* Decrement the available slots for the seminar */
            seminar.slotsAvailable -= 1;
            /* Save the seminar updates to the database */
            await seminar.save();

            res.status(201).json({ message: 'Booking created successfully', booking, clientSecret });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error });
    }
};

/**
* DOCU: This function is used to fetch booked seminars. <br>
* This is being called when admin or user wants fetch booked seminars. <br>
* Last Updated Date: December 16, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const getUserBookings = async (req, res) => {
    try {
        /* Get needed data from user request */
        const { id: user_id , role } = req.user;

        /* Get needed data from query request */
        const { page, limit, sortKey, sortDirection } = req.query;

        /* Call paginationAndSorting helper function to implement pagination and sorting */
        const { pageNumber, limitNumber, skip, sort } = paginationAndSorting({ page, limit, sortKey, sortDirection });

        /* If role is admin find all bookings, if not find all bookings for the logged-in user
            then populate the user and seminar details */
        const matchUserIdBasedOnRole = role !== 'admin' ? { 'user._id':  new mongoose.Types.ObjectId(user_id) } : {};

        /* Query to Bookings DB implementing pagination and sorting with per page limitation */
        const bookings = await Booking.aggregate([
            {
                $lookup: {
                    from: 'seminars',
                    localField: 'seminar',
                    foreignField: '_id',
                    as: 'seminar'
                }
            },
            {
                $unwind: '$seminar'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $match: matchUserIdBasedOnRole
            },
            {
                $sort: sort
            },
            {
                $skip: skip
            },
            {
                $limit: limitNumber
            },
            {
                $project: {
                    'user._id': 1,
                    'user.firstName': 1,
                    'user.lastName': 1,
                    'user.email': 1,
                    'seminar': 1,
                    paymentStatus: 1,
                    proofOfPayment: 1,
                },
            },
        ]);

        /* Get the total count of documents for pagination */
        const totalCount = await Booking.countDocuments(role !== 'admin' ? {user: user_id} : {});

        res.status(200).json({
            bookings,
            totalCount,
            totalPages: Math.ceil(totalCount / limitNumber),
            currentPage: pageNumber,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};

/**
* DOCU: This function is used to fetch booked seminars for notification/reminder purpose. <br>
* This is being called to fetch booked seminars for notification/reminder. <br>
* Last Updated Date: December 16, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const getBookingsForNotification = async(req, res) => {
    try {
        const { id: user_id, role } = req.user;

        /* If role is admin find all bookings, if not find all bookings for the logged-in user
            then populate the user and seminar details */
        const bookings = await Booking.find(role !== 'admin' ? {user: user_id} : {})
            .populate({
                path: 'user',
                select: 'firstName lastName email',
                })
            .populate('seminar');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};

/**
* DOCU: This function is used to update a booked seminar. <br>
* This is being called when admin wants to update the status of a booked seminar. <br>
* Last Updated Date: December 15, 2024 <br>
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

        /* Get booking details by booking id */
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        /* Get seminar details by seminar id found in booking */
        const seminar = await Seminar.findById(booking.seminar);
        if (!seminar) {
            return res.status(404).json({ message: 'Seminar not found' });
        }

        /* Get seminar details by seminar id found in booking */
        const user = await User.findById(booking.user).select('firstName lastName email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        /* Validate the paymentStatus to ensure it is one of the allowed values */
        if (!['pending', 'confirmed', 'rejected'].includes(paymentStatus)) {
            return res.status(400).json({ message: 'Invalid payment status' });
        }

        /* Check if the updated booking status is confirmed then call sendEmailConfirmedReservation to send confirmation email for booked seminar */
        if(paymentStatus === 'confirmed'){
            await sendEmailConfirmedReservation(user, seminar);
        }
        /* Else if the updated booking status is rejected then call sendEmailRejectedReservation to send cancellation/rejection email for booked seminar */
        else if(paymentStatus === 'rejected'){
            await sendEmailRejectedReservation(user, seminar);
        }
        /* Else if the updated booking status is pending then call sendEmailPendingReservation to send pending email for booked seminar */
        else if(paymentStatus === 'pending'){
            await sendEmailPendingReservation(user, seminar);
        }
        else{
            return res.status(400).json({ message: 'Invalid status. Cannot send email.' });
        }

        /* Call updateSeminarSlots function to update seminar slots available */
        await updateSeminarSlots(booking, seminar, paymentStatus);

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
* DOCU: This function is used to validate and update seminar slots <br>
* This is being called when admin wants to update the status of a booked seminar and the slots will be updated as well. <br>
* This is triggered when admin updates booking status (pending, confirmed, or rejected)
* Last Updated Date: December 15, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const updateSeminarSlots = async (booking, seminar, paymentStatus) => {
    /* Get the current payment status */
    const currentPaymentStatus = booking.paymentStatus;

    /* If the new payment status is 'rejected', increment slotsAvailable only if the current payment status is 'pending' or 'confirmed'
        else if the new payment status is 'pending' or 'confirmed' and the current payment status is 'rejected', decrement slotsAvailable */
    if (paymentStatus === 'rejected' && (currentPaymentStatus === 'pending' || currentPaymentStatus === 'confirmed')) {
        seminar.slotsAvailable += 1;
    } else if ((paymentStatus === 'pending' || paymentStatus === 'confirmed') && currentPaymentStatus === 'rejected') {
        seminar.slotsAvailable -= 1;
    }

    /* Save the updated seminar */
    await seminar.save();
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


export { createBooking, getUserBookings, getBookingsForNotification, updateBookingStatus };
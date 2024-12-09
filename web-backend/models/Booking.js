import mongoose from 'mongoose';

/**
* DOCU: Defines the schema for a seminar booking <br>
* It specifies the fields and their validation rules for a booking record <br>
* Last Updated Date: December 6, 2024 <br>
* @constant bookingSchema
* @type {Schema}
* @description Defines the Mongoose schema for seminar bookings, including references to users and seminars, payment status, and proof of payment.
* @property {ObjectId} user - A reference to the user making the booking. This field is required.
* @property {ObjectId} seminar - A reference to the seminar being booked. This field is required.
* @property {String} paymentStatus - The payment status of the booking. Options are 'pending', 'confirmed', or 'rejected'. Defaults to 'pending'.
* @property {String} proofOfPayment - A string representing the uploaded proof of payment (if any).
* @property {Date} createdAt - Timestamp of when the booking was created (automatically added by Mongoose).
* @property {Date} updatedAt - Timestamp of when the booking was last updated (automatically added by Mongoose).
* @author Cesar
*/
const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seminar: { type: mongoose.Schema.Types.ObjectId, ref: 'Seminar', required: true },
    paymentStatus: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
    proofOfPayment: String,
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
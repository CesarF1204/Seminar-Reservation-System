import mongoose from 'mongoose';

/**
* DOCU: Defines the schema for a seminar <br>
* It specifies the fields and their validation rules for a seminar record <br>
* Last Updated Date: December 6, 2024 <br>
* @constant seminarSchema
* @type {Schema}
* @description Defines the Mongoose schema for seminars, including details about the title, description, date, speaker, and fees.
* @property {String} title - The title of the seminar. This field is required.
* @property {String} description - A brief description of the seminar. This field is required.
* @property {Date} date - The date of the seminar. This field is required.
* @property {Object} timeFrame - The time frame for the seminar, including 'from' and 'to' times (both required).
* @property {String} venue - The venue where the seminar will take place. This field is required.
* @property {Object} speaker - Information about the speaker, including name (required), image (optional), and LinkedIn profile (optional).
* @property {Number} fee - The registration fee for the seminar. This field is required.
* @property {Number} slotsAvailable - The number of available slots for attendees. This field is required.
* @property {Date} createdAt - Timestamp of when the seminar was created (automatically added by Mongoose).
* @property {Date} updatedAt - Timestamp of when the seminar was last updated (automatically added by Mongoose).
* @author Cesar
*/
const seminarSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    timeFrame: {
        from: { type: String, required: true },
        to: { type: String, required: true },
    },
    venue: { type: String, required: true },
    speaker: { name: { type: String, required: true }, image: String, linkedin: String },
    fee: { type: Number, required: true },
    slotsAvailable: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Seminar', seminarSchema);
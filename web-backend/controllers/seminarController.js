import Seminar from '../models/Seminar.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import cloudinary from 'cloudinary';
import { validationResult } from "express-validator";
import { paginationAndSorting } from '../helpers/globalHelper.js';
import { sendEmailNewSeminar, sendEmailUpdatedSeminar } from '../helpers/emailTemplate.js';
import mongoose from 'mongoose';

/**
* DOCU: This function is used to fetch all seminars. <br>
* This is being called when user wants fetch all seminars. <br>
* Last Updated Date: December 20, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const getSeminars = async (req, res) => {
    try {
        /* Get needed data from query request */
        const { page, limit, sortKey, sortDirection, search } = req.query;

        /* Call paginationAndSorting helper function to implement pagination and sorting */
        const { pageNumber, limitNumber, skip, sort } = paginationAndSorting({ page, limit, sortKey, sortDirection });

        /* Initialize an empty filter object */
        const filter = {};
        if(search){
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { 'speaker.name': { $regex: search, $options: 'i' } },
            ];        
        }

        /* Check if the authenticated user is not an admin */
        if(req.user.role !== 'admin'){
            /* Get the date today */
            const today = new Date();
            /* Filter the seminar date, dont show the expired seminars or the date is less than today. */
            filter.date = { $gte: today };
        }

        /* This will be pass to the query handle case sensitive data */
        const collation = { locale: 'en', strength: 2 };
        
        /* Query to Seminars DB implementing pagination and sorting with per page limitation */
        const seminars = await Seminar.find(filter)
            .collation(collation) /* use collation to handle case sensitive data */
            .sort(sort)
            .skip(skip)
            .limit(limitNumber);

        /* Get the total count of documents for pagination */
        const totalCount = await Seminar.countDocuments(filter);

        res.status(200).json({
            seminars,
            totalCount,
            totalPages: Math.ceil(totalCount / limitNumber),
            currentPage: pageNumber,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching seminars', error });
    }
};

/**
* DOCU: This function is used to create a seminar. <br>
* This is being called when admin wants to create a seminar. <br>
* Last Updated Date: December 20, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const createSeminar = async (req, res) => {
    try {
        /* Handle validation errors */
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array().map(error => error.msg) });
        }

        /* Create a new seminar using the data from the request body */
        const seminar = await Seminar.create(req.body);
        
        /* Get the uploaded image file from the request */
        const image_file = req?.file;

        if(image_file){
            /* Convert the image file buffer into a base64 encoded string */
            const convert_to_base64 = Buffer.from(image_file.buffer).toString("base64");
            
            /* Construct the data URI for the image */
            let dataURI = `data:${image_file.mimetype};base64,${convert_to_base64}`;

            /* Upload the image to Cloudinary and get the image URL */
            const upload_result = await cloudinary.v2.uploader.upload(dataURI);

            /* Assign and save to seminar the uploaded image URL to the speaker's image field */
            seminar.speaker.image = upload_result.url; 
        }

        /* Save the new seminar created to DB */
        const new_seminar = await seminar.save();

        /* Check if new_seminar is created and exists */
        if(new_seminar){
            /* Query to Users db to get all users, excluding password */
            const users = await User.find().select('-password');

            /* Check if the user emails not found found */
            if (!users) return res.status(404).json({ message: 'User not found' });
            
            const users_data = [];
            /* Loop through users to get only the users who's role is 'user' and add it to users_data array */
            for (let i = 0; i < users.length; i++) {
                if (users[i].role === 'user') {
                    users_data.push(users[i]);
                }
            }

            /* Call sendEmailNewSeminar for sending email for new seminar created */
            await sendEmailNewSeminar(users_data, new_seminar);
        }

        res.status(201).json({ message: 'Seminar created successfully', seminar });
    } catch (error) {
        res.status(500).json({ message: 'Error creating seminar', error });
    }
};

/**
* DOCU: This function is used to update a seminar. <br>
* This is being called when admin wants to update a seminar. <br>
* Last Updated Date: December 20, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const updateSeminar = async (req, res) => {
    try {
        /* Handle validation errors */
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array().map(error => error.msg) });
        }

        /* Get the updated seminar details from the request */
        const seminar_to_update = req.body;

        /* Get the updated image file from the request */
        const image_file = req.file;

        if(image_file){
            /* Convert the image file buffer into a base64 encoded string */
            const convert_to_base64 = Buffer.from(image_file.buffer).toString("base64");
            
            /* Construct the data URI for the image */
            let dataURI = `data:${image_file.mimetype};base64,${convert_to_base64}`;

            /* Upload the image to Cloudinary and get the image URL */
            const upload_result = await cloudinary.v2.uploader.upload(dataURI);

            /* Assign and save to seminar_to_update the updated image URL to the speaker's image field */
            seminar_to_update['speaker.image'] = upload_result.url;
        }

        /* Update the seminar by ID with the new data from the request body */
        const updated_seminar = await Seminar.findByIdAndUpdate(req.params.id, seminar_to_update, { new: true });

        /* Check if updating the seminar is successful */
        if(updated_seminar){
            /* Query to the Bookings database to retrieve the users that has a pending or confirmed status who have book the selected seminar */
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
                    $match: {
                        'seminar._id':  new mongoose.Types.ObjectId(req.params.id),
                        'paymentStatus': { $in: ['pending', 'confirmed'] }
                    }
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
                    $project: {
                        'user.firstName': 1,
                        'user.lastName': 1,
                        'user.email': 1,
                    },
                },
            ]);

            const users_data = [];
            /* Loop through bookings to get only the users details add it to users_data array */
            for (let i = 0; i < bookings.length; i++) {
                users_data.push(bookings[i].user);
            }

            /* Call sendEmailUpdatedSeminar for sending email for the updated seminar details */
            await sendEmailUpdatedSeminar(users_data, updated_seminar);
        }

        res.status(200).json({ message: 'Seminar updated successfully', seminar: updated_seminar });
    } catch (error) {
        res.status(500).json({ message: 'Error updating seminar', error });
    }
};

/**
* DOCU: This function is used to delete a seminar. <br>
* This is being called when admin wants to update a seminar. <br>
* Last Updated Date: December 6, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const deleteSeminar = async (req, res) => {
    try {
        /* Delete the seminar by ID */
        await Seminar.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Seminar deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting seminar', error });
    }
};

/**
* DOCU: This function is used to fetch the details for an specific seminar. <br>
* This is being called when user wants to fetch the details for an specific seminar. <br>
* Last Updated Date: December 6, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const getSeminarDetails = async (req, res) => {
    try {
        /* Fetch the seminar by ID */
        const seminar = await Seminar.findById(req.params.id);

        /* Check if seminar is not found then respond with a 404 status */
        if (!seminar) return res.status(404).json({ message: 'Seminar not found' });
        res.status(200).json(seminar);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching seminar details', error: error.message });
    }
};

/**
* DOCU: This function is used to get the coordinates (longtitude, latitude) of the given address. <br>
* This is being called on seminar details, getting the coordinates to use on the minimap. <br>
* Last Updated Date: December 21, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const getCoordinates = async (req, res) => {
    /* Get address from query string */
    const { address } = req.query;
    /* Construct the URL to query the Nominatim API with the provided address */
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    try{
        /* Make a request to the Nominatim API */
        const response = await fetch(url);

        const data = await response.json();

        /* Check if the response contains at least one result */
        if(data.length > 0){
            /* Extract latitude and longitude from the first result */
            const { lat, lon } = data[0];

            res.json({ lat: parseFloat(lat), lon: parseFloat(lon) });
        }
        else{
            res.status(404).json({ error: 'No results found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching coordinates' });
    }
}

export { 
    getSeminars, 
    createSeminar, 
    updateSeminar, 
    deleteSeminar, 
    getSeminarDetails,
    getCoordinates,
};
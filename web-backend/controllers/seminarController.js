import Seminar from '../models/Seminar.js';
import cloudinary from 'cloudinary';

/**
* DOCU: This function is used to fetch all seminars. <br>
* This is being called when user wants fetch all seminars. <br>
* Last Updated Date: December 6, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const getSeminars = async (req, res) => {
    try {
        /* Fetch all seminars from the database */
        const seminars = await Seminar.find();
        res.status(200).json(seminars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching seminars', error });
    }
};

/**
* DOCU: This function is used to create a seminar. <br>
* This is being called when admin wants to create a seminar. <br>
* Last Updated Date: December 10, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const createSeminar = async (req, res) => {
    try {
        /* Get the uploaded image file from the request */
        const imageFile = req.file;

        /* Create a new seminar using the data from the request body */
        const seminar = await Seminar.create(req.body);

        /* Convert the image file buffer into a base64 encoded string */
        const convert_to_base64 = Buffer.from(imageFile.buffer).toString("base64");
        
        /* Construct the data URI for the image */
        let dataURI = `data:${imageFile.mimetype};base64,${convert_to_base64}`;

        /* Upload the image to Cloudinary and get the image URL */
        const uploadResult = await cloudinary.v2.uploader.upload(dataURI);

        /* Assign and save to seminar the uploaded image URL to the speaker's image field */
        seminar.speaker.image = uploadResult.url; 
        await seminar.save();

        res.status(201).json({ message: 'Seminar created successfully', seminar });
    } catch (error) {
        res.status(500).json({ message: 'Error creating seminar', error });
    }
};

/**
* DOCU: This function is used to update a seminar. <br>
* This is being called when admin wants to update a seminar. <br>
* Last Updated Date: December 6, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const updateSeminar = async (req, res) => {
    try {
        /* Update the seminar by ID with the new data from the request body */
        const updatedSeminar = await Seminar.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Seminar updated successfully', seminar: updatedSeminar });
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

export { getSeminars, createSeminar, updateSeminar, deleteSeminar, getSeminarDetails };
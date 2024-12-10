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
        
        await seminar.save();

        res.status(201).json({ message: 'Seminar created successfully', seminar });
    } catch (error) {
        res.status(500).json({ message: 'Error creating seminar', error });
    }
};

/**
* DOCU: This function is used to update a seminar. <br>
* This is being called when admin wants to update a seminar. <br>
* Last Updated Date: December 10, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const updateSeminar = async (req, res) => {
    try {
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

export { getSeminars, createSeminar, updateSeminar, deleteSeminar, getSeminarDetails };
import User from '../models/User.js';
import cloudinary from 'cloudinary';

/**
* DOCU: This function is used to fetch profile of a user. <br>
* This is being called when admin wants to fetch the details for an specific user. <br>
* Last Updated Date: December 6, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const getProfile = async (req, res) => {
    try {
        /* Fetch the user by ID, excluding the password field for security purposes */
        const user = await User.findById(req.user.id).select('-password');
        
        /* Check if the user was found */
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

/**
* DOCU: This function is used to update profile of a user. <br>
* This is being called when admin wants to update the details for an specific user. <br>
* Last Updated Date: December 6, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const updateProfile = async (req, res) => {
    try {
        /* Extract firstName and lastName from the request body */
        const { firstName, lastName } = req.body;

        /* Update the user's profile and return the updated document */
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, /* ID of the user to update */
            { firstName, lastName }, /* Data to update */
            { new: true, runValidators: true } /* Options: return updated document and run validators */
        );

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
};

/**
* DOCU: This function is used to update profile of a user. <br>
* This is being called when admin wants to update the details for an specific user. <br>
* Last Updated Date: December 11, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const updateProfilePicture = async (req, res) => {
    try {
        /* Get the uploaded image file from the request */
        const image_file = req?.file;

        if(image_file){
            /* Convert the image file buffer into a base64 encoded string */
            const convert_to_base64 = Buffer.from(image_file.buffer).toString("base64");
            
            /* Construct the data URI for the image */
            let dataURI = `data:${image_file.mimetype};base64,${convert_to_base64}`;

            /* Upload the image to Cloudinary and get the image URL */
            const upload_result = await cloudinary.v2.uploader.upload(dataURI);
            console.log('upload_result.url :>> ', upload_result.url);
            /* Update the user's profile and return the updated document */
            const updatedProfilePicture = await User.findByIdAndUpdate(
                req.user.id, /* ID of the user to update */
                { profilePicture: upload_result.url }, /* Data to update */
                { new: true, runValidators: true } /* Options: return updated document and run validators */
            );

            res.status(200).json({ message: 'Profile picture updated successfully', user: updatedProfilePicture });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile picture', error });
    }
};

export { getProfile, updateProfile, updateProfilePicture };
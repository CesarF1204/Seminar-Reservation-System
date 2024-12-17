import User from '../models/User.js';
import { sendEmailAccountRecovery } from '../helpers/emailTemplate.js';
import { paginationAndSorting, getUploadedImageUrl } from '../helpers/globalHelper.js';
import { validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
* DOCU: This function is used to fetch users. <br>
* This is being called when admin wants to fetch users. <br>
* Last Updated Date: December 17, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const fetchUsers = async (req, res) => {
    try {
        /* Get needed data from query request */
        const { page, limit, sortKey, sortDirection, search } = req.query;

        /* Call paginationAndSorting helper function to implement pagination and sorting */
        const { pageNumber, limitNumber, skip, sort } = paginationAndSorting({ page, limit, sortKey, sortDirection });

        /* Initialize an empty filter object */
        const filter = {};
        /* Check if a search term is provided */
        if(search){
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } }, // Case-insensitive search on firstName
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }    // Case-insensitive search on lastName
            ];        
        }

        /* This will be pass to the query handle case sensitive data */
        const collation = { locale: 'en', strength: 2 };

        /* Fetch all the registered users, excluding the password field for security purposes */
        const users = await User.find(filter)
            .select('-password')
            .collation(collation) /* use collation to handle case sensitive data */
            .sort(sort)
            .skip(skip)
            .limit(limitNumber);
        
        /* Check if there are registered user found */
        if (!users) return res.status(404).json({ message: 'No registered user found' });

        /* Get the total count of documents for pagination */
        const totalCount = await User.countDocuments(filter);

        res.status(200).json({
            users,
            totalCount,
            totalPages: Math.ceil(totalCount / limitNumber),
            currentPage: pageNumber,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

/**
* DOCU: This function is used to fetch profile of a user. <br>
* This is being called when admin wants to fetch the details for an authenticated user. <br>
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
* DOCU: This function is used to fetch profile details of an specific user. <br>
* This is being called when admin wants to fetch the details for an specific user. <br>
* Last Updated Date: December 12, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const fetchUserById = async (req, res) => {
    try {
        /* Fetch the user by ID, excluding the password field for security purposes */
        const user = await User.findById(req.params.id).select('-password');
        
        /* Check if the user was found */
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

/**
* DOCU: This function is used to update specific user. <br>
* This is being called when admin wants to update the details for an specific user. <br>
* Last Updated Date: December 12, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const updateUserById = async (req, res) => {
    try {
        /* Handle validation errors */
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        /* Extract the needed data from the request body */
        const { firstName, lastName, email } = req.body;

        let updatedData = {};

        /* Update fields only if new values are provided */
        if (firstName) updatedData.firstName = firstName;
        if (lastName) updatedData.lastName = lastName;
        if (email) updatedData.email = email;

        /* Update the user's profile and return the updated document */
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, /* ID of the user to update */
            updatedData, /* Data to update */
            { new: true, runValidators: true } /* Options: return updated document and run validators */
        );

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

/**
* DOCU: This function is used to update profile of a user. <br>
* This is being called when admin or user wants to update their details (firstName, lastName, email) and change password. <br>
* Last Updated Date: December 11, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const updateProfile = async (req, res) => {
    try {
        /* Handle validation errors */
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        /* Extract the needed data from the request body */
        const { firstName, lastName, email, password } = req.body;

        let updatedData = {};

        /* Update fields only if new values are provided */
        if (firstName) updatedData.firstName = firstName;
        if (lastName) updatedData.lastName = lastName;
        if (email) updatedData.email = email;

        /* Check if a password is provided before proceeding with hashing */
        if(password){
            /* Hash the new password before saving */
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        /* Update the user's profile and return the updated document */
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, /* ID of the user to update */
            updatedData, /* Data to update */
            { new: true, runValidators: true } /* Options: return updated document and run validators */
        );

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
};

/**
* DOCU: This function is used to update profile of a user. <br>
* This is being called when user wants to change/update their profile picture. <br>
* Last Updated Date: December 17, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const updateProfilePicture = async (req, res) => {
    try {
        /* Check if there is an uploaded image file */
        if(req.file){
            /* Call getUploadedImageUrl helper to get the image url uploaded */
            const image_url = await getUploadedImageUrl(req.file);

            /* Update the user's profile and return the updated document */
            const updatedProfilePicture = await User.findByIdAndUpdate(
                req.user.id, /* ID of the user to update */
                { profilePicture: image_url }, /* Data to update */
                { new: true, runValidators: true } /* Options: return updated document and run validators */
            );

            res.status(200).json({ message: 'Profile picture updated successfully', user: updatedProfilePicture });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile picture', error });
    }
};

/**
* DOCU: This function is used to update role or restriction of a registered user. <br>
* This is being called when admin wants to update the role or restriction of an specific user. <br>
* Last Updated Date: December 12, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const updateRoleOrRestriction = async (req, res) => {
    try {
        /* Handle validation errors */
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        /* Extract the needed data from the request body */
        const { user_id, role, isDisabled } = req.body;

        let updatedData = {};

        /* Update fields only if new values are provided */
        if (role) updatedData.role = role;
        if (isDisabled) updatedData.isDisabled = isDisabled;

        /* Update the user's role and return the updated document */
        const updatedUser = await User.findByIdAndUpdate(
            user_id, /* ID of the user to update */
            updatedData, /* Data to update */
            { new: true, runValidators: true } /* Options: return updated document and run validators */
        );

        res.status(200).json({ message: 'User Updated Successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

/**
* DOCU: This function is used to delete an account. <br>
* This is being called when admin wants to delete an account. <br>
* Last Updated Date: December 12, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const deleteAccount = async (req, res) => {
    try {
        /* Delete the account by ID */
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error });
    }
};

/**
* DOCU: This function is used in getting user details and checking for the passwordResetToken for reset password link validation. <br>
* This is being called when user requested for password reset. <br>
* Last Updated Date: December 13, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const resetPasswordLink = async (req, res) => {
    try{
        const { token } = req.params;
    
        /* Find the user by the passwordResetToken */
        const user = await User.findOne({ passwordResetToken: token }).select('firstName lastName email passwordResetExpires passwordResetToken');

        /* Check if user data is provided or the data in passwordResetExpires is expired  */
        if (!user || user.passwordResetExpires < Date.now()) {
            return res.status(404).json({ message: 'Invalid or expired link' });
        }

        res.status(200).json({ message: 'Reset Password', user});
    }catch(error){
        res.status(500).json({ message: 'Invalid Link', error });
    }
};

/**
* DOCU: This function is used for updating password in request for resetting password. <br>
* This is being called when user will reset their password. <br>
* Last Updated Date: December 13, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const resetPassword = async (req, res) => {
    try {
        /* Handle validation errors */
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        /* Extract the needed data from the request body */
        const { user_id, password } = req.body;

        let updatedData = {};
        /* Check if user_id and password is provided before proceeding with hashing */
        if(user_id && password){
            /* Hash the new password before saving */
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        /* Update the user's password by user_id */
        const updatedPassword = await User.findByIdAndUpdate(
            user_id, /* ID of the user to update */
            updatedData, /* Data to update */
            { new: true, runValidators: true } /* Options: return updated document and run validators */
        );

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error });
    }
};

/**
* DOCU: This function is used to send an email for account recovery.
* This is being called when the user forgot their password and want for an account recovery. <br>
* Last Updated Date: December 17, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const accountRecovery = async (req, res) => {
    try {
        /* Handle validation errors */
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array().map(error => error.msg) });
        }

        /* Extract the email from the request body */
        const { email } = req.body;

        /* Get the user details by using email address */
        const user = await User.findOne({ email }).select('firstName lastName email');

        /* Check if the user was not found */
        if (!user) {
            return res.status(400).send('User not found');
        }

        /* Generate a token and expiration time for password reset */
        const token = crypto.randomBytes(20).toString('hex');
        const expiration = Date.now() + 3600000;

        /* Save the token and expiration time to the user's record in database */
        user.passwordResetToken = token;
        user.passwordResetExpires = expiration;
        await user.save();

        /* Create the password recovery URL to be sent in the email */
        const recoveryUrl = `${process.env.FRONTEND_URL}/reset_password/${token}`;

        await sendEmailAccountRecovery(user, recoveryUrl);

        res.status(200).json({ message: 'Email Sent Successfully For Account Recovery' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email for account recovery', error });
    }
};

export { 
    getProfile, 
    updateProfile, 
    updateProfilePicture, 
    fetchUsers,
    updateRoleOrRestriction,
    deleteAccount,
    fetchUserById,
    updateUserById,
    resetPasswordLink,
    resetPassword,
    accountRecovery,
};
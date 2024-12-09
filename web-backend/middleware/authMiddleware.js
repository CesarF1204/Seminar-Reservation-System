import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
* DOCU: This function is used as a middleware to authenticate users based on a token provided in the Authorization header. <br>
* This is being called when user logged-in and token will be created. <br>
* Last Updated Date: December 6, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @param next - A callback function to pass control to the next middleware in the chain
* @author Cesar
*/
const authMiddleware = async (req, res, next) => {
    /* Extract token from the Authorization header (Bearer <token>) */
    const token = req.header('Authorization')?.split(' ')[1];

    /* Check if no token is provided, respond with an authorization error */
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        /* Verify the token using the secret key */
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        /* Fetch user details by ID from the decoded token and exclude the password field */
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

/**
* DOCU: This function is used as a middleware to verify tokens sent as cookies. <br>
* This is being called when user logged-in and token will be created. <br>
* Last Updated Date: December 6, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @param next - A callback function to pass control to the next middleware in the chain
* @author Cesar
*/
const verifyToken = (req, res, next) => {
    /* Retrieve the token from the cookies */
    const token = req.cookies["auth_token"];

    /* Check if no token is found in cookies, respond with an unauthorized error */
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        /* Verify the token and decode its payload */
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        /* Attach relevant user information to the request object for further use */
        req.userId = decoded.userId;
        req.firstName = decoded.firstName;
        req.role = decoded.role;
        
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export { authMiddleware, verifyToken };
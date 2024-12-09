/**
* DOCU: This function is used as a middleware to restrict access to admin pages/features. <br>
* This is being called when non-admin role wants to access restricted pages/features. <br>
* Last Updated Date: December 6, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @param next - A callback function to pass control to the next middleware in the chain
* @author Cesar
*/
const adminMiddleware = (req, res, next) => {
    /* Check if the user is authenticated and has an admin role */
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admins only' });
    }
};

export default adminMiddleware;
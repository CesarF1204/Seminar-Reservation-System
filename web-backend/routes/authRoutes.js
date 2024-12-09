import express from 'express';
const router = express.Router();
import { register, login } from '../controllers/authController.js';
import { check } from "express-validator";
import { verifyToken } from "../middleware/authMiddleware.js";

/* Route for user registration */
router.post('/register', register);

/* Route for user login with validation for email and password */
router.post('/login',
    [
        // Validate email and password fields
        check("email", "Email is required").isEmail(),
        check("password", "Password with 6 or more characters required").isLength({
        min: 6,
        }),
    ],
    login
);

/* Route to validate the token and get user details (requires authentication) */
router.get('/validate-token', verifyToken, (req, res) => {
    res.status(200).send({ userId: req.userId, firstName: req.firstName, role: req.role });
});

/* Route to log out user by clearing the auth_token cookie */
router.post("/logout", (req, res) => {
        res.cookie("auth_token", "", {
        expires: new Date(0),
    });
    res.send();
});

export default router;
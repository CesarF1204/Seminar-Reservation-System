import express from 'express';
const router = express.Router();
import { register, login } from '../controllers/authController.js';
import { check } from "express-validator";
import { verifyToken } from "../middleware/authMiddleware.js";

/* Route for user registration */
router.post('/register',
    [
        check('firstName')
            .isLength({ min: 1 }).withMessage('First Name is required')
            .matches(/^[A-Za-z\s]+$/).withMessage('Last Name should only contain letters and spaces'),

        check('lastName')
            .isLength({ min: 1 }).withMessage('Last Name is required')
            .matches(/^[A-Za-z\s]+$/).withMessage('Last Name should only contain letters and spaces'),

        check('email')
            .isEmail().withMessage('Invalid email address'),

        check('password')
            .isLength({ min: 6 }).withMessage('Password should be at least 6 characters long')
            .matches(/[A-Za-z0-9]/).withMessage('Password should contain letters and numbers'),
    ], 
    register
);

/* Route for user login with validation for email and password */
router.post('/login',
    [
        /* Validate email and password fields */
        check('email')
            .isEmail().withMessage('Invalid email address'),
        check('password')
            .isLength({ min: 6 }).withMessage('Password should be at least 6 characters long')
            // .matches(/[A-Za-z0-9]/).withMessage('Password should contain letters and numbers'),
    ],
    login
);

/* Route to validate the token and get user details (requires authentication) */
router.get('/validate-token', verifyToken, (req, res) => {
    res.status(200).send({ userId: req.userId, firstName: req.firstName, lastName: req.lastName, email: req.email, role: req.role, token: req.token, profilePicture: req.profilePicture});
});

/* Route to log out user by clearing the auth_token cookie */
router.post("/logout", (req, res) => {
        res.cookie("auth_token", "", {
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    });
    res.send();
});

export default router;
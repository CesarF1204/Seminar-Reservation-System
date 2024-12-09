import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validationResult } from "express-validator";

/**
* DOCU: This function is used to handle the user's registration. <br>
* This is being called when registering a new account. <br>
* Last Updated Date: December 6, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        /* Find user using email */
        const existingUser = await User.findOne({ email });

        /* Check if the user exists with the given email */
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        /* Hash the user's password using bcrypt */
        const hashedPassword = await bcrypt.hash(password, 10);

        /* Create a new user in the database */
        const user = await User.create({ firstName, lastName, email, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

/**
* DOCU: This function is used to handle the user's login. <br>
* This is being called when user is logging in. <br>
* Last Updated Date: December 6, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const login = async (req, res) => {
    try {
        /* Handle validation errors */
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        const { email, password } = req.body;
        
        /* Check if the user exists with the given email */
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

         /* Compare the provided password with the hashed password stored in the database */
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        /* Generate a JWT (JSON Web Token) */
        const token = jwt.sign(
            { userId: user.id, firstName: user.firstName, role: user.role  }, /* Payload */
            process.env.JWT_SECRET, /* Secret key */
            {
            expiresIn: "1d",
            }
        );

        /* Set the token as a cookie in the response */
        res.cookie("auth_token", token, {
            httpOnly: true, /* Prevent JavaScript from accessing the cookie */
            secure: process.env.NODE_ENV === "production", /* Use secure flag in production */
            maxAge: 86400000, /* Cookie expires in 1 day */
        });

        /* Send a success response with the user ID */
        res.status(200).json({ userId: user._id, firstName: user.firstName, role: user.role });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export { register, login };
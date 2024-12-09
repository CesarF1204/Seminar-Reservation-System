import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import seminarRoutes from './routes/seminarRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import cookieParser from 'cookie-parser';

/* Load environment variables from .env file */
dotenv.config();
/* Connect to the database */
connectDB();

const app = express();

/* Enable CORS with specific frontend URL and credentials */
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

/* Middleware to parse JSON and URL encoded data */
app.use(express.json()); /* Parse JSON bodies */
app.use(express.urlencoded({ extended: true })); /* Parse URL-encoded bodies */
app.use(cookieParser()); /* Parse cookies from incoming requests */

/* Define routes for different API endpoints */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/seminars', seminarRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
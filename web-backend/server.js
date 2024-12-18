import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import seminarRoutes from './routes/seminarRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary'; 
import http from 'http';
import { Server } from 'socket.io';

/* Load environment variables from .env file */
dotenv.config();
/* Connect to the database */
connectDB();

/* Cloudinary configuration */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,  /* Allow requests from the frontend */
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,  /* Allow credentials (cookies, etc.) */
    },
    transports: ['websocket', 'polling'],  /* Ensure fallback transport options */
});

/* Attach io instance to the app for global access */
app.set('io', io);

/* Enable CORS with specific frontend URL and credentials */
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

/* Middleware to parse JSON and URL encoded data */
app.use(express.json({ limit: '50mb' })); /* Parse JSON bodies */
app.use(express.urlencoded({ extended: true })); /* Parse URL-encoded bodies */
app.use(cookieParser()); /* Parse cookies from incoming requests */

/* Define routes for different API endpoints */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/seminars', seminarRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
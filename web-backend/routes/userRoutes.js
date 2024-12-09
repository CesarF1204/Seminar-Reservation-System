import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/* Route to fetch the authenticated user's profile. Requires authentication using authMiddleware */
router.get('/profile', authMiddleware, getProfile);

/* Route to update the authenticated user's profile. Requires authentication using authMiddleware */
router.put('/profile', authMiddleware, updateProfile);

export default router;
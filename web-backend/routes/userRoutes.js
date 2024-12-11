import express from 'express';
import { getProfile, updateProfile, updateProfilePicture } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 /* 5MB */
    }
});

/* Route to fetch the authenticated user's profile. Requires authentication using authMiddleware */
router.get('/profile', authMiddleware, getProfile);

/* Route to update the authenticated user's profile. Requires authentication using authMiddleware */
router.put('/profile', authMiddleware, updateProfile);

router.put('/profile/:id', authMiddleware, upload.single('profilePicture'), updateProfilePicture);

export default router;
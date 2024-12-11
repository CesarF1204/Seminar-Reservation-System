import express from 'express';
import { 
    getProfile, 
    updateProfile, 
    updateProfilePicture, 
    fetchUsers, 
    updateRoleOrRestriction, 
    deleteAccount
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import multer from 'multer';

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 /* 5MB */
    }
});


/* Route to fetch the registered users. Requires authentication using authMiddleware and adminMiddleware*/
router.get('/', authMiddleware, adminMiddleware, fetchUsers);

/* Route to fetch the authenticated user's profile. Requires authentication using authMiddleware */
router.get('/profile', authMiddleware, getProfile);

/* Route to update the authenticated user's profile. Requires authentication using authMiddleware */
router.put('/profile', authMiddleware, updateProfile);

/* Route to update the user's profile profile picture. Requires authentication using authMiddleware */
router.put('/profile/:id', authMiddleware, upload.single('profilePicture'), updateProfilePicture);

/* Route to update the user's role or restriction. Requires authentication using authMiddleware and adminMiddleware */
router.put('/:id', authMiddleware, adminMiddleware, updateRoleOrRestriction);

/* Route to delete the user's account. Requires authentication using authMiddleware and adminMiddleware */
router.delete('/:id', authMiddleware, adminMiddleware, deleteAccount);

export default router;
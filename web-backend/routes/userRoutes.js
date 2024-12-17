import express from 'express';
import { 
    getProfile, 
    updateProfile, 
    updateProfilePicture, 
    fetchUsers, 
    updateRoleOrRestriction, 
    deleteAccount,
    fetchUserById,
    updateUserById,
    resetPasswordLink,
    resetPassword,
    accountRecovery
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import multer from 'multer';
import { check } from "express-validator";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 /* 5MB */
    }
});

/* Route to fetch the registered users. Requires authentication using authMiddleware and adminMiddleware*/
router.get('/', authMiddleware, adminMiddleware, fetchUsers);

/* Route to update the user's role or restriction. Requires authentication using authMiddleware and adminMiddleware */
router.put('/update_role_restriction/:id', authMiddleware, adminMiddleware, updateRoleOrRestriction);

/* Route to delete the user's account. Requires authentication using authMiddleware and adminMiddleware */
router.delete('/:id', authMiddleware, adminMiddleware, deleteAccount);

/* Route to fetch the authenticated user's profile. Requires authentication using authMiddleware */
router.get('/profile', authMiddleware, getProfile);

/* Route to update the authenticated user's profile. Requires authentication using authMiddleware */
router.put('/profile', authMiddleware, updateProfile);

/* Route to update the authenticated user's profile picture. Requires authentication using authMiddleware */
router.put('/profile/:id', authMiddleware, upload.single('profilePicture'), updateProfilePicture);

/* Route to fetch a specific user's profile by ID. Requires authentication using authMiddleware */
router.get('/id/:id', authMiddleware, fetchUserById);

/* Route to update a specific user's profile by ID. Requires authentication using authMiddleware and adminMiddleware */
router.put('/id/:id', authMiddleware, adminMiddleware, updateUserById);

/* Route to handle password reset link */
router.get('/reset_password/:token', resetPasswordLink);

/* Route to handle updating of password in password reset link */
router.put('/reset_password',
    [
        check('password')
            .isLength({ min: 6 }).withMessage('Password should be at least 6 characters long')
            .matches(/[A-Za-z0-9]/).withMessage('Password should contain letters and numbers'),
    ],
    resetPassword
);

/* Route to send mail for account recovery */
router.post('/send_account_recovery', 
    [
        check('email')
            .isEmail().withMessage('Invalid email address'),
    ],
    accountRecovery
);

export default router;
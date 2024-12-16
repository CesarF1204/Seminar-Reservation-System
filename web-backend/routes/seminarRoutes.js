import express from 'express';
import { getSeminars, getSeminarDetails , createSeminar, updateSeminar, deleteSeminar } from '../controllers/seminarController.js';
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

/* Route to fetch all seminars. Requires authentication and admin privileges using authMiddleware */
router.get('/', authMiddleware, getSeminars);

/* Route to fetch details of a specific seminar by ID. Requires authentication and admin privileges using authMiddleware */
router.get('/:id', authMiddleware, getSeminarDetails);

/* Route to create a new seminar. Requires authentication and admin privileges using authMiddleware and admin Middleware */
router.post('/', authMiddleware, adminMiddleware, upload.single('speaker.image'), createSeminar);

/* Route to update seminar details by ID. Requires authentication and admin privileges using authMiddleware and adminMiddleware */
router.put('/:id', authMiddleware, adminMiddleware, upload.single('speaker.image'), updateSeminar);

/* Route to delete a seminar by ID. Requires authentication and admin privileges using authMiddleware and adminMiddleware */
router.delete('/:id', authMiddleware, adminMiddleware, deleteSeminar);

export default router;
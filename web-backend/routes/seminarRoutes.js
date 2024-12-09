import express from 'express';
import { getSeminars, getSeminarDetails , createSeminar, updateSeminar, deleteSeminar } from '../controllers/seminarController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

/* Route to fetch all seminars */
router.get('/', getSeminars);

/* Route to fetch details of a specific seminar by ID */
router.get('/:id', getSeminarDetails);

/* Route to create a new seminar. Requires authentication and admin privileges using authMiddleware and admin Middleware */
router.post('/', authMiddleware, adminMiddleware, createSeminar);

/* Route to update seminar details by ID. Requires authentication and admin privileges using authMiddleware and adminMiddleware */
router.put('/:id', authMiddleware, adminMiddleware, updateSeminar);

/* Route to delete a seminar by ID. Requires authentication and admin privileges using authMiddleware and adminMiddleware */
router.delete('/:id', authMiddleware, adminMiddleware, deleteSeminar);

export default router;
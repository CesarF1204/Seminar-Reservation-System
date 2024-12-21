import express from 'express';
import { 
    getSeminars, 
    getSeminarDetails, 
    createSeminar, 
    updateSeminar, 
    deleteSeminar
} from '../controllers/seminarController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import getCoordinates from '../utils/getCoordinate.js';
import multer from 'multer';
import { check } from "express-validator";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 /* 5MB */
    }
});

const seminarValidationRules = [
    /* Validate fields */
    check('title')
        .isLength({ min: 1 }).withMessage('Title is required'),
    check('description')
        .isLength({ min: 1 }).withMessage('Description is required'),
    check('date')
        .isLength({ min: 1 }).withMessage('Date is required')
        .isDate().withMessage('Invalid Date')
        .custom((date_value) => {
            const inputDate = new Date(date_value);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to start of the day
            if (inputDate < today) {
                throw new Error('Date must not be in the past');
            }
            return true;
        }),
    check('timeFrame.from')
        .isLength({ min: 1 }).withMessage('Timeframe From is required'),
    check('timeFrame.to')
        .isLength({ min: 1 }).withMessage('Timeframe To is required'),
    check('venue')
        .isLength({ min: 1 }).withMessage('Venue is required'),
    check('speaker.name')
        .isLength({ min: 1 }).withMessage('Speaker Name is required'),
    check('fee')
        .isLength({ min: 1 }).withMessage('Fee is required'),
    check('slotsAvailable')
        .isLength({ min: 1 }).withMessage('Slots Available is required'),
]

/* Route to fetch all seminars. Requires authentication and admin privileges using authMiddleware */
router.get('/', authMiddleware, getSeminars);

/* Route to get the coordinates of the given address */
router.get('/get_coordinates', getCoordinates);

/* Route to fetch details of a specific seminar by ID. Requires authentication and admin privileges using authMiddleware */
router.get('/:id', authMiddleware, getSeminarDetails);

/* Route to create a new seminar. Requires authentication and admin privileges using authMiddleware and admin Middleware */
router.post('/', 
    authMiddleware, 
    adminMiddleware, 
    upload.single('speaker.image'), 
    seminarValidationRules,
    createSeminar
);

/* Route to update seminar details by ID. Requires authentication and admin privileges using authMiddleware and adminMiddleware */
router.put('/:id', 
    authMiddleware, 
    adminMiddleware, 
    upload.single('speaker.image'), 
    seminarValidationRules,
    updateSeminar
);

/* Route to delete a seminar by ID. Requires authentication and admin privileges using authMiddleware and adminMiddleware */
router.delete('/:id', authMiddleware, adminMiddleware, deleteSeminar);


export default router;
import express from 'express';
import { sendEmailAccountRecovery } from '../utils/email.js';

const router = express.Router();

/* Route to send mail */
router.post('/send-account-recovery', sendEmailAccountRecovery);

export default router;
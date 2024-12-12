import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fetchUserByEmail } from '../controllers/userController.js';

/* Load environment variables from .env file */
dotenv.config();

/**
* DOCU: This function is used to create a nodemailer transporter object for sending emails through Gmail's SMTP server.
* This object is configured with the authentication credentials from environment variables.
* Last Updated Date: December 6, 2024 <br>
* @function
* @author Cesar
*/
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
* DOCU: This function is used to send an email.
* It requires the recipient, subject, plain text, and HTML content of the email.
* Last Updated Date: December 6, 2024 <br>
* @function
* @param {string} to - the recipient email address
* @param {string} subject - the subject of the email
* @param {string} text - the plain text content of the email
* @param {string} html - the HTML content of the email
* @returns {Promise<void>} Resolves when email is sent successfully or logs an error if failed
* @author Cesar
*/
const sendEmail = async (to, subject, text, html) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

/**
* DOCU: This function is used to send an email for account recovery.
* This is being called when the user forgot their password and want an account recovery. <br>
* Last Updated Date: December 12, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const sendEmailAccountRecovery = async (req, res) => {
    try {
        const { email } = req.body;

        /* use fetchUserByEmail function to get the user details by using email address */
        const user = await fetchUserByEmail(email);

        /* Check if the user was found */
        if (!user) return res.status(404).json({ message: 'User not found' });

        /* Email Content */
        const to = email;
        const subject = 'Account Recovery Request';
        const text = `
            Dear ${user.firstName} ${user.lastName},
            We received a request to recover your account associated with this email address.
            To reset your password and regain access to your account, please click the link below:
            Account Recovery URL: http://test.com
            If you didn't request this, please ignore this message. Your account is still secure, and no changes have been made.
            Best regards,
            Admin - Seminar Reservation System
        `;
        const html = `
            <html>
            <body>
                <p>Dear <b>${user.firstName} ${user.lastName}</b>,</p>
                <p>We received a request to recover your account associated with this email address.</p>
                <p>To reset your password and regain access to your account, please click the link below:</p>
                <p>Account Recovery URL: <a href="http://test.com">http://test.com</a></p>
                <p>If you didn't request this, please ignore this message. Your account is still secure, and no changes have been made.</p>
                <p>Best regards,</p>
                <p>Admin - Seminar Reservation System</p>
            </body>
            </html>
        `;

        /* use sendEmail for sending email */
        await sendEmail(to, subject, text, html);

        res.status(200).json({ message: 'Email Sent Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email', error });
    }
};

export {sendEmail, sendEmailAccountRecovery};
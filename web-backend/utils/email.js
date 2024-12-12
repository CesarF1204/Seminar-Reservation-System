import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';
import User from '../models/User.js';

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
* This is being called when the user forgot their password and want for an account recovery. <br>
* Last Updated Date: December 12, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const sendEmailAccountRecovery = async (req, res) => {
    try {
        /* Extract the email from the request body */
        const { email } = req.body;

        /* Get the user details by using email address */
        const user = await User.findOne({ email }).select('firstName lastName');

        /* Check if the user was not found */
        if (!user) {
            return res.status(400).send('User not found');
        }

        /* Generate a token and expiration time for password reset */
        const token = crypto.randomBytes(20).toString('hex');
        const expiration = Date.now() + 3600000;

        /* Save the token and expiration time to the user's record in database */
        user.passwordResetToken = token;
        user.passwordResetExpires = expiration;
        await user.save();

         /* Create the password recovery URL to be sent in the email */
        const recoveryUrl = `${process.env.FRONTEND_URL}/reset_password/${token}`;

        /* Email Content */
        const to = email;
        const subject = 'Account Recovery Request';
        const text = `
            Dear ${user.firstName} ${user.lastName},
            We received a request to recover your account associated with this email address.
            To reset your password and regain access to your account, please click the link below:
            Account Recovery URL: ${recoveryUrl}
            If you didn't request this, please ignore this message. Your account is still secure, and no changes have been made.
            Best regards,
            Admin - Seminar Reservation System
        `;
        const html = `
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <p style="font-size: 16px;">Dear <b>${user.firstName} ${user.lastName}</b>,</p>
                    <p style="font-size: 14px;">We received a request to recover your account associated with this email address.</p>
                    <p style="font-size: 14px;">To reset your password and regain access to your account, please click the link below:</p>
                    <p style="font-size: 14px; text-align: center;">
                        <a href="${recoveryUrl}" 
                        style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Your Password</a>
                    </p>
                    <p style="font-size: 14px;">Link will expire in 1 hour. If you didn't request this, please ignore this message. Your account is still secure, and no changes have been made.</p>
                    <p style="font-size: 14px;">Best regards,</p>
                    <p style="font-size: 14px;">Admin - Seminar Reservation System</p>
                </div>
            </body>
            </html>
        `;

        /* Use sendEmail for sending email */
        await sendEmail(to, subject, text, html);

        res.status(200).json({ message: 'Email Sent Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email', error });
    }
};

export {sendEmail, sendEmailAccountRecovery};
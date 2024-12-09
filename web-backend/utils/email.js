import nodemailer from 'nodemailer';

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

export default sendEmail;
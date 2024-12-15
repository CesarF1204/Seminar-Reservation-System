import sendEmail from '../utils/email.js'; 
import { formatToLocaleDate } from './globalHelper.js';

/**
* DOCU: This function is used sending an email when booking a seminar. <br>
* This is being called when user book a seminar. <br>
* Last Updated Date: December 15, 2024 <br>
* @function
* @param {object} user - user details
* @param {object} seminar - seminar details
* @author Cesar
*/
const sendEmailBookingReservation = async (user, seminar) => {
    try{
        /* Email Content */
        const to = user.email;
        const subject = 'Seminar Reservation';
        const text = `
            Dear ${user.firstName} ${user.lastName},
            Thank you for booking your spot in our seminar, ${seminar.title}!
            We're delighted to confirm your reservation. Below are the details for your reference:
            Topic: ${seminar.title}
            Details: ${seminar.description}
            Date: ${seminar.date}
            Time: ${seminar.timeFrame.from} - ${seminar.timeFrame.to}
            Venue: ${seminar.venue}
            Speaker: ${seminar.speaker.name}

            Your reservation is still pending. Please wait for a confirmation email to follow.
            
            If you have any questions or require additional information, please don't hesitate to reach out at seminar.reservation.system@gmail.com
    
            Best regards,
            Admin - Seminar Reservation System
        `;
        const html = `
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fff;">
                    <p style="font-size: 16px; font-weight: bold; margin-bottom: 20px;">Dear ${user.firstName} ${user.lastName},</p>
                    <p style="font-size: 14px; margin-bottom: 20px;">Thank you for booking your spot in our seminar, <b>${seminar.title}</b>!</p>
                    <p style="font-size: 14px; margin-bottom: 20px;">We're delighted to confirm your participation. Below are the details for your reference:</p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="font-size: 14px; font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Topic:</td>
                            <td style="font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${seminar.title}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Details:</td>
                            <td style="font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${seminar.description}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Date:</td>
                            <td style="font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${seminar.date}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Time:</td>
                            <td style="font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${seminar.timeFrame.from} - ${seminar.timeFrame.to}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Venue:</td>
                            <td style="font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${seminar.venue}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Speaker:</td>
                            <td style="font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${seminar.speaker.name}</td>
                        </tr>
                    </table>
                    <p style="font-size: 14px; margin-bottom: 20px;">Your reservation is still pending. Please wait for a confirmation email to follow.</p>
                    <p style="font-size: 14px; margin-bottom: 20px;">
                        If you have any questions or require additional information, please don't hesitate to reach out at 
                        <a href="mailto:seminar.reservation.system@gmail.com" style="color: #007bff; text-decoration: none;">seminar.reservation.system@gmail.com</a>.
                    </p>
                    <p style="font-size: 14px; font-weight: bold;">Best regards,</p>
                    <p style="font-size: 14px;">Admin - Seminar Reservation System</p>
                </div>
            </body>
            </html>
        `;

        /* Use sendEmail for sending email */
        await sendEmail(to, subject, text, html);
    }
    catch(error){
        throw new Error('Error sending email for booking a seminar', error.message);
    }
}

/**
* DOCU: This function is used sending an email for seminar booking confirmation. <br>
* This is being called when admin update the status to confimed. <br>
* Last Updated Date: December 15, 2024 <br>
* @function
* @param {object} user - user details
* @param {object} seminar - seminar details
* @author Cesar
*/
const sendEmailConfirmedReservation = async (user, seminar) => {
    try{
        /* Email Content */
        const to = user.email;
        const subject = 'Confirmation of Your Seminar Booking';
        const text = `
            Dear ${user.firstName} ${user.lastName},
            I am writing to confirm that your seminar, titled ${seminar.title}, has been successfully booked.
            We are looking forward to your participation and are excited about the insights that will be shared.

            Please find the seminar details below for your reference:
            Topic: ${seminar.title}
            Details: ${seminar.description}
            Date: ${seminar.date}
            Time: ${seminar.timeFrame.from} - ${seminar.timeFrame.to}
            Venue: ${seminar.venue}
            Speaker: ${seminar.speaker.name}

            If you require any further information or assistance before the event, feel free to reach out.

            We look forward to your participation and to a successful seminar.

            Best regards,
            Admin - Seminar Reservation System
        `;
        const html = `
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fff;">
                    <p style="font-size: 16px; font-weight: bold; margin-bottom: 20px;">Dear ${user.firstName} ${user.lastName},</p>
                    <p style="font-size: 14px; margin-bottom: 20px;">I am writing to confirm that your seminar, titled <b>${seminar.title}</b>, has been successfully booked.</p>
                    <p style="font-size: 14px; margin-bottom: 20px;">We are looking forward to your participation and are excited about the insights that will be shared.</p>
                    
                    <p style="font-size: 14px; margin-bottom: 20px;">Please find the seminar details below for your reference:</p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="font-size: 14px; font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Topic:</td>
                            <td style="font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${seminar.title}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Details:</td>
                            <td style="font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${seminar.description}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Date:</td>
                            <td style="font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${seminar.date}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Time:</td>
                            <td style="font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${seminar.timeFrame.from} - ${seminar.timeFrame.to}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Venue:</td>
                            <td style="font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${seminar.venue}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 14px; font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">Speaker:</td>
                            <td style="font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${seminar.speaker.name}</td>
                        </tr>
                    </table>
                    
                    <p style="font-size: 14px; margin-bottom: 20px;">If you require any further information or assistance before the event, feel free to reach out.</p>
                    <p style="font-size: 14px; margin-bottom: 20px;">We look forward to your participation and to a successful seminar.</p>
                    
                    <p style="font-size: 14px; font-weight: bold;">Best regards,</p>
                    <p style="font-size: 14px;">Admin - Seminar Reservation System</p>
                </div>
            </body>
            </html>
        `;

        /* Use sendEmail for sending email */
        await sendEmail(to, subject, text, html);
    }
    catch(error){
        throw new Error('Error sending email for confirmed seminar reservation', error.message);
    }
}

/**
* DOCU: This function is used sending an email for seminar booking rejection or cancellation. <br>
* This is being called when admin update the status to rejected. <br>
* Last Updated Date: December 15, 2024 <br>
* @function
* @param {object} user - user details
* @param {object} seminar - seminar details
* @author Cesar
*/
const sendEmailRejectedReservation = async (user, seminar) => {
    try{
        /* Email Content */
        const to = user.email;
        const subject = 'Seminar Booking Cancellation';
        const text = `
            Dear ${user.firstName} ${user.lastName},
            I am writing to inform you that, unfortunately, the seminar titled ${seminar.title} for ${formatToLocaleDate(seminar.date)}, has been rejected.
            Due to unforeseen circumstances, we are unable to proceed you with this seminar.

            We sincerely apologize for any inconvenience this may cause.
            If you require any further details or would like assistance, please don't hesitate to reach out. 
            
            Best regards,
            Admin - Seminar Reservation System
        `;
        const html = `
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fff;">
                    <p style="font-size: 16px; font-weight: bold; margin-bottom: 20px;">Dear ${user.firstName} ${user.lastName},</p>
                    <p style="font-size: 14px; margin-bottom: 20px;">I am writing to inform you that, unfortunately, your seminar booking titled <b>${seminar.title}</b> for ${formatToLocaleDate(seminar.date)} has been rejected.</p>
                    <p style="font-size: 14px; margin-bottom: 20px;">Due to unforeseen circumstances, we are unable to proceed with your seminar.</p>
                    <p style="font-size: 14px; margin-bottom: 20px;">We sincerely apologize for any inconvenience this may cause. If you require any further details or would like assistance, please don't hesitate to reach out.</p>
                    <p style="font-size: 14px; font-weight: bold; margin-bottom: 20px;">Best regards,</p>
                    <p style="font-size: 14px;">Admin - Seminar Reservation System</p>
                </div>
            </body>
            </html>
        `;

        /* Use sendEmail for sending email */
        await sendEmail(to, subject, text, html);
    }
    catch(error){
        throw new Error('Error sending email for rejected seminar reservation', error.message);
    }
}

/**
* DOCU: This function is used sending an email for seminar booking in pending status. <br>
* This is being called when admin update the status to pending. <br>
* Last Updated Date: December 15, 2024 <br>
* @function
* @param {object} user - user details
* @param {object} seminar - seminar details
* @author Cesar
*/
const sendEmailPendingReservation = async (user, seminar) => {
    try{
        /* Email Content */
        const to = user.email;
        const subject = 'Seminar Reservation - Pending Status';
        const text = `
            Dear ${user.firstName} ${user.lastName},
            We are pleased to inform you that your seminar booking for ${seminar.title} for ${formatToLocaleDate(seminar.date)} is currently in pending status.
            We are actively working to finalize the details and will notify you as soon as the booking is confirmed.

            We appreciate your patience during this process.
            If you have any questions or need further assistance, please feel free to reach out.
            
            Best regards,
            Admin - Seminar Reservation System
        `;
        const html = `
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fff;">
                    <p style="font-size: 16px; font-weight: bold; margin-bottom: 20px;">Dear ${user.firstName} ${user.lastName},</p>
                    <p style="font-size: 14px; margin-bottom: 20px;">We are pleased to inform you that your seminar booking for <b>${seminar.title}</b> on ${formatToLocaleDate(seminar.date)} is currently in pending status.</p>
                    <p style="font-size: 14px; margin-bottom: 20px;">We are actively working to finalize the details and will notify you as soon as the booking is confirmed.</p>
                    <p style="font-size: 14px; margin-bottom: 20px;">We appreciate your patience during this process. If you have any questions or need further assistance, please feel free to reach out.</p>
                    <p style="font-size: 14px; font-weight: bold; margin-bottom: 20px;">Best regards,</p>
                    <p style="font-size: 14px;">Admin - Seminar Reservation System</p>
                </div>
            </body>
            </html>
        `;

        /* Use sendEmail for sending email */
        await sendEmail(to, subject, text, html);
    }
    catch(error){
        throw new Error('Error sending email for pending seminar reservation', error.message);
    }
}

/**
* DOCU: This function is used to send an email for account recovery.
* This is being called when the user forgot their password and want for an account recovery. <br>
* Last Updated Date: December 12, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const sendEmailAccountRecovery = async (user, recoveryUrl) => {
    try{
        /* Email Content */
        const to = user.email;
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
    }
    catch(error){
        throw new Error('Error sending email for account recovery', error.message);
    }
}

export {
    sendEmailBookingReservation, 
    sendEmailConfirmedReservation, 
    sendEmailRejectedReservation, 
    sendEmailPendingReservation,
    sendEmailAccountRecovery,
};
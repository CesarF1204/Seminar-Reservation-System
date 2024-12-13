import Stripe from 'stripe';
import dotenv from 'dotenv';

/* Load environment variables from .env file */
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
* DOCU: This function is used to create a payment intent with Stripe.
* It requires the amount to be charged and creates a payment intent for that amount.
* Last Updated Date: December 14, 2024 <br>
* @function
* @param {number} amount - the amount to be charged, in the smallest currency unit (e.g., cents for PHP)
* @param {string} title - the title to be set on description
* @param {string} email - the email address of the user/customer
* @returns {Promise<Object>} Resolves with the payment intent object if successful, or throws an error if failed
* @throws {Error} If there is an error creating the payment intent
* @author Cesar
*/
const createPaymentIntent = async (payment_data) => {
    try {
        const { amount, title, email } = payment_data;

        /* This will convert the amount(centavos) to the actual amount */
        const amount_value = amount * 100;

        /* Create a payment intent using the Stripe API with the specified amount, currency, and description */
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount_value,
            currency: 'php',
            description: `Payment for ${title}`,
            receipt_email: email,
            automatic_payment_methods: { enabled: true },
        });
        
        return paymentIntent;
    } catch (error) {
        throw new Error('Error creating payment intent:', error.message);
    }
};

export default createPaymentIntent;
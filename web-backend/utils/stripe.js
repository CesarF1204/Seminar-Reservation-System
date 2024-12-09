import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
* DOCU: This function is used to create a payment intent with Stripe.
* It requires the amount to be charged and creates a payment intent for that amount.
* Last Updated Date: December 6, 2024 <br>
* @function
* @param {number} amount - the amount to be charged, in the smallest currency unit (e.g., cents for USD)
* @returns {Promise<Object>} Resolves with the payment intent object if successful, or throws an error if failed
* @throws {Error} If there is an error creating the payment intent
* @author Cesar
*/
const createPaymentIntent = async (amount) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
        });
        return paymentIntent;
    } catch (error) {
        throw new Error('Error creating payment intent:', error.message);
    }
};

export default createPaymentIntent;
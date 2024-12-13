import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CreditCardPayment = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (error) {
            console.error(error);
            alert(error.message);
        } else {
            console.log('PaymentMethod:', paymentMethod);
            alert('Payment successful!');
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
                <CardElement className="p-4 border rounded-md" />
            </div>
            <div className="flex justify-end space-x-2">
                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
            </div>
        </form>
    );
};

export default CreditCardPayment;
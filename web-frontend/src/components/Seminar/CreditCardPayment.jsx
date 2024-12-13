import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useMutation } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppContext } from '../../contexts/AppContext';
import * as apiClient from '../../api-client';

const CreditCardPayment = () => {
    const navigate = useNavigate();
    const { id: seminar_id } = useParams();

    /* Extract showToast function from context for displaying notifications */
    const { showToast, data } = useAppContext();
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    /* React Hook Form setup */
    const { register, formState: { errors }, handleSubmit } = useForm();

    /* Mutation setup to create payment intent */
    const mutation = useMutation(
        (formData) => apiClient.createBooking(formData, data.token),
        {
            onSuccess: async({ clientSecret }) => {

                if (!stripe || !elements) return;

                /* Confirm card payment */
                const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: {
                            name: `${data.firstName} ${data.lastName}`,
                        },
                    },
                });

                /* Check if it has an error */
                if (error) {
                    /* Show toast error message */
                    showToast({ message: error.message, type: 'ERROR' });
                } else if (paymentIntent?.status === 'succeeded') {
                    /* If success, show toast success message and redirect to /dashboard page */
                    showToast({ message: 'Payment Successful. Seminar Booked!', type: 'SUCCESS' });
                    navigate("/dashboard");
                }

                /* Set processing state to false to indicate the form is not submitted */
                setIsProcessing(false);
            },
            onError: (error) => {
                /* Show toast error message */
                showToast({ message: error.message, type: "ERROR" });
                /* Set processing state to false to indicate the form is not submitted */
                setIsProcessing(false);
            },
        }
    );

    /* Handle form submission */
    const onSubmit = handleSubmit(async (data) => {
        /* Check if Stripe or elements are not ready, show an error toast */
        if (!stripe || !elements) {
            showToast({ message: 'Stripe or elements not ready', type: 'ERROR' });
            return;
        }

        /* Set processing state to true to indicate the form is being submitted */
        setIsProcessing(true);

        /* Create a payment method using Stripe's card element */
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        /* Check if an error occurs during payment method creation, show an error toast and set processing state to false */
        if (error) {
            showToast({ message: error.message, type: 'ERROR' });
            setIsProcessing(false);
        } else {
            const formData = new FormData();
            /* Append fields */
            formData.append("paymentMethodId", paymentMethod.id);
            formData.append("seminarId", data.seminarId);

            /* Trigger the mutation with the updated form data */
            mutation.mutate(formData);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full">
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
            <input type="hidden" {...register("seminarId", { value: seminar_id })} />
        </form>
    );
};

export default CreditCardPayment;
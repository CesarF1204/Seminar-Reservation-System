import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import CreditCardPayment from './CreditCardPayment';
import QRCodePayment from './QRCodePayment';
import { useAppContext } from '../../contexts/AppContext'; 

const PaymentOptionModal = ({ toggleModal }) => {
    /* Extract showToast function from context for displaying notifications */
    const {stripePromise} = useAppContext();

    const [paymentOption, setPaymentOption] = useState('');

    const renderPaymentForm = () => {
        if (paymentOption === 'creditCard') {
            return (
                <Elements stripe={stripePromise}>
                    <CreditCardPayment />
                </Elements>
            );
        } else if (paymentOption === 'proofOfPayment') {
            return <QRCodePayment />;
        }
        return null;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-96 relative">
                {/* Close Icon */}
                <button
                    onClick={toggleModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    &#x2715;
                </button>

                <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
                <p className="mb-4">Please choose a payment method to proceed.</p>

                {/* Payment Options */}
                <div className="flex justify-between mb-4">
                    <button
                        onClick={() => setPaymentOption('creditCard')}
                        className={`px-4 py-2 rounded-md transition ${
                            paymentOption === 'creditCard'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Credit Card
                    </button>
                    <button
                        onClick={() => setPaymentOption('proofOfPayment')}
                        className={`px-4 py-2 rounded-md transition ${
                            paymentOption === 'proofOfPayment'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Upload Proof
                    </button>
                </div>

                {/* Render Selected Payment Form */}
                {renderPaymentForm()}
            </div>
        </div>
    );
};

export default PaymentOptionModal;
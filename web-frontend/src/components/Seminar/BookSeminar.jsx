import React, { useState } from 'react';
import PaymentOptionModal from './PaymentOptionModal';

const BookSeminar = ({ paymentStatus }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    /* Check if the payment status is pending or confirmed, then set isDisable to true */
    const isDisabled = ['pending', 'confirmed'].includes(paymentStatus);

    return (
        <div className="ml-4">
            <button
                onClick={toggleModal}
                className={`go-back-btn mt-2 flex items-center px-4 py-2 bg-green-500 text-white rounded-md 
                    ${ isDisabled ? 'bg-gray-500 hover:bg-gray-600 cursor-not-allowed' : 'hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition'
                }`}
                disabled={isDisabled}
                title={isDisabled ? "You cannot book this seminar as you already have a pending or confirmed booking." : ''}
            >
                Book Now
            </button>
            
            {isModalOpen && (
                <PaymentOptionModal toggleModal={toggleModal} />
            )}
        </div>
    );
};

export default BookSeminar;

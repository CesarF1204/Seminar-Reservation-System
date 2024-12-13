import React, { useState } from 'react';
import PaymentOptionModal from './PaymentOptionModal';

const BookSeminar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="ml-4">
            <button
                onClick={toggleModal}
                className="go-back-btn mt-2 flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
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

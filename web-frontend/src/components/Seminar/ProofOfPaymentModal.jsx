import React from 'react';
import { FaTimes } from "react-icons/fa";

const ProofOfPaymentModal = ({ paymentProofImage, handleCloseModal }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full relative">
                {/* Close Button */}
                <button
                    className="absolute top-1 right-1 text-gray-400"
                    onClick={handleCloseModal}
                >
                    <FaTimes size={24} />
                </button>
                <div className="flex justify-center">
                    <img
                        src={paymentProofImage}
                        alt="Proof of Payment"
                        className="max-w-full max-h-[80vh] object-contain"
                    />
                </div>
            </div>
        </div>
    )
}

export default ProofOfPaymentModal

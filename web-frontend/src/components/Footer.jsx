import React from 'react';
import { FaFacebook, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
                <p>&copy; 2024 Seminar Reservation System. All Rights Reserved.</p>
                <span>Cesar Francisco</span>
                <div className="flex space-x-4 justify-center mt-6 mt-2">
                    <a href="https://www.facebook.com/cesarfrancisco120495/" target="_blank" rel="noopener noreferrer" className="mx-2 text-white">
                        <FaFacebook size={24} className="hover:text-blue-600" />
                    </a>
                    <a href="https://www.linkedin.com/in/cesar-francisco-00a857171/" target="_blank" rel="noopener noreferrer" className="mx-2 text-white">
                        <FaLinkedin size={24} className="hover:text-blue-400" />
                    </a>
                    <a href="mailto:princexcesar@gmail.com" className="mx-2 text-white">
                        <FaEnvelope size={24} className="hover:text-red-500" />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext'; 
import { FaArrowLeft, FaEdit, FaTrashAlt } from "react-icons/fa";
import DeleteSeminarModal from '../../components/Seminar/DeleteSeminarModal';
import BookSeminar from '../../components/Seminar/BookSeminar';

const SeminarDetails = () => {
    /* Get the seminar ID from the URL parameters */
    const { id } = useParams();
    /* Extract showToast function from context for displaying notifications */
    const {showToast, data} = useAppContext();

    /* Navigate to different routes */
    const navigate = useNavigate();

    /* State for showing delete modal */
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    /* Fetch seminar details using react-query's useQuery hook */
    const { data: seminar = [], isError } = useQuery(
        "fetchSeminarById",
        () => apiClient.fetchSeminarById(id, data.token),
        {
            suspense: true, /* Enables React's Suspense mode, allowing the component to wait for data to load before rendering. */
            refetchOnWindowFocus: false, /* Optional: Disable refetching on window focus */
            retry: 1, /* Optional: Number of retry attempts */
        }
    );
    /* Error state: show error toast if there is an issue loading data */
    if (isError) {
        showToast({ message: "Failed to load seminar details. Please try again later.", type: "ERROR" })
    }

    const {title, description, date, timeFrame, venue, speaker, fee, slotsAvailable } = seminar;

    /* Fetch booked seminar details using react-query's useQuery hook */
    const { data: bookings = [] } = useQuery(
        "fetchAllBookings",
        () => apiClient.fetchAllBookings(data.token),
        {
            suspense: true, /* Enables React's Suspense mode, allowing the component to wait for data to load before rendering. */
            refetchOnWindowFocus: false, /* Optional: Disable refetching on window focus */
            retry: 1, /* Optional: Number of retry attempts */
        }
    );

    /* Filter through bookings to get users booked seminars */
    const booking = bookings.filter(booked_seminar => {
        /* Check if user has the same as the selected seminar, then return the details of the booked seminar  */
        if(booked_seminar.seminar._id === id){
            return booked_seminar.seminar
        }
    });
    
    /* Get the latest booked seminar of the selected seminar */
    const latestBookedSeminar = booking[booking.length - 1];

    /* Get the paymentStatus of the latest booked seminar */
    const paymentStatus = latestBookedSeminar?.paymentStatus;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold text-gray-800">{title}</h1>
            <p className="text-lg text-gray-600 mt-2">{description}</p>
            <div className="seminar-info mt-6">
                <p className="text-md text-gray-700"><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
                <p className="text-md text-gray-700"><strong>Time:</strong> {timeFrame.from} - {timeFrame.to}</p>
                <p className="text-md text-gray-700"><strong>Venue:</strong> {venue}</p>
            </div>
            <div className="speaker-info mt-8">
                <h3 className="text-xl font-semibold text-gray-800">Speaker</h3>
                <div className="speaker mt-4 flex items-center space-x-4">
                <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-16 h-16 rounded-full border-2 border-gray-300"
                />
                <div className="speaker-details">
                    <p className="text-lg font-medium text-gray-700">{speaker.name}</p>
                    <p>
                    <a
                        href={speaker.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        LinkedIn Profile
                    </a>
                    </p>
                </div>
                </div>
            </div>
            <div className="seminar-fee mt-6 flex justify-start items-center">
                <div>
                    <p className="text-md text-gray-700"><strong>Fee:</strong> ₱{fee}</p>
                    <p className="text-md text-gray-700"><strong>Available Slots:</strong> {slotsAvailable}</p>
                </div>
                {/* Book Seminar Component */}
                { data.role !== 'admin' &&
                    <BookSeminar paymentStatus={paymentStatus} />
                }
            </div>
            { data.role === 'admin' &&
                <div className="flex space-x-4 items-center mt-6">
                    <Link to={`/seminar/${seminar._id}/edit`} className="text-blue-400 hover:text-blue-600 inline-flex items-center">
                        <FaEdit className="mr-1" /> Edit 
                    </Link>
                    <Link className="text-red-400 hover:text-red-600 inline-flex items-center" onClick={() => setShowDeleteModal(true)}>
                        <FaTrashAlt className="mr-1" /> Delete 
                    </Link>
                </div>
            }
            <button className="flex items-center px-4 py-2 mt-4 bg-gray-700 text-white disabled:bg-gray-400" onClick={() => navigate(-1)}>
                <FaArrowLeft className="left-arrow mr-2" /> Go Back
            </button>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <DeleteSeminarModal setShowDeleteModal={setShowDeleteModal}/>
            )}
        </div>
    );
};

export default SeminarDetails;

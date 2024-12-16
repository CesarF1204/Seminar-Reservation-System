import React, { useState } from 'react';
import { useQuery } from 'react-query';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import { capitalizeFirstLetter, convertDateFormat, sortByKey } from '../../helpers/globalHelpers';
import ProofOfPaymentModal from '../../components/Seminar/ProofOfPaymentModal';
import BookingStatus from '../../components/Seminar/BookingStatus';

const ViewBookedSeminars = () => {
    /* Navigate to different routes */
    const navigate = useNavigate();
    /* Extract showToast function from context for displaying notifications */
    const {showToast, data} = useAppContext();

    const [ showProofOfPayment, setShowProofOfPayment ] = useState(false);
    const [ paymentProofImage, setPaymentProofImage ] = useState('');
    const [ sortKey, setSortKey ] = useState('');
    const [ sortDirection, setSortDirection ] = useState('asc');

    /* Fetch booked seminars data using react-query's useQuery hook */
    const { data: booked_seminars = [], isError, refetch } = useQuery(
        "fetchBookings",
        ()=>apiClient.fetchBookings(data.token),
        {
            suspense: true, /* Enables React's Suspense mode, allowing the component to wait for data to load before rendering. */
            refetchOnWindowFocus: false, /* Optional: Disable refetching on window focus */
            retry: 1, /* Optional: Number of retry attempts */
        }
    );

    /* Error state: show error toast if there is an issue loading data */
    if (isError) {
        showToast({ message: "Failed to load users details. Please try again later.", type: "ERROR" })
    }

    /* Handle displaying the proof of payment modal */
    const handleShowProof = (proofImage) => {
        setPaymentProofImage(proofImage);
        setShowProofOfPayment(true);
    };

    /* Handle closing proof of payment modal */
    const handleCloseModal = () => {
        setShowProofOfPayment(false);
    };

    /* Handle sorting */
    const handleSort = (key) => {
        if(sortKey === key) {
            /* Toggle direction if the same column is clicked */
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            /* Set a new sort key and default to ascending order */
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    /* Sort the booked seminars list based on the selected key and direction */
    const sortedBookedSeminars = sortByKey([...booked_seminars], sortKey, sortDirection);

    /* Display the appropriate sort icon based on the current sort direction */
    const renderSortIcon = (key) => {
        if(sortKey === key) {
            return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    };

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className="mt-4 max-w-6xl w-full">
                <h2 className="text-2xl font-semibold text-center">Booked Seminars</h2>
                {booked_seminars.length > 0 ? (
                    <table className="table-auto w-full mt-1 bg-gray-800 text-white shadow-lg">
                        <thead className="whitespace-nowrap">
                            <tr className="bg-gray-700">
                                <th className="px-4 py-2" onClick={() => handleSort('seminar.title')}>
                                    <div className="flex items-center justify-start">
                                        Title {renderSortIcon('seminar.title')}
                                    </div>
                                </th>
                                <th className="px-4 py-2" onClick={() => handleSort('seminar.fee')}>
                                    <div className="flex items-center justify-start">
                                        Price {renderSortIcon('seminar.fee')}
                                    </div>
                                </th>
                                <th className="px-4 py-2" onClick={() => handleSort('user.firstName')}>
                                    <div className="flex items-center justify-start">
                                        Booked By {renderSortIcon('user.firstName')}
                                    </div>
                                </th>
                                <th className="px-4 py-2" onClick={() => handleSort('seminar.createdAt')}>
                                    <div className="flex items-center justify-start">
                                        Booked Date {renderSortIcon('seminar.createdAt')}
                                    </div>
                                </th>
                                <th className="px-4 py-2" onClick={() => handleSort('proofOfPayment')}>
                                    <div className="flex items-center justify-start">
                                        Proof of Payment {renderSortIcon('proofOfPayment')}
                                    </div>
                                </th>
                                <th className="px-4 py-2" onClick={() => handleSort('paymentStatus')}>
                                <div className="flex items-center justify-start">
                                        Status {renderSortIcon('paymentStatus')}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedBookedSeminars.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-700">
                                    <td className="px-4 py-2">{booking.seminar.title}</td>
                                    <td className="px-4 py-2">₱{booking.seminar.fee}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {capitalizeFirstLetter(booking.user.firstName)} {capitalizeFirstLetter(booking.user.lastName)}
                                        <p className="text-sm text-gray-500 italic">{booking.user.email}</p>
                                    </td>
                                    <td className="px-4 py-2">{convertDateFormat(booking.seminar.createdAt)}</td>
                                    <td className="px-4 py-2">
                                        {booking.proofOfPayment
                                        ? 
                                            <Link
                                            className="text-blue-400 hover:text-blue-600"
                                            onClick={() => handleShowProof(booking.proofOfPayment)}
                                            >
                                                Show Payment
                                            </Link>
                                        : 
                                            'Paid Online'
                                        }
                                    </td>
                                    <td className="px-4 py-2">
                                        <BookingStatus booking={booking} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="mt-3 text-gray-500 text-center">No bookings available.</p>
                )}
                <button className="flex items-center px-4 py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="mr-2" /> Go Back
                </button>
            </div>

            {/* Modal for showing proof of payment */}
            {showProofOfPayment && (
                <ProofOfPaymentModal paymentProofImage={paymentProofImage} handleCloseModal={handleCloseModal}/>
            )}
        </div>
    );
};


export default ViewBookedSeminars

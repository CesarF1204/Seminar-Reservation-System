import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import { capitalizeFirstLetter, convertDateFormat } from '../../helpers/globalHelpers';
import ProofOfPaymentModal from '../../components/Seminar/ProofOfPaymentModal';
import BookingStatus from '../../components/Seminar/BookingStatus';

const ViewBookedSeminars = () => {
    /* Default page, limit, sortKey, and sortDirection */
    const [ page, setPage ] = useState(1);
    const [ limit, setLimit ] = useState(5);
    const [ sortKey, setSortKey ] = useState('seminar.title');
    const [ sortDirection, setSortDirection ] = useState('asc');

    /* Navigate to different routes */
    const navigate = useNavigate();
    /* Extract showToast function from context for displaying notifications */
    const {showToast, data} = useAppContext();

    const [ showProofOfPayment, setShowProofOfPayment ] = useState(false);
    const [ paymentProofImage, setPaymentProofImage ] = useState('');
    
    /* Fetch booked seminars data using react-query's useQuery hook */
    const { data: booked_seminars = [], isError } = useQuery(
        ["fetchBookings" , page, limit, sortKey, sortDirection],
        ()=>apiClient.fetchBookings(data.token, { page, limit, sortKey, sortDirection }),
        {
            suspense: true, /* Enables React's Suspense mode, allowing the component to wait for data to load before rendering. */
            refetchOnWindowFocus: false, /* Optional: Disable refetching on window focus */
            retry: 1, /* Optional: Number of retry attempts */
            keepPreviousData: true, /* Ensures that the previous data is kept while new data is loading, preventing UI flickers. */
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

    /* Display the appropriate sort icon based on the current sort direction */
    const renderSortIcon = (key) => {
        if(sortKey === key) {
            return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    };

    /* Reset the page to 1 when the limit, sortKey, and sortDirection changes */
    useEffect(() => {
        setPage(1);
    }, [limit, sortKey, sortDirection]);
    
    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className="mt-4 max-w-6xl w-full">
                <div className="flex items-center justify-between">
                    {/* Title */}
                    <h2 className="text-2xl font-semibold text-center">Booked Seminars</h2>
                    {/* Dropdown for selecting limit */}
                    <div>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="px-4 py-2 bg-gray-700 text-white rounded-md"
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={15}>15 per page</option>
                        </select>
                    </div>
                </div>
                {booked_seminars.bookings && booked_seminars.bookings.length > 0 ? (
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
                            {booked_seminars.bookings.map((booking) => (
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
                {/* Pagination */}
                <div className="flex justify-center mt-1">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((prev) => prev - 1)}
                        className="px-4 py-2 bg-gray-700 text-white disabled:bg-gray-400"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">{`Page ${page} of ${booked_seminars?.totalPages || 1}`}</span>
                    <button
                        disabled={booked_seminars?.currentPage === booked_seminars?.totalPages}
                        onClick={() => setPage((prev) => prev + 1)}
                        className="px-4 py-2 bg-gray-700 text-white disabled:bg-gray-400"
                    >
                        Next
                    </button>
                </div>
                {/* Go back button */}
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

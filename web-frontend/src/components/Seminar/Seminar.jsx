import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';
import { truncateSentence, convertDateFormat } from '../../helpers/globalHelpers';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';

const Seminar = () => {
    /* Default page, limit, sortKey, and sortDirection */
    const [ page, setPage ] = useState(1);
    const [ limit, setLimit ] = useState(5);
    const [ sortKey, setSortKey ] = useState('title'); 
    const [ sortDirection, setSortDirection ] = useState('asc');

    /* Extract showToast function from context for displaying notifications */
    const { showToast } = useAppContext();

    /* Fetch seminars data using react-query's useQuery hook */
    const { data: seminar_data = {}, isError } = useQuery(
        ["fetchSeminars", page, limit, sortKey, sortDirection],
        () => apiClient.fetchAllSeminar({ page, limit, sortKey, sortDirection }),
        {
            suspense: true, /* Enables React's Suspense mode, allowing the component to wait for data to load before rendering. */
            refetchOnWindowFocus: false, /* Optional: Disable refetching on window focus */
            retry: 1, /* Optional: Number of retry attempts */
            keepPreviousData: true, /* Ensures that the previous data is kept while new data is loading, preventing UI flickers. */
        }
    );

    /* Check if there are errors */
    if (isError) {
        showToast({ message: "Failed to load seminars. Please try again later.", type: "ERROR" });
    }

    /* Handle sorting */
    const handleSort = (key) => {
        if (sortKey === key) {
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
        if (sortKey === key) {
            return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    };

    /* Reset the page to 1 when the limit, sortKey, and sortDirection changes */
    useEffect(() => {
        setPage(1);
    }, [limit, sortKey, sortDirection]);

    return (
        <>
            <div className="flex items-center justify-center bg-gray-100">
                <div className="mt-4 max-w-6xl w-full">
                    <div className="flex items-center justify-between">
                        {/* Title */}
                        <h2 className="text-2xl font-semibold">Available Seminars</h2>
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
                    {seminar_data.seminars && seminar_data.seminars.length > 0 ? (
                        <table className="table-auto w-full mt-1 bg-gray-800 text-white shadow-lg">
                            <thead>
                                <tr className="bg-gray-700 whitespace-nowrap">
                                    <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('title')}>
                                        <div className="flex items-center justify-center">
                                            Title {renderSortIcon('title')}
                                        </div>
                                    </th>
                                    <th className="px-4 py-2 text-center cursor-pointer">
                                        <div className="flex items-center justify-center">
                                            Description
                                        </div>
                                    </th>
                                    <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('date')}>
                                        <div className="flex items-center justify-center">
                                            Date {renderSortIcon('date')}
                                        </div>
                                    </th>
                                    <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('speaker.name')}>
                                        <div className="flex items-center justify-center">
                                            Speaker {renderSortIcon('speaker.name')}
                                        </div>
                                    </th>
                                    <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('fee')}>
                                        <div className="flex items-center justify-center">
                                            Price {renderSortIcon('fee')}
                                        </div>
                                    </th>
                                    <th className="px-4 py-2 text-center">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {seminar_data.seminars.map((seminar) => (
                                    <tr key={seminar._id} className="hover:bg-gray-700">
                                        <td className="px-4 py-2">{seminar.title}</td>
                                        <td className="px-4 py-2">{truncateSentence(seminar.description)}</td>
                                        <td className="px-4 py-2">{convertDateFormat(seminar.date)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{seminar.speaker.name}</td>
                                        <td className="px-4 py-2">₱{seminar.fee}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-center">
                                            <Link
                                                to={`/seminar/${seminar._id}`}
                                                className="text-blue-400 hover:text-blue-600"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="mt-3 text-gray-500 text-center">No seminars available at the moment.</p>
                    )}
                </div>
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-1">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-4 py-2 bg-gray-700 text-white disabled:bg-gray-400"
                >
                    Previous
                </button>
                <span className="px-4 py-2">{`Page ${page} of ${seminar_data?.totalPages || 1}`}</span>
                <button
                    disabled={seminar_data?.currentPage === seminar_data?.totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-gray-700 text-white disabled:bg-gray-400"
                >
                    Next
                </button>
            </div>
        </>
    );
};

export default Seminar;
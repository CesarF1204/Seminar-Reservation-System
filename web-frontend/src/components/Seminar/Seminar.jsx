import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';
import { truncateSentence, convertDateFormat, sortByKey } from '../../helpers/globalHelpers';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';

const Seminar = () => {
    const [ sortKey, setSortKey ] = useState('');
    const [ sortDirection, setSortDirection ] = useState('asc');

    /* Extract showToast function from context for displaying notifications */
    const {showToast} = useAppContext();

    /* Fetch seminars data using react-query's useQuery hook */
    const { data: seminars = [], isError } = useQuery(
        "fetchSeminars",
        apiClient.fetchAllSeminar,
        {
            suspense: true, /* Enables React's Suspense mode, allowing the component to wait for data to load before rendering. */
            refetchOnWindowFocus: false, /* Optional: Disable refetching on window focus */
            retry: 1, /* Optional: Number of retry attempts */
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
    /* Sort the seminars list based on the selected key and direction */
    const sortedSeminars = sortByKey([...seminars], sortKey, sortDirection);

    /* Display the appropriate sort icon based on the current sort direction */
    const renderSortIcon = (key) => {
        if (sortKey === key) {
            return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    };

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className="mt-4 max-w-6xl w-full">
                <h2 className="text-2xl font-semibold text-center ml-12">Available Seminars</h2>
                {seminars.length > 0 ? (
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
                            {sortedSeminars.map((seminar) => (
                                <tr key={seminar._id} className="hover:bg-gray-700">
                                    <td className="px-4 py-2 ">{seminar.title}</td>
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
    );
};

export default Seminar;
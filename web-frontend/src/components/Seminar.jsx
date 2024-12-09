import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';

const Seminar = () => {
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

    /* Error state: show error toast if there is an issue loading data */
    if (isError) {
        showToast({ message: "Failed to load seminars. Please try again later.", type: "ERROR" })
    }

    return (
        <div className="mt-5">
            <h2 className="text-2xl font-semibold">Available Seminars</h2>
            {seminars.length > 0 ? (
                <table className="table-auto w-full mt-3 bg-gray-800 text-white shadow-lg">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="px-4 py-2 text-center">Title</th>
                            <th className="px-4 py-2 text-center">Description</th>
                            <th className="px-4 py-2 text-center">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {seminars.map((seminar) => (
                            <tr key={seminar._id} className="hover:bg-gray-700">
                                <td className="px-4 py-2">{seminar.title}</td>
                                <td className="px-4 py-2">{seminar.description.length > 100 ? seminar.description.substring(0, 100) + '...' : seminar.description}</td>
                                <td className="px-4 py-2 text-center">
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
                <p className="mt-3 text-gray-500">No seminars available at the moment.</p>
            )}
        </div>
    );
};

export default Seminar;
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';
import { truncateSentence, convertDateFormat, debounce } from '../../helpers/globalHelpers';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';

const Seminar = () => {
    /* Default state for page, limit, sortKey, sortDirection, search, and debouncedSearch  */
    const [ page, setPage ] = useState(1);
    const [ limit, setLimit ] = useState(5);
    const [ sortKey, setSortKey ] = useState('title'); 
    const [ sortDirection, setSortDirection ] = useState('asc');
    const [ search, setSearch ] = useState('');
    const [ debouncedSearch, setDebouncedSearch ] = useState('');

    /* Extract showToast function from context for displaying notifications */
    const { showToast, data } = useAppContext();

    /* Fetch seminars data using react-query's useQuery hook */
    const { data: seminar_data = {}, isError, isFetching } = useQuery(
        ["getSeminars", page, limit, sortKey, sortDirection, debouncedSearch],
        () => apiClient.getSeminars(data.token, { page, limit, sortKey, sortDirection, search: debouncedSearch }),
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

    /* Debounce the search input */
    const handleSearch = useCallback(
        debounce((value) => {
            setDebouncedSearch(value);
        }, 1500),
        []
    );

    /* Handle search input change */
    const onSearchChange = (e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
    };

    /* Reset the page to 1 when the limit, sortKey, and sortDirection changes */
    useEffect(() => {
        setPage(1);
    }, [limit, sortKey, sortDirection, debouncedSearch]);

    return (
        <>
            <div className="flex items-center justify-center bg-gray-100">
                <div className="mt-4 max-w-6xl w-full px-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        {/* Title */}
                        <h2 className="text-2xl font-semibold whitespace-nowrap hidden sm:block">Available Seminars</h2>
                        <div className="flex flex-row sm:flex-row items-center sm:mt-0">
                            {/* Search Bar */}
                            <div className="flex px-4 py-2 rounded-md border-2 border-blue-500 overflow-hidden max-w-full sm:max-w-md font-[sans-serif]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" className="fill-gray-600 mr-3 rotate-90">
                                    <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search title"
                                    value={search}
                                    onChange={onSearchChange}
                                    className="w-full outline-none bg-transparent text-gray-600 text-sm"
                                />
                                {debouncedSearch && isFetching && <div className="ml-2 animate-spin border-t-2 border-blue-500 rounded-full w-4 h-4"></div>}
                            </div>
                            {/* Dropdown for selecting limit */}
                            <div className="ml-4">
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
                    </div>
                    <div className="overflow-x-auto mt-1">
                        {seminar_data.seminars && seminar_data.seminars.length > 0 ? (
                            <table className="table-auto w-full bg-gray-800 text-white shadow-lg">
                                <thead>
                                    <tr className="bg-gray-700 whitespace-nowrap">
                                        <th className="px-4 py-2 text-center cursor-pointer" onClick={() => handleSort('title')}>
                                            <div className="flex items-center justify-center">
                                                Title {renderSortIcon('title')}
                                            </div>
                                        </th>
                                        <th className="px-4 py-2 text-center">Description</th>
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
                    { seminar_data.seminars?.length !== 0 &&
                        <>
                        {/* Pagination */}
                        <div className="flex justify-center mt-1">
                            <button
                                disabled={page === 1 || seminar_data.seminars?.length === 0}
                                onClick={() => setPage((prev) => prev - 1)}
                                className="px-4 py-2 bg-gray-700 text-white disabled:bg-gray-400"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2">{`Page ${page} of ${seminar_data?.totalPages || 1}`}</span>
                            <button
                                disabled={seminar_data?.currentPage === seminar_data?.totalPages || seminar_data.seminars?.length === 0}
                                onClick={() => setPage((prev) => prev + 1)}
                                className="px-4 py-2 bg-gray-700 text-white disabled:bg-gray-400"
                            >
                                Next
                            </button>
                        </div>
                        </>
                    }
                </div>
            </div>
        </>
    );
};

export default Seminar;
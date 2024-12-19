import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'react-query';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import { debounce } from '../../helpers/globalHelpers';
import UpdateUserRole from '../../components/User/UpdateUserRole';
import AccountDisable from '../../components/User/AccountDisable';
import UserAction from '../../components/User/UserAction';

const ViewUsers = () => {
    /* Default state for page, limit, sortKey, sortDirection, search, and debouncedSearch  */
    const [ page, setPage ] = useState(1);
    const [ limit, setLimit ] = useState(5);
    const [ sortKey, setSortKey ] = useState('firstName');
    const [ sortDirection, setSortDirection ] = useState('asc');
    const [ search, setSearch ] = useState('');
    const [ debouncedSearch, setDebouncedSearch ] = useState('');
    
    /* Navigate to different routes */
    const navigate = useNavigate();
    /* Extract showToast function from context for displaying notifications */
    const {showToast, data} = useAppContext();

    /* Fetch users data using react-query's useQuery hook */
    const { data: users_data = [], isError, refetch, isFetching } = useQuery(
        ["fetchUsers", page, limit, sortKey, sortDirection, debouncedSearch],
        ()=>apiClient.fetchUsers(data.token, { page, limit, sortKey, sortDirection, search: debouncedSearch }),
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
        <div className="flex items-center justify-center bg-gray-100">
            <div className="mt-4 max-w-6xl w-full px-4">
                <div className="flex items-center justify-between">
                    {/* Title */}
                    <h2 className="text-2xl font-semibold text-center hidden sm:block">Registered Users</h2>
                    <div className="flex flex-row sm:flex-row items-center sm:mt-0">
                        {/* Search Bar */}
                        <div className="flex px-4 py-2 rounded-md border-2 border-blue-500 overflow-hidden max-w-md mx-auto font-[sans-serif]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" className="fill-gray-600 mr-3 rotate-90">
                                <path
                                    d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                                </path>
                            </svg>
                            <input 
                                type="text"
                                placeholder="Search name or email"
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
                    {users_data.users && users_data.users.length > 0 ? (
                        <div>
                            <table className="table-auto w-full mt-1 bg-gray-800 text-white shadow-lg">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="px-4 py-2" onClick={() => handleSort('firstName')}>
                                            <div className="flex items-center justify-start">
                                                Name {renderSortIcon('firstName')}
                                            </div>
                                        </th>
                                        <th className="px-4 py-2" onClick={() => handleSort('email')}>
                                            <div className="flex items-center justify-start">
                                                Email Address {renderSortIcon('email')}
                                            </div>
                                        </th>
                                        <th className="px-4 py-2" onClick={() => handleSort('role')}>
                                            <div className="flex items-center justify-start">
                                                Role {renderSortIcon('role')}
                                            </div>
                                        </th>
                                        <th className="px-4 py-2" onClick={() => handleSort('isDisabled')}>
                                            <div className="flex items-center justify-start">
                                                Restriction {renderSortIcon('isDisabled')}
                                            </div>
                                        </th>
                                        <th className="px-4 py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users_data.users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-700">
                                            <td className="px-4 py-2 flex items-center">
                                                <img 
                                                    src={user.profilePicture} 
                                                    alt={`${user.firstName} ${user.lastName}`} 
                                                    className="w-8 h-8 rounded-full mr-2"
                                                />
                                                <span className="text-gray-200">{user.firstName} {user.lastName}</span>
                                            </td>
                                            <td className="px-4 py-2">{user.email}</td>
                                            <td className="px-4 py-2">
                                                <UpdateUserRole user={user} />
                                            </td>
                                            <td className="px-4 py-2">
                                                <AccountDisable user={user} />
                                            </td>
                                            <td>
                                                <UserAction user={user} refetch={refetch} setPage={setPage} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            { users_data.users?.length !== 0 &&
                                <>
                                {/* Pagination */}
                                <div className="flex justify-center mt-1">
                                    <button
                                        disabled={page === 1 || users_data.users?.length === 0}
                                        onClick={() => setPage((prev) => prev - 1)}
                                        className="px-4 py-2 bg-gray-700 text-white disabled:bg-gray-400"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-4 py-2">{`Page ${page} of ${users_data?.totalPages || 1}`}</span>
                                    <button
                                        disabled={users_data?.currentPage === users_data?.totalPages || users_data.users?.length === 0}
                                        onClick={() => setPage((prev) => prev + 1)}
                                        className="px-4 py-2 bg-gray-700 text-white disabled:bg-gray-400"
                                    >
                                        Next
                                    </button>
                                </div>
                                </>
                            }
                        </div>
                    ) : (
                        <p className="mt-3 text-gray-500 text-center">No users registered.</p>
                    )}
                </div>
                <button className="flex items-center px-4 py-2 mt-4 mb-4 bg-gray-700 text-white disabled:bg-gray-400" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="mr-2" /> Go Back
                </button>
            </div>
        </div>
    )
}

export default ViewUsers

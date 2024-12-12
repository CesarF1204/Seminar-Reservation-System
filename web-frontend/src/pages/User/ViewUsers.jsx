import React from 'react';
import { useQuery } from 'react-query';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { capitalizeFirstLetter } from '../../helpers/globalHelpers';
import UpdateUserRole from '../../components/User/UpdateUserRole';
import AccountDisable from '../../components/User/AccountDisable';
import UserAction from '../../components/User/UserAction';

const ViewUsers = () => {
    /* Navigate to different routes */
    const navigate = useNavigate();
    /* Extract showToast function from context for displaying notifications */
    const {showToast, data} = useAppContext();

    /* Fetch users data using react-query's useQuery hook */
    const { data: users = [], isError, refetch } = useQuery(
        "fetchUsers",
        ()=>apiClient.fetchUsers(data.token),
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

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className="mt-4 max-w-6xl w-full">
                <h2 className="text-2xl font-semibold text-center">Registered Users</h2>
                {users.length > 0 ? (
                    <table className="table-auto w-full mt-1 bg-gray-800 text-white shadow-lg">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email Address</th>
                                <th className="px-4 py-2">Role</th>
                                <th className="px-4 py-2">Restriction</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-700">
                                    <td className="px-4 py-2">{capitalizeFirstLetter(user.firstName)} {capitalizeFirstLetter(user.lastName)}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">
                                        <UpdateUserRole user={user} />
                                    </td>
                                    <td className="px-4 py-2">
                                        <AccountDisable user={user} />
                                    </td>
                                    <td>
                                        <UserAction user={user} refetch={refetch} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="mt-3 text-gray-500 text-center">No users registered.</p>
                )}
                <button className="flex items-center px-4 py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="mr-2" /> Go Back
                </button>
            </div>
        </div>
    )
}

export default ViewUsers

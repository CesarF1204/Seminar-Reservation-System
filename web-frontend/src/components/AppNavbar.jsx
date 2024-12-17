import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { useAppContext } from '../contexts/AppContext';
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../api-client';
import LogOutButton from './User/LogOutButton';
import Notification from './Notification';

const AppNavbar = ({ user }) => {
    /* State to check if Navbar collapse */
    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showToast } = useAppContext();

    const isActive = (path) => location.pathname === path;

    /* Mutation for logging out */
    const logOutMutation = useMutation(apiClient.signOut, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken", { exact: true });
            showToast({ message: "You're not an admin. Log-in again", type: "ERROR" });
            navigate("/sign-in"); /* Redirect to sign-in page after logout */
        },
        onError: (error) => {
            showToast({ message: error.message, type: "ERROR" });
        },
    });

    useEffect(() => {
        /* Connect to the Socket.io server */
        const socket = io('http://localhost:5000', {
          withCredentials: true, // Allow credentials (cookies)
        });
    
        /* Listen for the 'updatedUser' event */
        socket.on('updatedUser', ({ _id: user_id, role }) => {
            if(user.userId === user_id && role !== 'admin'){
                logOutMutation.mutate();
            }
        });
    
        return () => {
        socket.disconnect();
        };
    }, [user.userId, logOutMutation]);

    return (
        <nav className="bg-gray-900 p-4 shadow-md sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                {/* Left Section: Header and Links */}
                <div className="flex items-center space-x-4">
                    <Link to="/" className="text-white text-2xl font-bold">
                        Seminar Reservation System
                    </Link>
                    <div className="hidden lg:flex space-x-4">
                        <Link 
                            to="/dashboard" 
                            className={`px-4 py-2 rounded whitespace-nowrap ${
                                isActive('/dashboard') ? 'bg-gray-700 text-gray-300' : 'text-white hover:bg-gray-800'
                            }`}
                        >
                            Home
                        </Link>
                        <Link 
                            to="/bookings" 
                            className={`px-4 py-2 rounded whitespace-nowrap ${
                                isActive('/bookings') ? 'bg-gray-700 text-gray-300' : 'text-white hover:bg-gray-800'
                            }`}
                        >
                            View Bookings
                        </Link>
                        {user.role === 'admin' &&
                        <>
                            <Link 
                                to="/view_users" 
                                className={`px-4 py-2 rounded whitespace-nowrap ${
                                    isActive('/view_users') ? 'bg-gray-700 text-gray-300' : 'text-white hover:bg-gray-800'
                                }`}
                            >
                                View Users
                            </Link>
                            <Link 
                                to="/create_seminar" 
                                className={`px-4 py-2 rounded whitespace-nowrap ${
                                    isActive('/create_seminar') ? 'bg-gray-700 text-gray-300' : 'text-white hover:bg-gray-800'
                                }`}
                            >
                                Create Seminar
                            </Link>
                        </>
                        }
                    </div>
                </div>
                
                {/* Right Section: Notifications and Burger Icon */}
                <div className="flex items-center space-x-4 lg:hidden">
                {user.role !== 'admin' &&
                    <Notification />
                }
                    <button 
                        className="text-white" 
                        onClick={() => setIsNavbarCollapsed(!isNavbarCollapsed)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Right Section: Notifications and Logout for large screens */}
                <div className="hidden lg:flex items-center space-x-4">
                {user.role !== 'admin' &&
                    <Notification />
                }
                    <LogOutButton />
                </div>
            </div>

            {/* Sidebar (Mobile) */}
            <div 
                className={`fixed top-0 right-0 h-full w-64 bg-gray-800 shadow-lg transform ${
                    isNavbarCollapsed ? 'translate-x-0' : 'translate-x-full'
                } transition-transform duration-300 ease-in-out`}
            >
                <button 
                    className="text-white absolute top-4 right-4" 
                    onClick={() => setIsNavbarCollapsed(false)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="mt-16 flex flex-col space-y-4 px-6">
                    <Link 
                        to="/dashboard" 
                        className={`px-4 py-2 rounded ${
                            isActive('/dashboard') ? 'bg-gray-700 text-gray-300' : 'text-white hover:bg-gray-700'
                        }`}
                        onClick={() => setIsNavbarCollapsed(false)}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/bookings" 
                        className={`px-4 py-2 rounded ${
                            isActive('/bookings') ? 'bg-gray-700 text-gray-300' : 'text-white hover:bg-gray-700'
                        }`}
                        onClick={() => setIsNavbarCollapsed(false)}
                    >
                        View Bookings
                    </Link>
                    {user.role === 'admin' &&
                    <>
                        <Link 
                            to="/view_users" 
                            className={`px-4 py-2 rounded ${
                                isActive('/view_users') ? 'bg-gray-700 text-gray-300' : 'text-white hover:bg-gray-700'
                            }`}
                            onClick={() => setIsNavbarCollapsed(false)}
                        >
                            View Users
                        </Link>
                        <Link 
                            to="/create_seminar" 
                            className={`px-4 py-2 rounded ${
                                isActive('/create_seminar') ? 'bg-gray-700 text-gray-300' : 'text-white hover:bg-gray-700'
                            }`}
                            onClick={() => setIsNavbarCollapsed(false)}
                        >
                            Create Seminar
                        </Link>
                    </>
                    }
                    <LogOutButton 
                        className="px-4 py-2 rounded text-white hover:bg-gray-700"
                        onClick={() => setIsNavbarCollapsed(false)}
                    />
                </div>
            </div>
        </nav> 
    );
    
}

export default AppNavbar
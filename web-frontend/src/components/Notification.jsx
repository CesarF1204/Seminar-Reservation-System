import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from 'react-query';
import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';
import { convertDateFormat } from '../helpers/globalHelpers';
import { FaBell } from 'react-icons/fa';

const Notification = ({ isNavbarCollapsed }) => {
    /* Accessing the context data */
    const { data } = useAppContext();
    /* State for controlling the visibility of the notification dropdown */
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    /* Ref to handle click outside of notification box */
    const notificationRef = useRef(null);

    /* Fetching booked seminars using react-query */
    const { data: booked_seminars = [] } = useQuery(
        "fetchAllBookings",
        () => apiClient.fetchAllBookings(data.token),
        {
            suspense: true,
            refetchOnWindowFocus: false,
            retry: 1,
        }
    );

    /* Array to hold reminder messages */
    const reminder_msg = [];

    /* Loop through booked seminars and generate reminder messages */
    booked_seminars.forEach((booking) => {
        /* Check if the seminar is today and it is a confirmed booking */
        if(convertDateFormat(booking.seminar.date) === convertDateFormat(Date.now()) 
            && booking.paymentStatus === 'confirmed') {
                reminder_msg.push({
                    message: `Don't forget your seminar today, ${booking.seminar.title} from ${booking.seminar.timeFrame.from} - ${booking.seminar.timeFrame.to}!`,
                });
        }
    });

    /* Determine if there are any reminders to show to the notification bell */
    const isBellActive = reminder_msg.length > 0;

    /* Close the notification if clicked outside of the notification box */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative mr-6 mt-2 mb-2" ref={notificationRef}>
            <FaBell
                size={24}
                className={`text-white cursor-pointer ${isBellActive ? 'animate-wiggle' : ''}`} // Add wiggle if there are reminders
                onClick={() => {
                    setIsNotificationVisible(!isNotificationVisible);
                }}
            />
            {isBellActive && (
                <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2.5 h-2.5" />
            )}

            {isNotificationVisible && (
                <div
                className={`absolute ${isNavbarCollapsed ? 'left-0' : 'right-0'} mt-2 w-64 bg-white border border-blue-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto scrollbar-hide`}
                >
                    {reminder_msg.length > 0 ? (
                        reminder_msg.map((msg, index) => (
                            <div
                                key={index}
                                className="p-3 border-b border-blue-100 cursor-pointer hover:bg-blue-200"
                            >
                                <p className="text-sm"><span className="text-red-500 font-bold">Reminder: </span>{msg.message}</p>
                            </div>
                        ))
                    ) : (
                        <div className="p-3 text-center text-gray-500">
                            No new reminders
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Notification;

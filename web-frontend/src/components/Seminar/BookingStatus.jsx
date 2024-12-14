import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';
import { capitalizeFirstLetter } from '../../helpers/globalHelpers';
import { useNavigate } from 'react-router-dom';

const BookingStatus = ({ booking }) => {
    /* Navigate to different routes */
    const navigate = useNavigate();
    /* Extract showToast function from context for displaying notifications */
    const {showToast, data} = useAppContext();
    /* Initialize the React Query client to manage cache and query state */
    const queryClient = useQueryClient();

    /* Use useForm hook to manage registration, validation, and submission */
    const {
        register, /* Register input fields with validation rules */
        formState: { errors }, /* Extract form validation errors */
        handleSubmit, /* Handle form submission */ 
    } = useForm();

    /* Mutation for updating the paymentStatus of booked seminar */
    const mutation = useMutation((formData) => apiClient.updateBookingStatus(booking._id, formData, data.token), {
        onSuccess: async () => {
            /* Show success toast */
            showToast({ message: "Booking Status Updated", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken", { exact: true });
        },
        onError: (error) => {
            /* Show error toast  */
            showToast({ message: error.message, type: "ERROR"})
        }
    })

    /* Handle form submission */
    const onChange = handleSubmit((formData)=>{
        mutation.mutate(formData);
    })

    return (
        <>
            { data.role !== 'admin'
            ?
                capitalizeFirstLetter(booking.paymentStatus) 
            :
                <form onChange={onChange}>
                    <select 
                        className="text-black bg-white border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('paymentStatus', { required: 'Booking status is required' })}>
                            <option value={booking.paymentStatus} className="text-black">
                                {capitalizeFirstLetter(booking.paymentStatus)}
                            </option>
                            <option value={booking.paymentStatus === 'pending' ? 'confirmed' : 'pending'} className="text-black">
                                {booking.paymentStatus === 'pending' ? 'Confirmed' : 'Pending'}
                            </option>
                            <option value={booking.paymentStatus === 'rejected' ? 'confirmed' : 'rejected'} className="text-black">
                                {booking.paymentStatus === 'rejected' ? 'Confirmed' : 'Rejected'}
                            </option>
                    </select>
                </form>
            }
        </>
    )
}

export default BookingStatus

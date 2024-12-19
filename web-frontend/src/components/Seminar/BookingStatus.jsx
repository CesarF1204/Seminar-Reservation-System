import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';
import { capitalizeFirstLetter } from '../../helpers/globalHelpers';

const BookingStatus = ({ booking }) => {
    /* State to use to set the updated status after the admin updated the booking status */
    const [ updatedBookingStatus,  setUpdatedBookingStatus ] = useState();

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
        onSuccess: async (req, res) => {
            /* Show success toast */
            showToast({ message: "Booking Status Updated", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken", { exact: true });
            /* Set the updated booking status */
            setUpdatedBookingStatus(res.paymentStatus);
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

    /* Check if the payment status is confirmed or rejected, then set isDisable to true */
    const isDisabled = ['confirmed', 'rejected'].includes(updatedBookingStatus || booking.paymentStatus);

    return (
        <>
            { data.role !== 'admin'
            ?
                capitalizeFirstLetter(booking.paymentStatus) 
            :
                <form onChange={onChange}>
                    <select 
                        className={`text-black bg-white border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 
                            ${ isDisabled ? 'bg-gray cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        {...register('paymentStatus', { required: 'Booking status is required' })}
                        disabled={isDisabled}
                        title={isDisabled ? `You cannot update this seminar. It's ${updatedBookingStatus || booking.paymentStatus} already.` : ''}
                        >
                            <option value={booking.paymentStatus} className="text-black">
                                {updatedBookingStatus || capitalizeFirstLetter(booking.paymentStatus)}
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

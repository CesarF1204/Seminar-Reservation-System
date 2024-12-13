import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';

const QRCodePayment = () => {
    /* Navigate to different routes */
    const navigate = useNavigate();
    /* Extract showToast function from context for displaying notifications */
    const { showToast, data } = useAppContext();

    /* Initialize the React Query client to manage cache and query state */
    const { register, formState: { errors }, handleSubmit } = useForm();

    /* Get the seminar ID from the URL parameters */
    const { id: seminar_id } = useParams();

    /* Set up the mutation for create booking API call */
    const mutation = useMutation((formData)=>apiClient.createBooking(formData, data.token), {
        onSuccess: async () => {
            /* Show success toast */
            showToast({ message: "Uploaded Payment. Seminar Booked!", type: "SUCCESS" })
            /* Navigate to dashboard page */
            navigate("/dashboard");
        },
        onError: (error) => {
            /* Show error toast  */
            showToast({ message: error.message, type: "ERROR"});
        }
    })

    /* Handle form submission */
    const onSubmit = handleSubmit((data)=>{
        const formData = new FormData();
        /* Append fields */
        formData.append("proofOfPayment", data.proofOfPayment[0]);
        formData.append("seminarId", data.seminarId);
        
        /* Trigger the mutation with the updated form data */
        mutation.mutate(formData);
    })

    return (
        <div className="flex flex-col items-center">
            <p className="text-center text-gray-700">Scan QR Code</p>
            <img 
                src="https://res.cloudinary.com/dyw3wg9sl/image/upload/v1734076902/gcash_payment_aipqnh.jpg" 
                alt="QR Code for Payment" 
                className="mb-4 w-40 h-auto rounded-md"
            />
            <form encType="multipart/form-data" onSubmit={onSubmit}>
                <label className="block text-gray-700">Upload Proof of Payment:</label>
                <input
                    type="file"
                    accept="image/*"
                    className="w-full mb-4 px-4 py-2 border rounded-md cursor-pointer"
                    {...register("proofOfPayment")}
                />
                <input type="hidden" {...register("seminarId", { value: seminar_id })} />
                <div className="flex justify-end space-x-2">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QRCodePayment;
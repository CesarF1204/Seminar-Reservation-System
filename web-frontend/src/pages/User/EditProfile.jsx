import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';

const EditProfile = () => {
    const location = useLocation();
    const { newProfileDetails } = location.state || {};

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

    /* Mutation for registering the user */
    const mutation = useMutation((formData) => apiClient.updateProfile(formData, data.token), {
        onSuccess: async (req, res) => {
            /* Show success toast */
            showToast({ message: "Profile Updated", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken", { exact: true });

            /* Navigate to Login page */
            navigate("/dashboard", { state: {newProfileDetails: res} });
        },
        onError: (error) => {
            /* Show error toast  */
            showToast({ message: error.message, type: "ERROR"})
        }
    })

    /* Handle form submission */
    const onSubmit = handleSubmit((formData)=>{
        mutation.mutate(formData);
    })

    /* If newProfileDetails exists, use it as the default value for fields */
    const firstName = newProfileDetails?.firstName || data.firstName;
    const lastName = newProfileDetails?.lastName || data.lastName;
    const email = newProfileDetails?.email || data.email;

    return (
        <div className="flex flex-col items-center mt-12">
            <h1 className="text-2xl font-bold mb-6">Update Profile</h1>
            <form className="flex flex-col w-full max-w-xs" onSubmit={onSubmit}>
                <label htmlFor="first_name" className="mb-2 text-sm font-medium">First Name:</label>
                <input
                    type="text"
                    id="first_name"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={firstName}
                    {...register("firstName", { required: '*This field is required' })}
                />
                {errors.firstName && (
                    <span className="text-red-500">{errors.firstName.message}</span>
                )}

                <label htmlFor="last_name" className="mb-2 text-sm font-medium">Last Name:</label>
                <input
                    type="text"
                    id="last_name"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={lastName}
                    {...register("lastName", { required: '*This field is required' })}
                />
                {errors.lastName && (
                    <span className="text-red-500">{errors.lastName.message}</span>
                )}

                <label htmlFor="email" className="mb-2 text-sm font-medium">Email:</label>
                <input
                    type="email"
                    id="email"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={email}
                    {...register("email", { required: '*This field is required' })}
                />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}

                <button 
                    type="submit" 
                    className="py-2 px-4 mt-4 rounded bg-green-500 text-white hover:bg-green-600"
                >
                    Update Profile
                </button>
            </form>
            <button className="flex items-center px-4 py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition" onClick={() => navigate(-1)}>
                <FaArrowLeft className="mr-2" /> Go Back
            </button>
        </div>
    )
}

export default EditProfile

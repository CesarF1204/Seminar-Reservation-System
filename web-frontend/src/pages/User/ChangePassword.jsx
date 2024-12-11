import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';

const ChangePassword = () => {
    /* Navigate to different routes */
    const navigate = useNavigate();
    /* Extract showToast function from context for displaying notifications */
    const {showToast, data} = useAppContext();
    /* Initialize the React Query client to manage cache and query state */
    const queryClient = useQueryClient();

    /* Use useForm hook to manage registration, validation, and submission */
    const {
        register, /* Register input fields with validation rules */
        watch,
        formState: { errors }, /* Extract form validation errors */
        handleSubmit, /* Handle form submission */ 
    } = useForm();

    /* Mutation for registering the user */
    const mutation = useMutation((formData) => apiClient.updateProfile(formData, data.token), {
        onSuccess: async () => {
            /* Show success toast */
            showToast({ message: "Password Updated", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken", { exact: true });

            /* Navigate to Login page */
            navigate("/dashboard");
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

    return (
        <div className="flex flex-col items-center mt-12">
            <h1 className="text-2xl font-bold mb-6">Update Profile</h1>
            <form className="flex flex-col w-full max-w-xs" onSubmit={onSubmit}>
            <label htmlFor="password" className="mb-2 text-sm font-medium">Password:</label>
                <input
                    type="password"
                    id="password"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...register('password', {
                        required: '*This field is required',
                        minLength: {
                        value: 6,
                        message: '*Password must be at least 6 characters',
                        },
                    })}
                />
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}

                <label htmlFor="confirmPassword" className="mb-2 text-sm font-medium">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...register('confirmPassword', {
                        validate: (val) => {
                        if (!val) {
                            return '*This field is required';
                        } else if (watch('password') !== val) {
                            return '*Your passwords do not match';
                        }
                        },
                    })}
                />
                {errors.confirmPassword && (
                    <span className="text-red-500">{errors.confirmPassword.message}</span>
                )}

                <button 
                    type="submit" 
                    className="py-2 px-4 mt-4 rounded bg-green-500 text-white hover:bg-green-600"
                >
                    Update Password
                </button>
            </form>
            <button className="flex items-center px-4 py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition" onClick={() => navigate(-1)}>
                <FaArrowLeft className="mr-2" /> Go Back
            </button>
        </div>
    )
}

export default ChangePassword

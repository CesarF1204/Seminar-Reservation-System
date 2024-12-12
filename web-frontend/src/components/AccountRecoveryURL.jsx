import React from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';

const AccountRecoveryURL = () => {
    const { token } = useParams(); /* Extract the token from the URL */
    
    const { data: user_data, isError, isLoading } = useQuery(
        "resetPassword",
        () => apiClient.resetPasswordLink(token),
        {
            refetchOnWindowFocus: false, /* Disables refetching on window focus */
            retry: 1, /* Number of retry attempts */
        }
    );
    
    /* Navigate to different routes */
    const navigate = useNavigate();

    /* Extract showToast function from context for displaying notifications */
    const { showToast } = useAppContext();

    /* Use useForm hook to manage registration, validation, and submission */
    const {
        register, /* Register input fields with validation rules */
        watch, /* Watch the current value of input field */
        formState: { errors }, /* Extract form validation errors */
        handleSubmit, /* Handle form submission */
    } = useForm();

    /* Mutation for registering the user */
    const mutation = useMutation(
        (formData) => apiClient.resetPassword(formData),
        {
            onSuccess: async () => {
                /* Show success toast */
                showToast({ message: "Password Reset!", type: "SUCCESS" });

                /* Navigate to Login page */
                navigate("/sign-in");
            },
            onError: (error) => {
                /* Show error toast */
                showToast({ message: error.message, type: "ERROR" });
            },
        }
    );

    /* Handle form submission */
    const onSubmit = handleSubmit((formData) => {
        mutation.mutate(formData);
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    /* Show 404 - Page Not Found if there are error or link expired */
    if (isError) {
        return (
            <div className="text-center mt-12 flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
                <p className="text-gray-600">The page you are looking for doesn't exist.</p>
                <p className="text-gray-600">
                    The link expired. Kindly request a new one to{' '}
                    <Link to={'/forgot_password'} className="text-blue-400 hover:text-blue-600 inline-flex items-center" target="_blank">
                        Forgot Password Link
                    </Link>
                </p>
            </div>
        );
    }

    /* Destructure user from user_data */
    const { user } = user_data;

    return (
        <div className="flex flex-col items-center mt-12">
            <h1 className="text-2xl font-bold mb-6">Change Password</h1>
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
                <input type="hidden" {...register('user_id', { value: user._id })} />
                <button
                    type="submit"
                    className="py-2 px-4 mt-4 rounded bg-green-500 text-white hover:bg-green-600"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default AccountRecoveryURL;

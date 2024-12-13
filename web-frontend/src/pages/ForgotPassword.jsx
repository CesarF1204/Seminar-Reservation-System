import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';

const ForgotPassword = () => {
    /* Navigate to different routes */
    const navigate = useNavigate();
    /* Extract showToast function from context for displaying notifications */
    const { showToast } = useAppContext();

    /* Initialize the React Query client to manage cache and query state */
    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm();

    /* Set up the mutation for sign-in API call */
    const mutation = useMutation(apiClient.sendEmailAccountRecovery, {
        onSuccess: async () => {
            /* Show success toast */
            showToast({ message: "Email Sent! Please check your email.", type: "SUCCESS" })
            /* Navigate to sign-in page */
            navigate("/sign-in");
        },
        onError: (error) => {
            /* Show error toast */
            showToast({ message: error.message, type: "ERROR"});
        }
    });

    /* Handle form submission */
    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data);
    });

    return (
        <div className="flex flex-col items-center mt-12">
            <form className="flex flex-col max-w-sm w-full" onSubmit={onSubmit}>
                <label htmlFor="email" className="mb-2 font-medium">Email Address:</label>
                <input
                    type="email"
                    id="email"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-red-500"
                    {...register("email", { required: "*This field is required" })}
                />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
                <button type="submit" className="py-2 px-4 mt-4 rounded bg-blue-500 text-white hover:bg-blue-600">Send Reset Link</button>
            </form>
            <p className="mt-2">A reset password link will be sent to your email address</p>
        </div>
    );
};

export default ForgotPassword;

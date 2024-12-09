import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../api-client';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const Register = () => {
    /* Navigate to different routes */
    const navigate = useNavigate();
    /* Extract showToast function from context for displaying notifications */
    const {showToast} = useAppContext();
    /* Initialize the React Query client to manage cache and query state */
    const queryClient = useQueryClient();

    /* Use useForm hook to manage registration, validation, and submission */
    const {
        register, /* Register input fields with validation rules */
        watch, /* Watch the current value of a specific input field */
        formState: { errors }, /* Extract form validation errors */
        handleSubmit /* Handle form submission */
    } = useForm();

    /* Mutation for registering the user */
    const mutation = useMutation(apiClient.register, {
        onSuccess: async () => {
            /* Show success toast */
            showToast({ message: "Registered Successful", type: "SUCCESS" })
            await queryClient.invalidateQueries("validateToken")
            /* Navigate to Login page */
            navigate("/sign_in");
        },
        onError: (error) => {
            /* Show error toast  */
            showToast({ message: error.message, type: "ERROR"})
        }
    })

    /* Handle form submission */
    const onSubmit = handleSubmit((data)=>{
        mutation.mutate(data)
    })

    return (
        <div className="flex flex-col items-center mt-12">
            <h1 className="text-2xl font-bold mb-6">Create an Account</h1>
            <form className="flex flex-col w-full max-w-xs" onSubmit={onSubmit}>
                <label htmlFor="first_name" className="mb-2 text-sm font-medium">First Name:</label>
                <input
                    type="text"
                    id="first_name"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...register('firstName', { required: '*This field is required' })}
                />
                {errors.firstName && (
                    <span className="text-red-500">{errors.firstName.message}</span>
                )}

                <label htmlFor="last_name" className="mb-2 text-sm font-medium">Last Name:</label>
                <input
                    type="text"
                    id="last_name"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...register('lastName', { required: '*This field is required' })}
                />
                {errors.lastName && (
                    <span className="text-red-500">{errors.lastName.message}</span>
                )}

                <label htmlFor="email" className="mb-2 text-sm font-medium">Email:</label>
                <input
                    type="email"
                    id="email"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...register('email', { required: '*This field is required' })}
                />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}

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
                    className="p-3 mt-4 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition mb-4"
                >
                    Register
                </button>
            </form>
            <p className="text-sm">
                Already have an account?{' '}
                <span 
                    onClick={() => navigate('/')} 
                    className="text-blue-600 cursor-pointer underline hover:text-blue-700"
                >
                    Sign In
                </span>
            </p>
        </div>
    );
};

export default Register;
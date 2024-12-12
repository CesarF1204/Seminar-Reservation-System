import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';

const EditUser = () => {
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
        reset
    } = useForm();

    const { id: user_id } = useParams();

    /* Fetch users data using react-query's useQuery hook */
    const { data: user = {}, isError } = useQuery(
        "fetchUserById",
        ()=>apiClient.fetchUserById(user_id, data.token),
        {
            suspense: true, /* Enables React's Suspense mode, allowing the component to wait for data to load before rendering. */
            refetchOnWindowFocus: false, /* Optional: Disable refetching on window focus */
            retry: 1, /* Optional: Number of retry attempts */
        }
    );

    /* Error state: show error toast if there is an issue loading data */
    if (isError) {
        showToast({ message: "Failed to load users. Please try again later.", type: "ERROR" })
    }

    /* Mutation for registering the user */
    const mutation = useMutation((formData) => apiClient.updateUserById(user_id, formData, data.token), {
        onSuccess: async () => {
            /* Show success toast */
            showToast({ message: "User Updated!", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken", { exact: true });

            /* Navigate to Login page */
            navigate("/view_users");
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
    
    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            });
        }
    }, [user, reset]);

    return (
        <div className="flex flex-col items-center mt-12">
            <h1 className="text-2xl font-bold mb-6">Update Profile</h1>
            <form className="flex flex-col w-full max-w-xs" onSubmit={onSubmit}>
                <label htmlFor="first_name" className="mb-2 text-sm font-medium">First Name:</label>
                <input
                    type="text"
                    id="first_name"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={user.firstName}
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
                    defaultValue={user.lastName}
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
                    defaultValue={user.email}
                    {...register("email", { required: '*This field is required' })}
                />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}

                <button 
                    type="submit" 
                    className="py-2 px-4 mt-4 rounded bg-green-500 text-white hover:bg-green-600"
                >
                    Update User
                </button>
            </form>
            <button 
                className="flex items-center px-4 py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition" 
                onClick={() => navigate(-1)}
            >
                <FaArrowLeft className="mr-2" /> Go Back
            </button>
        </div>
    )
}

export default EditUser

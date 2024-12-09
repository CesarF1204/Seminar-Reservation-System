import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../api-client';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const Login = () => {
    /* Navigate to different routes */
    const navigate = useNavigate();
    /* Extract showToast function from context for displaying notifications */
    const { showToast, setLoginSuccess } = useAppContext();
    /* Initialize the React Query client to manage cache and query state */
    const queryClient = useQueryClient();

    /* Initialize the React Query client to manage cache and query state */
    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm();

    /* Set up the mutation for sign-in API call */
    const mutation = useMutation(apiClient.signIn, {
        onSuccess: async () => {
            setLoginSuccess(true);

            /* Show success toast */
            showToast({ message: "Sign in Successful", type: "SUCCESS" })
            await queryClient.invalidateQueries("validateToken", { exact: true });
            /* Navigate to dashboard page */
            navigate("/dashboard");
        },
        onError: (error) => {
            /* Show error toast  */
            showToast({ message: error.message, type: "ERROR"});
            navigate("/sign_in");
        }
    })

    /* Handle form submission */
    const onSubmit = handleSubmit((data)=>{
        mutation.mutate(data)
    })
    
    return (
        <div className="flex flex-col items-center mt-12">
            <h1 className="text-2xl font-bold">Login</h1>
            <form className="flex flex-col max-w-sm w-full" onSubmit={onSubmit}>
                <label htmlFor="email" className="mb-2 font-medium">Email:</label>
                <input
                    type="email"
                    id="email"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-red-500"
                    {...register("email", { required: "*This field is required" })}
                />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
                <label htmlFor="password" className="mb-2 font-medium">Password:</label>
                <input
                    type="password"
                    id="password"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...register("password", {
                        required: "*This field is required",
                        minLength: {
                        value: 6,
                        message: "*Password must be at least 6 characters",
                        },
                    })}
                />
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
                <button type="submit" className="py-2 px-4 mt-4 rounded bg-blue-500 text-white hover:bg-blue-600">Login</button>
                <p className="text-sm mt-2">
                    No account yet?{' '}
                    <span
                        onClick={() => navigate('/register')}
                        className="text-blue-500 cursor-pointer underline"
                    >
                        Register
                    </span>
                </p>
            </form>
        </div>
    )
}

export default Login;
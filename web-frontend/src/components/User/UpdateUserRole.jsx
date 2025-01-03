import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';
import { capitalizeFirstLetter } from '../../helpers/globalHelpers';
import { useNavigate } from 'react-router-dom';

const UpdateUserRole = ({ user }) => {
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

    /* Mutation for updating the user role */
    const mutation = useMutation((formData) => apiClient.updateRoleOrRestriction(user._id, formData, data.token), {
        onSuccess: async () => {
            /* Show success toast */
            showToast({ message: "Role Updated", type: "SUCCESS" });
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
        <form onChange={onChange}>
            <select 
                className="text-black bg-white border border-gray-300 rounded-md px-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                {...register('role', { required: 'Role is required' })}>
                    <option value={user.role}>{capitalizeFirstLetter(user.role)}</option>
                    <option value={user.role !== 'admin' ? 'admin' : 'user'}>{user.role !== 'admin' ? 'Admin' : 'User'}</option>
            </select>
            <input type="hidden" {...register('user_id', { value: user._id })} />
        </form>
    )
}

export default UpdateUserRole
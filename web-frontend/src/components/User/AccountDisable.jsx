import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';

const AccountDisable = ({ user }) => {
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

    /* Mutation for updating the user restriction */
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
                className="text-black"
                {...register('isDisabled', { required: '*This field is required' })}>
                    <option value={user.isDisabled}>{user.isDisabled ? 'Yes': 'No'}</option>
                    <option value={user.isDisabled ? false : true}>{user.isDisabled ? 'No' : 'Yes'}</option>
            </select>
            <input type="hidden" {...register('user_id', { value: user._id })} />
        </form>
    )
}

export default AccountDisable

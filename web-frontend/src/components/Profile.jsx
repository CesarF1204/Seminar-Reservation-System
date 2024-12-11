import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';
import { capitalizeFirstLetter } from '../helpers/globalHelpers';

const Profile = ({ user }) => {
    /* Navigate to different routes */
    const navigate = useNavigate();
    /* Extract showToast function from context for displaying notifications */
    const { showToast, data } = useAppContext();

    /* Initialize the React Query client to manage cache and query state */
    const queryClient = useQueryClient();

    /* Initialize the React Query client to manage cache and query state */
    const { register, formState: { errors }, handleSubmit } = useForm();

    /* State to set the new profile picture */
    const [ newProfilePicture, setNewProfilePicture ] = useState(user.profilePicture);

    const { refetch: refetchUserProfile } = useQuery(
        'userProfile',
        () => apiClient.fetchProfile(data.token),
        {
            enabled: !!data.token, /* Only fetch if token is available */
        }
    );
    
    /* Set up the mutation for sign-in API call */
    const mutation = useMutation((formData)=>apiClient.updateProfilePicture(data.userId, formData, data.token), {
        onSuccess: async () => {
            /* Show success toast */
            showToast({ message: "Profile Picture Updated", type: "SUCCESS" })

            /* Refetch the updated user profile data */
            await queryClient.refetchQueries('userProfile', { exact: true });
            const updatedData = await refetchUserProfile();

            /* Set the updated profile picture to setNewProfilePicture state */
            setNewProfilePicture(updatedData.data.profilePicture);

            /* Navigate to dashboard page */
            navigate("/dashboard");
        },
        onError: (error) => {
            /* Show error toast  */
            showToast({ message: error.message, type: "ERROR"});
        }
    })

    /* Handle form submission */
    const onChange = handleSubmit((data)=>{
        const formData = new FormData();
        /* Append fields */
        formData.append("profilePicture", data.profilePicture[0]);

        mutation.mutate(formData);
    })

    const {firstName, lastName, profilePicture, role} = user;

    return (
        <form encType="multipart/form-data" onChange={onChange}>
            <label htmlFor="profile-pic-upload">
                <img
                    src={newProfilePicture || profilePicture}
                    alt={`${firstName} ${lastName}'s profile`}
                    className="w-24 h-24 mx-auto rounded-full shadow-lg border-4 border-gray-500 cursor-pointer"
                />
            </label>
            <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                className="hidden"
                {...register("profilePicture")}
            />
            <div>
                <h1 className="text-2xl font-bold">
                    {capitalizeFirstLetter(firstName)} {capitalizeFirstLetter(lastName)}
                </h1>
                <p className="text-gray-500 italic">{capitalizeFirstLetter(role)}</p>
            </div>
        </form>
    )
}

export default Profile

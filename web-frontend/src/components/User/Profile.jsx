import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate, Link } from 'react-router-dom';
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';
import { capitalizeFirstLetter } from '../../helpers/globalHelpers';
import { FaCamera, FaEdit, FaKey } from "react-icons/fa";

const Profile = ({ user, newProfileDetails }) => {
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

    const {firstName, lastName, profilePicture, email} = user;

    return (
        <div className="flex items-center justify-center">
            <form encType="multipart/form-data" onChange={onChange} className="mr-4">
                <label htmlFor="profile-pic-upload" className="cursor-pointer">
                    <div className="relative w-24 h-24 group">
                        {/* Profile Picture */}
                        <img
                            src={newProfilePicture || profilePicture}
                            alt={`${firstName} ${lastName}'s profile`}
                            className="w-24 h-24 rounded-full shadow-lg border-4 border-blue-500"
                        />
                        {/* Camera Icon */}
                        <FaCamera className="text-2xl absolute bottom-0 right-0 left-15 rounded-full"/>
                    </div>
                </label>
                <input
                    id="profile-pic-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("profilePicture")}
                />
            </form>
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold">
                    {newProfileDetails && newProfileDetails.firstName && newProfileDetails.lastName
                        ? `${capitalizeFirstLetter(newProfileDetails.firstName)} ${capitalizeFirstLetter(newProfileDetails.lastName)}`
                        : `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`}
                </h1>
                <p className="text-gray-500 italic">
                    {newProfileDetails && newProfileDetails.email
                            ? newProfileDetails.email
                            : email
                    }
                </p>
                <div className="mt-2">
                    <Link
                        to={`/edit_profile`}
                        className="text-blue-400 hover:text-blue-600 inline-flex items-center"
                        state={{ newProfileDetails }}
                    >
                        <FaEdit className="mr-1" /> Edit
                    </Link>
                    <Link
                        to={`/change_password`}
                        className="text-blue-400 hover:text-blue-600 inline-flex items-center ml-6"
                        state={{ newProfileDetails }}
                    >
                        <FaKey className="mr-1" /> Change Password
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Profile
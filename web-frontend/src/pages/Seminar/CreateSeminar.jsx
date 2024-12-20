import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../../api-client';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { useAppContext } from '../../contexts/AppContext';
import { convertToAmPm } from '../../helpers/globalHelpers';

const CreateSeminar = () => {
    const [ isCreating, setIsCreating ] = useState(false);

    /* Navigate to different routes */
    const navigate = useNavigate();
    /* Extract showToast function from context for displaying notifications */
    const { showToast, data } = useAppContext();

    /* Initialize the React Query client to manage cache and query state */
    const queryClient = useQueryClient();

    /* Initialize the React Query client to manage cache and query state */
    const { register, formState: { errors }, handleSubmit } = useForm();

    /* Set up the mutation for sign-in API call */
    const mutation = useMutation((formData)=>apiClient.createSeminar(formData, data.token), {
        onSuccess: async () => {
            /* Show success toast */
            showToast({ message: "Seminar Created", type: "SUCCESS" })
            await queryClient.invalidateQueries("validateToken", { exact: true });
            /* Navigate to dashboard page */
            navigate("/dashboard");
        },
        onError: (error) => {
            /* Show error toast  */
            showToast({ message: error.message, type: "ERROR"});
            /* Set isCreating state to false to indicate the form is not submitted */
            setIsCreating(false);
        }
    })

    /* Handle form submission */
    const onSubmit = handleSubmit((data)=>{
        const formData = new FormData();

        /* Append text fields */
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("date", data.date);
        formData.append("timeFrame.from", convertToAmPm(data.timeFrame.from));
        formData.append("timeFrame.to", convertToAmPm(data.timeFrame.to));
        formData.append("venue", data.venue);
        formData.append("speaker.name", data.speaker.name);
        formData.append("speaker.image", data.speaker.image[0] || "https://i.imgur.com/aKGKRzJ.png");
        formData.append("speaker.linkedin", data.speaker.linkedin || "");
        formData.append("fee", data.fee);
        formData.append("slotsAvailable", data.slotsAvailable);

        /* Set isCreating state to true to indicate the form is being submitted */
        setIsCreating(true);

        mutation.mutate(formData);
    })

    /* Get today's date in "YYYY-MM-DD" format */
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="flex flex-col items-center mt-4">
            <h1 className="text-2xl font-bold">Create Seminar</h1>
            <form encType="multipart/form-data" className="flex flex-col max-w-sm w-full" onSubmit={onSubmit}>
                <label htmlFor="title" className="mb-2 font-medium">Title:</label>
                <input
                    type="text"
                    id="title"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-red-500"
                    {...register("title", { required: "*This field is required" })}
                />
                {errors.title && (
                    <span className="text-red-500">{errors.title.message}</span>
                )}

                <label htmlFor="description" className="mb-2 font-medium">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    rows={5}
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-red-500"
                    {...register("description", { required: "*This field is required" })}
                />
                {errors.description && (
                    <span className="text-red-500">{errors.description.message}</span>
                )}
                
                <label htmlFor="date" className="mb-2 font-medium">Date:</label>
                <input
                    type="date"
                    id="date"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-red-500"
                    min={today}
                    {...register("date", { required: "*This field is required" })}
                />
                {errors.date && (
                    <span className="text-red-500">{errors.date.message}</span>
                )}

                <label htmlFor="from" className="mb-2 font-medium">From:</label>
                <input
                    type="time"
                    id="from"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-red-500"
                    {...register("timeFrame.from", { required: "*This field is required" })}
                />
                {errors.timeFrame?.from && (
                    <span className="text-red-500">{errors.timeFrame?.from.message}</span>
                )}

                <label htmlFor="to" className="mb-2 font-medium">To:</label>
                <input
                    type="time"
                    id="to"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-red-500"
                    {...register("timeFrame.to", { required: "*This field is required" })}
                />
                {errors.timeFrame?.to && (
                    <span className="text-red-500">{errors.timeFrame?.to.message}</span>
                )}

                <label htmlFor="venue" className="mb-2 font-medium">Venue:</label>
                <input
                    type="text"
                    id="venue"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-red-500"
                    {...register("venue", { required: "*This field is required" })}
                />
                {errors.venue && (
                    <span className="text-red-500">{errors.venue.message}</span>
                )}

                <label htmlFor="speaker_name" className="mb-2 font-medium">Speaker Name:</label>
                <input
                    type="text"
                    id="speaker_name"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-red-500"
                    {...register("speaker.name", { required: "*This field is required" })}
                />
                {errors.speaker?.name && (
                    <span className="text-red-500">{errors.speaker?.name.message}</span>
                )}

                <label htmlFor="speaker_image" className="mb-2 font-medium">Speaker Image:</label>
                <input
                    type="file"
                    id="speaker_image"
                    accept="image/*"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-red-500"
                    {...register("speaker.image")}
                />
                {errors.speaker?.image && (
                    <span className="text-red-500">{errors.speaker?.image.message}</span>
                )}

                <label htmlFor="speaker_linkedin" className="mb-2 font-medium">Speaker LinkedIn:</label>
                <input
                    type="url"
                    id="speaker_linkedin"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-red-500"
                    {...register("speaker.linkedin")}
                />
                {errors.speaker?.linkedin && (
                    <span className="text-red-500">{errors.speaker?.linkedin.message}</span>
                )}

                <label htmlFor="fee" className="mb-2 font-medium">Fee:</label>
                <input
                    type="number"
                    id="fee"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-red-500"
                    {...register("fee", { required: "*This field is required", validate: value => value >= 0 || "*Fee must be greater than or equal to 0" })}
                />
                {errors.fee && (
                    <span className="text-red-500">{errors.fee.message}</span>
                )}

                <label htmlFor="slots_available" className="mb-2 font-medium">Slots Available:</label>
                <input
                    type="number"
                    id="slots_available"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-red-500"
                    {...register("slotsAvailable", { required: "*This field is required", validate: value => value >= 0 || "*Slots Available must be greater than or equal to 0" })}
                />
                {errors.slotsAvailable && (
                    <span className="text-red-500">{errors.slotsAvailable.message}</span>
                )}

                <button 
                    type="submit" 
                    className={`px-4 py-2 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition 
                            ${isCreating ? 'cursor-not-allowed' : ''}`}
                    disabled={isCreating ? true : false}
                >
                    {isCreating ? 'Creating Seminar...' : 'Create Seminar'}
                </button>
            </form>
            <button className="flex items-center px-4 py-2 mt-4 mb-4 bg-gray-700 text-white disabled:bg-gray-400" onClick={() => navigate(-1)}>
                <FaArrowLeft className="mr-2" /> Go Back
            </button>
        </div>
    );
}

export default CreateSeminar

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import * as apiClient from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';
import { convertTo24HourFormat, convertToAmPm } from '../../helpers/globalHelpers';

const EditSeminar = () => {
    const [ isUpdating, setIsUpdating ] = useState(false);

    /* Navigate to different routes */
    const navigate = useNavigate();
    /* Extract showToast function from context for displaying notifications */
    const { showToast, data } = useAppContext();

    /* Initialize the React Query client to manage cache and query state */
    const queryClient = useQueryClient();

    /* Initialize the React Query client to manage cache and query state */
    const { register, formState: { errors }, handleSubmit } = useForm();

    /* Get seminar id in params */
    const { id: seminar_id } = useParams();

    const { data: seminar = [], isError } = useQuery(
        "fetchSeminarById",
        () => apiClient.fetchSeminarById(seminar_id, data.token),
        {
            suspense: true, /* Enables React's Suspense mode, allowing the component to wait for data to load before rendering. */
            refetchOnWindowFocus: false, /* Optional: Disable refetching on window focus */
            retry: 1, /* Optional: Number of retry attempts */
        }
    );

    /* Error state: show error toast if there is an issue loading data */
    if (isError) {
        showToast({ message: "Failed to load seminar. Please try again later.", type: "ERROR" })
    }

    /* Set up the mutation for sign-in API call */
    const mutation = useMutation((formData)=>apiClient.updateSeminar(seminar_id, formData, data.token), {
        onSuccess: async () => {
            /* Show success toast */
            showToast({ message: "Seminar Updated", type: "SUCCESS" })
            await queryClient.invalidateQueries("validateToken", { exact: true });
            /* Navigate to dashboard page */
            navigate("/dashboard");
        },
        onError: (error) => {
            /* Show error toast  */
            showToast({ message: error.message, type: "ERROR"});
            /* Set isUpdating state to false to indicate the form is not submitted */
            setIsUpdating(false);
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
        formData.append("speaker.image", data.speaker.image[0] || seminar.speaker.image);
        formData.append("speaker.linkedin", data.speaker.linkedin || "");
        formData.append("fee", data.fee);
        formData.append("slotsAvailable", data.slotsAvailable);

        /* Set isUpdating state to true to indicate the form is being submitted */
        setIsUpdating(true);

        mutation.mutate(formData);
    })

    /* Get today's date in "YYYY-MM-DD" format */
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="flex flex-col items-center mt-12">
            <h1 className="text-2xl font-bold">Edit Seminar</h1>
            <form encType="multipart/form-data" className="flex flex-col max-w-sm w-full" onSubmit={onSubmit}>
                <label htmlFor="title" className="mb-2 font-medium">Title:</label>
                <input
                    type="text"
                    id="title"
                    className="p-2 rounded border border-gray-300 ring-2 ring-black-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-red-500"
                    defaultValue={seminar.title}
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
                    defaultValue={seminar.description}
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
                    defaultValue={seminar.date ? seminar.date.split("T")[0] : ""}
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
                    defaultValue={convertTo24HourFormat(seminar.timeFrame.from)}
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
                    defaultValue={convertTo24HourFormat(seminar.timeFrame.to)}
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
                    defaultValue={seminar.venue}
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
                    defaultValue={seminar.speaker.name}
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
                    defaultValue=""
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
                    defaultValue={seminar.speaker.linkedin}
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
                    defaultValue={seminar.fee}
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
                    defaultValue={seminar.slotsAvailable}
                    {...register("slotsAvailable", { required: "*This field is required", validate: value => value >= 0 || "*Slots Available must be greater than or equal to 0" })}
                />
                {errors.slotsAvailable && (
                    <span className="text-red-500">{errors.slotsAvailable.message}</span>
                )}

                <button 
                    type="submit" 
                    className={`py-2 px-4 mt-4 rounded bg-green-500 text-white hover:bg-green-600"
                        ${isUpdating ? 'cursor-not-allowed' : ''}`}
                    disabled={isUpdating ? true : false}
                >
                    {isUpdating ? 'Updating Seminar...' : 'Update Seminar'}
                </button>
            </form>
            <button className="flex items-center px-4 py-2 mt-4 mb-4 bg-gray-700 text-white disabled:bg-gray-400" onClick={() => navigate(-1)}>
                <FaArrowLeft className="mr-2" /> Go Back
            </button>
        </div>
    );
}

export default EditSeminar

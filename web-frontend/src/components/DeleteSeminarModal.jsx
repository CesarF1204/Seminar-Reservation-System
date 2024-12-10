import React from 'react';
import * as apiClient from '../api-client';
import { useMutation, useQueryClient } from 'react-query';
import { useAppContext } from '../contexts/AppContext'; 
import { useParams, useNavigate } from 'react-router-dom';

const DeleteSeminarModal = ({ setShowDeleteModal }) => {

        /* Initialize query client to manage cache invalidation */
        const queryClient = useQueryClient();

        /* Extract showToast function from context for displaying notifications */
        const { showToast, data } = useAppContext();

        /* Get the seminar ID from the URL parameters */
        const { id: seminar_id } = useParams();

        /* Navigate to different routes */
        const navigate = useNavigate();

        /* Mutation for deleting seminar using the deleteSeminar API function */
        const mutation = useMutation(()=>apiClient.deleteSeminar(seminar_id, data.token), {
            /* On success: invalidate the token validation query and navigate to homepage */
            onSuccess: async () => {
                await queryClient.invalidateQueries("validateToken", { exact: true });
                showToast({ message: "Deleted!", type: "ERROR" });
                navigate("/dashboard");
            },
                onError: (error) => {
                showToast({ message: error.message, type: "ERROR" });
            },
        });
        
        /* Handle button click event to trigger deletion */
        const handleSeminarDelete = () => {
            mutation.mutate();
            setShowDeleteModal(false);
        };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold text-gray-800">Are you sure you want to delete this seminar?</h2>
                <div className="mt-4 flex justify-end space-x-4">
                    <button 
                        onClick={() => setShowDeleteModal(false)} 
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSeminarDelete} 
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteSeminarModal

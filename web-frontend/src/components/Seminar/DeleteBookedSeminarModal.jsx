import React from 'react';
import * as apiClient from '../../api-client';
import { useMutation, useQueryClient } from 'react-query';
import { useAppContext } from '../../contexts/AppContext'; 

const DeleteBookedSeminarModal = ({ booking, setShowDeleteModal, setPage, refetch }) => {
        /* Initialize query client to manage cache invalidation */
        const queryClient = useQueryClient();

        /* Extract showToast function from context for displaying notifications */
        const { showToast, data } = useAppContext();

        /* Mutation for deleting booked seminar using the deleteBookedSeminar API function */
        const mutation = useMutation(()=>apiClient.deleteBookedSeminar(booking._id, data.token), {
            /* On success: invalidate the token validation query */
            onSuccess: async () => {
                await queryClient.invalidateQueries("validateToken", { exact: true });
                showToast({ message: "Booked Seminar Deleted!", type: "ERROR" });
                /* Refetch to get the updated data */
                const updatedData = await refetch();
                /* Reset to page 1 if table is empty after deletion */
                if (updatedData?.data?.users?.length === 0) {
                    setPage(1);
                }
            },
                onError: (error) => {
                showToast({ message: error.message, type: "ERROR" });
            },
        });
        
        /* Handle button click event to trigger deletion */
        const handleBookedSeminarDelete = () => {
            mutation.mutate();
            setShowDeleteModal(false);
        };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold text-gray-800">Are you sure you want to delete this booked seminar?</h2>
                <div className="mt-4 flex justify-end space-x-4">
                    <button 
                        onClick={() => setShowDeleteModal(false)} 
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleBookedSeminarDelete} 
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteBookedSeminarModal

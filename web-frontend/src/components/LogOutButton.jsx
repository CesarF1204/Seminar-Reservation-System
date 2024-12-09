import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from 'react-router-dom';
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const LogOutButton = () => {
    /* Initialize query client to manage cache invalidation */
    const queryClient = useQueryClient();
    /* Extract showToast function from context for displaying notifications */
    const { showToast } = useAppContext();
    /* Navigate to different routes */
    const navigate = useNavigate();

    /* Mutation for logging out using the signOut API function */
    const mutation = useMutation(apiClient.signOut, {
        /* On success: invalidate the token validation query and navigate to homepage */
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken", { exact: true });
            showToast({ message: "Logged Out!", type: "ERROR" });
            navigate("/");
        },
            onError: (error) => {
            showToast({ message: error.message, type: "ERROR" });
        },
    });
    
    /* Handle button click event to trigger logout mutation */
    const handleClick = () => {
        mutation.mutate();
    };

    return (
        <button onClick={handleClick} className="btn btn-danger mt-3">
            Log Out
        </button>
    );
};

export default LogOutButton;
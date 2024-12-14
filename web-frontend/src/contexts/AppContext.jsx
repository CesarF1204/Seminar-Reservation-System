import React, { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

/* Create the AppContext with an initial value of undefined */
const AppContext = createContext(undefined);

const stripePromise = loadStripe(STRIPE_PUB_KEY);

export const AppContextProvider = ({ children }) => {

/* State for toast messages */
const [toast, setToast] = useState(undefined);

/* Function to show a toast message */
const showToast = (toastMessage) => {
    setToast(toastMessage);
};

/* Check if the user is logged in using a token validation query */
const { data } = useQuery("validateToken", apiClient.validateToken, {
    suspense: true, /* Enables React's Suspense mode, allowing the component to wait for data to load before rendering. */
    retry: false,
});

return (
    <AppContext.Provider
        value={{
            showToast,
            data: data || {},
            isLoggedIn: data?.userId ? true : false,
            stripePromise
        }}
    >
        {/* Render the toast component if a toast message is present */}
        {toast && (
            <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(undefined)}
            />
        )}
        {children}
    </AppContext.Provider>
    );
};

/* Custom hook to use the AppContext */
export const useAppContext = () => {
    const context = useContext(AppContext);
    return context;
};

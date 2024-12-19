const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/*
    Register function: 
    Sends a POST request to the /register endpoint with user form data to register a new account.
*/
const register = async (formData) => {
    /* Sending a POST request to the registration API */
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
};

/* 
    Sign In function:
    Sends a POST request to the /login endpoint with user credentials for authentication.
    Includes credentials in the request for session management.
*/
const signIn = async (formData) => {
    /* Sending a POST request to the login API with credentials included */
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    /* Parse the JSON response body */
    const body = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(body.message);
    }

    /* Return the response body on successful login */
    return body;
};

/* 
    validateToken function:
    Sends a GET request to the /auth/validate-token endpoint for user authentication.
*/
const validateToken = async () => {
    /* Sending a request to the validate-token API endpoint to check if the token is valid */
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials: "include",
    });
    
    /* Check if the response is not OK, return a failure message indicating the token is invalid or expired */
    if (!response.ok) {
        return { success: false, message: "Token is invalid or expired." };
    }

    return response.json();
};

/* 
    Sign Out function:
    Sends a POST request to the /logout endpoint to log the user out and invalidate their session.
*/
const signOut = async () => {
    /* Sending a POST request to the logout API endpoint to sign the user out */
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        credentials: "include",
        method: "POST",
    });

    /* Check if the response is not OK, throw an error indicating a sign-out failure */
    if (!response.ok) {
        throw new Error("Error during sign out");
    }
};

/* 
    getSeminars function:
    Sends a GET request to the /seminars endpoint to retrieve a list of all available seminars.
*/
const getSeminars = async (token, { page, limit, sortKey, sortDirection, search}) => {
    /* Params for filtering */
    const queryParams = new URLSearchParams({
        page,
        limit,
        sortKey,
        sortDirection,
        search
    }).toString();
    
    const response = await fetch(`${API_BASE_URL}/api/seminars?${queryParams}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message); // Throw an error if the response is not ok
    }

    return data;
}

/* 
    Fetch Specific Seminar:
    Sends a GET request to the /seminars/:id endpoint to retrieve an specific seminar and to fetch its details.
*/
const fetchSeminarById = async (id, token) => {
    /* Sending a GET request to fetch specific seminar */
    const response = await fetch(`${API_BASE_URL}/api/seminars/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    /* Parse the JSON response body */
    const data = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(data.message);
    }

    /* Return the data (seminar information) if the request is successful */
    return data;
};

/*
    createSeminar function: 
    Sends a POST request to the /seminars endpoint with form data to create a new seminar.
*/
const createSeminar = async (formData, token) => {
    /* Sending a POST request to seminars API */
    const response = await fetch(`${API_BASE_URL}/api/seminars`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
};

/*
    updateSeminar function: 
    Sends a PUT request to the /seminars/:id endpoint with form data to update a seminar.
*/
const updateSeminar = async (seminar_id, formData, token) => {
    /* Sending a PUT request to seminars API */
    const response = await fetch(`${API_BASE_URL}/api/seminars/${seminar_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
};

/*
    deleteSeminar function: 
    Sends a DELETE request to the /seminars/:id endpoint to delete a seminar.
*/
const deleteSeminar = async (seminar_id, token) => {
    /* Sending a DELETE request to seminars API */
    const response = await fetch(`${API_BASE_URL}/api/seminars/${seminar_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
};

/*
    fetchProfile function: 
    Sends a GET request to the /users/profile endpoint to get the user's profile details.
*/
const fetchProfile = async (token) => {
    /* Sending a GET request to users API */
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }

    /* Return the data (user's information) if the request is successful */
    return responseBody;
};

/*
    updateProfilePicture function: 
    Sends a PUT request to the /users/profile/:id endpoint with form data to update the user's profile id.
*/
const updateProfilePicture = async (user_id, formData, token) => {
    /* Sending a PUT request to users API */
    const response = await fetch(`${API_BASE_URL}/api/users/profile/${user_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
};

/*
    updateProfile function: 
    Sends a PUT request to the /users/profile endpoint with form data to update the user's profile details.
*/
const updateProfile = async (formData, token) => {
    /* Sending a PUT request to users API */
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
};

/*
    fetchUsers function: 
    Sends a GET request to the /users/profile endpoint to get the user's profile details.
*/
const fetchUsers = async (token, { page, limit, sortKey, sortDirection, search}) => {
    /* Params for filtering */
    const queryParams = new URLSearchParams({
        page,
        limit,
        sortKey,
        sortDirection,
        search
    }).toString();
    
    /* Sending a GET request to users API */
    const response = await fetch(`${API_BASE_URL}/api/users?${queryParams}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }

    /* Return the data (user's information) if the request is successful */
    return responseBody;
};

/*
    fetchUserById function: 
    Sends a GET request to the /users/profile/id/:id endpoint to get the specific user's profile details.
*/
const fetchUserById = async (user_id, token) => {
    /* Sending a GET request to users API */
    const response = await fetch(`${API_BASE_URL}/api/users/id/${user_id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }

    /* Return the data (user's information) if the request is successful */
    return responseBody;
};

/*
    updateUserById function: 
    Sends a PUT request to the /users/id/:id endpoint with form data to update the specific user's details.
*/
const updateUserById = async (user_id, formData, token) => {
    /* Sending a PUT request to users API */
    const response = await fetch(`${API_BASE_URL}/api/users/id/${user_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
};

/*
    updateRoleOrRestriction function: 
    Sends a PUT request to the /users/:id endpoint with form data to update the user's role or restriction.
*/
const updateRoleOrRestriction = async (user_id, formData, token) => {
    /* Sending a PUT request to users API */
    const response = await fetch(`${API_BASE_URL}/api/users/update_role_restriction/${user_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
};

/*
    deleteAccount function: 
    Sends a DELETE request to the /seminars/:id endpoint to delete a seminar.
*/
const deleteAccount = async (user_id, token) => {
    /* Sending a DELETE request to users API */
    const response = await fetch(`${API_BASE_URL}/api/users/${user_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
};

/*
    sendEmail function: 
    Sends a POST request to the /users/send_account_recovery endpoint to send an email.
*/
const sendEmailAccountRecovery = async (formData) => {
    /* Sending a POST request to users API */
    const response = await fetch(`${API_BASE_URL}/api/users/send_account_recovery`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
};

/* 
    resetPasswordLink function:
    Sends a GET request to the /users/reset_password/:token endpoint to validate the reset password link.
*/
const resetPasswordLink = async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/users/reset_password/${token}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    });

    const responseBody = await response.json();

    if (!response.ok) {
        throw new Error(responseBody.message); /* Throw an error if the response is not ok */
    }

    return responseBody;
}

/* 
    resetPasswordLink function:
    Sends a PUT request to the /users/reset_password endpoint to update the user's password.
*/
const resetPassword = async (formData) => {
    /* Sending a PUT request to users API */
    const response = await fetch(`${API_BASE_URL}/api/users/reset_password`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
};

/*
    createBooking function: 
    Sends a POST request to the /api/bookings endpoint to book a seminar.
*/
const createBooking = async (formData, token) => {
    /* Sending a POST request to bookings API */
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }

    return responseBody;
};

/*
    getUserBookings function: 
    Sends a GET request to the /api/bookings endpoint to fetch all booked seminar.
*/
const getUserBookings = async (token, { page, limit, sortKey, sortDirection, search}) => {
    /* Params for filtering */
    const queryParams = new URLSearchParams({
        page,
        limit,
        sortKey,
        sortDirection,
        search
    }).toString();
    
    /* Sending a GET request to fetch all booked seminars */
    const response = await fetch(`${API_BASE_URL}/api/bookings?${queryParams}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    /* Parse the JSON response body */
    const data = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(data.message);
    }

    /* Return the data (seminar information) if the request is successful */
    return data;
};

const fetchAllBookings = async (token) => {
    /* Sending a GET request to fetch all booked seminars */
    const response = await fetch(`${API_BASE_URL}/api/bookings/get_bookings`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    /* Parse the JSON response body */
    const data = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(data.message);
    }

    /* Return the data (seminar information) if the request is successful */
    return data;
};

/*
    updateBookingStatus function: 
    Sends a PUT request to the /api/bookings/:id endpoint to fetch all booked seminar.
*/
const updateBookingStatus = async (booking_id, formData, token) => {
    /* Sending a PUT request to bookings API */
    const response = await fetch(`${API_BASE_URL}/api/bookings/${booking_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }

    return responseBody;
};

/*
    deleteBookedSeminar function: 
    Sends a DELETE request to the api/bookings/:id endpoint to delete a booked seminar.
*/
const deleteBookedSeminar = async (booking_id, token) => {
    /* Sending a DELETE request to bookings API */
    const response = await fetch(`${API_BASE_URL}/api/bookings/${booking_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });

    /* Parse the JSON response body */
    const responseBody = await response.json();

    /* Check if the response is not OK, throw an error with the message from the response body */
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
};

export {
    register,
    signIn,
    signOut,
    validateToken,
    getSeminars,
    fetchSeminarById,
    createSeminar,
    updateSeminar,
    deleteSeminar,
    fetchProfile,
    updateProfilePicture,
    updateProfile,
    fetchUsers,
    updateRoleOrRestriction,
    deleteAccount,
    fetchUserById,
    updateUserById,
    sendEmailAccountRecovery,
    resetPasswordLink,
    resetPassword,
    createBooking,
    getUserBookings,
    fetchAllBookings,
    updateBookingStatus,
    deleteBookedSeminar,
};
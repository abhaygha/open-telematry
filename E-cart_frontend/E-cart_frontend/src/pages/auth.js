import axios from 'axios';
import { toast } from 'react-toastify';
// import { useNavigate } from "react-router-dom";

const API_URL = 'http://127.0.0.1:8001/api/user';

const logoutUser = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // navigate("/login", { replace: true });
    window.location.href = "/login";
    console.log("Done")
};

export const sendOTP = async (email) => {
    return await axios.post(`${API_URL}/send-otp/`, { email });
};

export const verifyOTP = async (email, otp) => {
    return await axios.post(`${API_URL}/verify-otp/`, { email, otp });
};

export const getProfile = async () => {
    try {
        const token = localStorage.getItem('access_token');
        return await axios.get(`${API_URL}/profile/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                console.error("Unauthorized: Invalid token or session expired.");
                logoutUser()
                toast.error('Session expired. Please log in again.');
            } else {
                console.error("Error:", error.response.data);
                toast.error('An error occurred.');
            }
        } else {
            console.error("Network Error:", error.message);
            toast.error("Network error. Please check your connection.");
        }
        return null;
    }
};

export const updateProfile = async (userData) => {
    try {
        const token = localStorage.getItem('access_token');
        return await axios.put(`${API_URL}/profile/`, userData, {
            headers: { Authorization: `Bearer ${token}` }
        })
    } catch (error) {
        console.log("error.response ", error.response)
        if (error.response) {
            if (error.response.status === 401) {
                console.error("Unauthorized: Invalid token or session expired.");
                logoutUser()
                toast.error('Session expired. Please log in again.');
            } else {
                console.error("Error:", error.response.data);
                toast.error('An error occurred.');
            }
        } else {
            console.error("Network Error:", error.message);
            toast.error("Network error. Please check your connection.");
        }
        return null;
    }
};

export const submitReview = async (productId, rating, comment) => {
    try {
        const token = localStorage.getItem('access_token');
        return await axios.post(
            `${API_URL}/reviews/review/${productId}/`,
            { rating, comment },
            { headers:  { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.log("error.response ", error.response)
        if (error.response) {
            if (error.response.status === 401) {
                console.error("Unauthorized: Invalid token or session expired.");
                logoutUser()
                toast.error('Session expired. Please log in again.');
            } else {
                console.error("Error:", error.response.data);
                toast.error('An error occurred.');
            }
        } else {
            console.error("Network Error:", error.message);
            toast.error("Network error. Please check your connection.");
        }
        return null;
    }
};

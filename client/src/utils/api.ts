import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000", // Adjust if backend uses a different port
    withCredentials: true, // Optional, for cookie-based auth
});

export default API;
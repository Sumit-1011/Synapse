// utils/auth.ts
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    exp: number; // expiry timestamp in seconds
    [key: string]: unknown; // for other payload fields
}

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // in seconds

        // Check if token is expired
        return decoded.exp > currentTime;
    } catch {
        return false;
    }
};

import { jwtDecode } from "jwt-decode";

type DecodedUser = {
    name: string;
    email: string;
    role: string;
    exp?: number; // optional expiration
};

export const getUserFromToken = (): DecodedUser | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedUser>(token);
        return decoded;
    } catch (error) {
        console.error("Failed to decode token", error);
        return null;
    }
};

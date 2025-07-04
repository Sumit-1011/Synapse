import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verify Token Middleware
export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ status: "error", message: "Authorization token missing!" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password"); // omit password
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ status: "error", message: "Invalid or expired token!" });
    }
};

// Verify Admin Middleware
export const verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res
            .status(403)
            .json({ status: "error", message: "Admin access required by you!" });
    }
    next();
};

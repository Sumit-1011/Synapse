import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const PublicRoute = ({ children }: { children: React.ReactElement }) => {
    return isAuthenticated() ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
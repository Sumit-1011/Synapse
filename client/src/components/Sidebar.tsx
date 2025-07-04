import React from "react";
import { getUserFromToken } from "../utils/getUser";

const Sidebar: React.FC = () => {
    const user = getUserFromToken();

    if (!user) return null; // or show loading/fallback UI

    return (
        <div className="w-64 min-h-full bg-white shadow-md p-6 flex flex-col justify-between border-r">
            <div>
                <h2 className="text-2xl font-bold mb-6 text-cyan-700">Dashboard</h2>
                <div className="space-y-2">
                    <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-base font-medium">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-base font-medium">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="text-base font-medium capitalize">{user.role}</p>
                    </div>
                </div>
            </div>

            <button className="w-full mt-6 bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition">
                Logout
            </button>
        </div>
    );
};

export default Sidebar;

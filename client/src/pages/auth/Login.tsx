import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await API.post("/api/users/login", {
                email: form.email,
                password: form.password,
            });

            if (res.data?.token) {
                localStorage.setItem("token", res.data.token);
                navigate("/");
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (err: unknown) {
            console.error(err);
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="flex h-screen w-full">
            {/* Left side */}
            <div className="w-4/6 bg-cyan-700 text-white flex flex-col items-center justify-center px-10">
                <img
                    src="/astro.svg"
                    alt="astronaut"
                    className="w-64 mb-6"
                />
                <h1 className="text-2xl font-bold">Welcome back!</h1>
                <p className="text-sm mt-2">Let's get you logged in 🚀</p>
            </div>

            {/* Right side */}
            <div className="w-2/6 flex items-center justify-center px-16">
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                    <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="Email"
                            className="pl-10 w-full border rounded px-3 py-2 focus:outline-cyan-500"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="pl-10 pr-10 w-full border rounded px-3 py-2 focus:outline-cyan-500"
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 cursor-pointer text-gray-400"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                    </div>

                    {/* Error message */}
                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded">
                        Login
                    </button>

                    <p className="text-center text-sm mt-4">
                        Don't have an account?{" "}
                        <a href="/register" className="text-cyan-600 underline">
                            Register here
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;

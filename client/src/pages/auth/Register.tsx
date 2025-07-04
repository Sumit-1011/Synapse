import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");


    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,12}$/;

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordRegex.test(form.password)) {
            setPasswordError(
                "Password must be 6-12 characters long and include letters, numbers, and symbols."
            );
            return;
        } else {
            setPasswordError(""); // Clear previous errors
        }

        if (form.password !== form.confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        try {
            const res = await API.post("/api/users/register", {
                name: form.name,
                email: form.email,
                password: form.password,
            });
            localStorage.setItem("token", res.data.token);
            navigate("/");
        } catch (err: unknown) {
            console.error(err);
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
                <h1 className="text-2xl font-bold">Welcome aboard my friend</h1>
                <p className="text-sm mt-2">just a couple of clicks and we start</p>
            </div>

            {/* Right side */}
            <div className="w-2/6 flex items-center justify-center px-16">
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                    <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>

                    {/* Name */}
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            type="text"
                            placeholder="Name"
                            className="pl-10 w-full border rounded px-3 py-2 focus:outline-cyan-500"
                            required
                        />
                    </div>

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
                        {passwordError && (
                            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                        )}

                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 cursor-pointer text-gray-400"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className="pl-10 pr-10 w-full border rounded px-3 py-2 focus:outline-cyan-500"
                            required
                        />
                    </div>

                    <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded">
                        Register
                    </button>

                    <p className="text-center text-sm mt-4">
                        Have an account?{" "}
                        <a href="/login" className="text-cyan-600 underline">
                            Log in
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;

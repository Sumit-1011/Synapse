import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUserFromToken } from "../utils/getUser";

const cities = ["Delhi", "Mumbai", "Dubai", "Kolkata", "Bangalore"];

type WeatherData = {
    temp: number;
    description: string;
    icon: string;
    city: string;
};

type ForecastData = {
    dt_txt: string;
    main: {
        temp: number;
    };
    weather: {
        icon: string;
        description: string;
    }[];
};

const Sidebar: React.FC = () => {
    const user = getUserFromToken();
    const [selectedCity, setSelectedCity] = useState("Delhi");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData[]>([]);

    useEffect(() => {
        const fetchWeatherData = async () => {
            const API_KEY = "9eae3e3cfa966f9954a3ab89159d4eaf";

            try {
                // Fetch current weather
                const res = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=metric&appid=${API_KEY}`
                );

                const { main, weather, name } = res.data;
                setWeather({
                    temp: main.temp,
                    description: weather[0].description,
                    icon: `https://openweathermap.org/img/wn/${weather[0].icon}.png`,
                    city: name,
                });

                // Fetch 5-day forecast (every 3 hours)
                const forecastRes = await axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&units=metric&appid=${API_KEY}`
                );

                // Pick one forecast per day around 12:00 PM
                const dailyForecast = (forecastRes.data.list as ForecastData[]).filter((item: ForecastData) =>
                    item.dt_txt.includes("12:00:00")
                );

                setForecast(dailyForecast.slice(0, 5));
            } catch (error) {
                console.error("Weather fetch error:", error);
            }
        };

        fetchWeatherData();
    }, [selectedCity]);

    if (!user) return null;

    return (
        <div className="w-64 min-h-full bg-white shadow-md p-6 flex flex-col justify-between border-r overflow-y-auto">
            <div>
                <h2 className="text-2xl font-bold mb-6 text-cyan-700">Dashboard</h2>

                <div className="space-y-2 mb-6">
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

                {/* City Selector */}
                <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full mb-4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                    {cities.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>

                {/* Current Weather */}
                {weather && (
                    <div className="bg-cyan-50 rounded-lg p-4 mb-4 flex items-center space-x-3 shadow-sm">
                        <img src={weather.icon} alt="weather icon" className="w-10 h-10" />
                        <div>
                            <p className="text-sm font-semibold">{weather.city}</p>
                            <p className="text-sm text-gray-600 capitalize">{weather.description}</p>
                            <p className="text-lg font-bold">{weather.temp}°C</p>
                        </div>
                    </div>
                )}

                {/* 5-Day Forecast */}
                {forecast.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">5-Day Forecast</h3>
                        <div className="flex space-x-3 overflow-x-auto scrollbar-thin scrollbar-thumb-cyan-400">
                            {forecast.map((day, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 p-3 rounded-lg min-w-[100px] text-center flex-shrink-0"
                                >
                                    <p className="text-sm font-semibold">
                                        {new Date(day.dt_txt).toLocaleDateString("en-US", {
                                            weekday: "short",
                                        })}
                                    </p>
                                    <img
                                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                                        alt="icon"
                                        className="mx-auto w-8 h-8"
                                    />
                                    <p className="text-sm">{Math.round(day.main.temp)}°C</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <button className="w-full mt-6 bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition">
                Logout
            </button>
        </div>
    );
};

export default Sidebar;

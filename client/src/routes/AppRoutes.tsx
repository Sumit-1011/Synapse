import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoutes";
import PublicRoute from "../components/PublicRoute";

const App = () => {
        const publicRoutes = [
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
        ];
        
          const protectedRoutes = [
            { path: "/", element: <Dashboard /> },
        
        ];
        
    return (
        <Routes>
            {publicRoutes.map(({ path, element }) => (
                <Route
                    key={path}
                    path={path}
                    element={<PublicRoute>{element}</PublicRoute>}
                />
            ))}

            {protectedRoutes.map(({ path, element }) => (
                <Route
                    key={path}
                    path={path}
                    element={<ProtectedRoute>{element}</ProtectedRoute>}
                />
            ))}
        </Routes>
    );
}

export default App;

import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;

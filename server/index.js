import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToMongoDB } from './config/database.js'; 
import protectedRoutes from './routes/protected.js';
import userRoute from './routes/userRoute.js';
import taskRoute from './routes/taskRoute.js';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: [
            "http://localhost:5173",
        ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/protected", protectedRoutes);
app.use("/api/users", userRoute);
app.use("/api/tasks", taskRoute);

async function startServer() {
    try {
        await connectToMongoDB();
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1); // Exit the process with failure code
    }
}

startServer();


  
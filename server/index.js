import dotenv from "dotenv";
import express from "express";
import connectDb from "./config/dbConnection.js";
import authRoutes from "./routes/authroutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import cors from "cors";

const app = express();

// Middleware to parse JSON
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // your React app
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

dotenv.config();
connectDb();
const port = process.env.PORT || 5001;
//middleware
app.use(express.json());

// Auth routes /api/auth
app.use("/api/auth", authRoutes);

// Problem routes /api/problems
app.use("/api/problems", problemRoutes);

//Dashboard routes /api/dashboard
app.use("/api/dashboard", dashboardRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

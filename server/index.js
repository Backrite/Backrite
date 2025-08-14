import dotenv from 'dotenv';
import express from 'express';
import connectDb from "./config/dbConnection.js";
import authRoutes from "./routes/authroutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
connectDb();
const app = express();
const port = process.env.PORT  || 5001;

//middleware
app.use(express.json());

// Auth routes /api/auth
app.use("/api/auth",authRoutes);

// Problem routes /api/problems
app.use("/api/problems", problemRoutes);

//Dashboard routes /api/dashboard
app.use("/api/dashboard", dashboardRoutes);

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
})

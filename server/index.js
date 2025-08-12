import dotenv from 'dotenv';
import express from 'express';
import connectDb from "./config/dbConnection.js";
import authRoutes from "./routes/authroutes.js";
import problemRoutes from "./routes/problemRoutes.js"

dotenv.config();
connectDb();
const app = express();
const port = process.env.PORT  || 5001;

//middleware
app.use(express.json());

// Auth routes with prefix /api/auth
app.use("/api/auth",authRoutes);

// Problem routes with prefix /api/problems
app.use("/api/problems", problemRoutes);

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
})

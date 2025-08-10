import dotenv from 'dotenv';
import express from 'express';
import connectDb from "./config/dbConnection.js";
import authRoutes from "./routes/authroutes.js";

dotenv.config();
connectDb();
const app = express();
const port = process.env.PORT  || 5001;

//middleware
app.use(express.json());

app.use("/api/auth",authRoutes);

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
})

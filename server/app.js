import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/authroutes.js";
import problemRouter from "./routes/problem.routes.js"; // ✅ new

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/user", userRouter);
//problems endpoints
app.use("/problems", problemRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Backrite backend is running!");
});

export default app;

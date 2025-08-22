import fs from "fs";
import { exec } from "child_process";
import dotenv from "dotenv";
import express from "express";
import connectDb from "./config/dbConnection.js";
import authRoutes from "./routes/authroutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDb();

const app = express();

// --------------------
// ES Module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --------------------

// Middleware to parse JSON
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Dynamic Docker run route
app.post("/api/run", async (req, res) => {
  try {
    const { code, tests } = req.body;

    if (!code || !tests) {
      return res.status(400).json({ error: "Code and tests are required" });
    }

    // 1️⃣ Create a temporary folder for this run
    const runId = Date.now();
    const runFolder = path.join(__dirname, `temp_${runId}`);
    fs.mkdirSync(runFolder);

    // 2️⃣ Write code and tests into temp folder
    fs.writeFileSync(path.join(runFolder, "solution.js"), code, "utf-8");
    fs.writeFileSync(
      path.join(runFolder, "tests.json"),
      JSON.stringify(tests),
      "utf-8"
    );

    // 3️⃣ Run Docker container with mounted folder
    const cmd = `docker run --rm -v "${runFolder}:/app" backrite-runner`;

    exec(cmd, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      // Clean up temp folder after execution
      fs.rmSync(runFolder, { recursive: true, force: true });

      if (error) {
        console.error("Docker exec error:", error.message);
        return res.status(500).json({ error: error.message });
      }

      if (stderr) console.warn("Docker stderr:", stderr);

      try {
        const results = JSON.parse(stdout);
        res.json({ results });
      } catch (e) {
        res
          .status(500)
          .json({ error: "Failed to parse Docker output", raw: stdout });
      }
    });
  } catch (err) {
    console.error("Run route error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.use(errorHandler);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

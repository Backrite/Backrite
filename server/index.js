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
import bodyParser from "body-parser";

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
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(bodyParser.json());
import { spawn } from "child_process";

app.post("/api/run", async (req, res) => {
  try {
    const { code, tests } = req.body;
    if (!code || !tests) {
      return res.status(400).json({ error: "Code and tests are required" });
    }

    // console.log(code);
    // console.log(tests);

    // Base64 encode user code + tests
    const codeB64 = Buffer.from(code).toString("base64");
    const testsB64 = Buffer.from(JSON.stringify(tests)).toString("base64");

    // console.log("Encoded CODE:", codeB64.slice(0, 50) + "...");

    const child = spawn(
      "docker",
      [
        "run",
        "--rm",
        "-e",
        `CODE=${codeB64}`,
        "-e",
        `TESTS=${testsB64}`,
        "backrite-runner",
      ],
      { shell: true }
    );

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      console.log("DOCKER STDOUT:", data.toString()); // ✅ debug log
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code !== 0) {
        console.error("Docker failed:", stderr);
        return res
          .status(500)
          .json({ error: "Execution failed", details: stderr });
      }

      try {
        const jsonStartIndex = stdout.indexOf("[");
        const jsonPart = stdout.slice(jsonStartIndex);

        const parsedResults = JSON.parse(jsonPart);

        return res.json({ results: parsedResults });
      } catch (e) {
        return res
          .status(500)
          .json({ error: "Invalid container output", raw: stdout });
      }
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server crashed", details: err.message });
  }
});

app.use(errorHandler);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

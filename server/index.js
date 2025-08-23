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
app.use(bodyParser.json());
// import { spawn } from "child_process";

// app.post("/api/run", async (req, res) => {
//   try {
//     const { code, tests } = req.body;
//     if (!code || !tests) {
//       return res.status(400).json({ error: "Code and tests are required" });
//     }

//     const runFolder = path.join(process.cwd(), `temp_${Date.now()}`);
//     fs.mkdirSync(runFolder);

//     fs.writeFileSync(path.join(runFolder, "solution.js"), code);
//     fs.writeFileSync(path.join(runFolder, "tests.json"), JSON.stringify(tests));

//     const runFolderDocker = runFolder.replace(/\\/g, "/");

//     const child = spawn("docker", [
//       "run",
//       // "--rm",
//       "-v",
//       `${runFolderDocker}:/app`,
//       "backrite-runner"
//     ], { shell: true });
//     console.log(child.stdout.data)
//     let stdout = "";
//     let stderr = "";

//     child.stdout.on("data", (data) => {
//   console.log("DOCKER STDOUT:", data.toString()); // ✅ debug log
//   stdout += data.toString();
// });

//     child.stderr.on("data", (data) => {
//       stderr += data.toString();
//     });

//     child.on("close", (code) => {
//       if (code !== 0) {
//         console.error("Docker failed:", stderr);
//         return res.status(500).json({ error: "Execution failed", details: stderr });
//       }

//       try {
//         const result = JSON.parse(stdout);
//         return res.json({ results: result });
//       } catch (e) {
//         return res.status(500).json({ error: "Invalid container output", raw: stdout });
//       }
//     });

//   } catch (err) {
//     console.error("Server error:", err);
//     res.status(500).json({ error: "Server crashed", details: err.message });
//   }
// });



import http from "http";
app.use(express.json());

// 🔹 helper for talking to Docker API
function dockerRequest(method, urlPath, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      host: "localhost",
      port: 2375, // Docker Remote API (make sure dockerd is running with -H tcp://0.0.0.0:2375)
      path: urlPath,
      method,
      headers: { "Content-Type": "application/json" },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });

    req.on("error", (err) => reject(err));

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ✅ Test basic version endpoint
const options = {
  host: "localhost",
  port: 2375,
  path: "/version",
  method: "GET",
};

const testReq = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => console.log("Docker Version Response:", data));
});
testReq.on("error", (err) => console.error("Error:", err));
testReq.end();

// ✅ Run user code inside container
app.post("/api/run", async (req, res) => {
  try {
    const { code, tests } = req.body;
    const runFolder = path.join(process.cwd(), `temp_${Date.now()}`);
    fs.mkdirSync(runFolder);
    fs.writeFileSync(path.join(runFolder, "solution.js"), code);
    fs.writeFileSync(path.join(runFolder, "tests.json"), JSON.stringify(tests));

    // 1. Create container
    const createRes = await dockerRequest("POST", "/containers/create", {
      Image: "backrite-runner",
      Cmd: ["node", "index.js"],
      HostConfig: {
        Binds: [`${runFolder}:/app`],
      },
    });
    const containerId = JSON.parse(createRes).Id;

    // 2. Start container
    await dockerRequest("POST", `/containers/${containerId}/start`);

    // 3. Get logs
    const logs = await dockerRequest(
      "GET",
      `/containers/${containerId}/logs?stdout=true&stderr=true`
    );

    // 4. Remove container
    await dockerRequest("DELETE", `/containers/${containerId}?force=true`);

    res.json({ results: logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



app.use(errorHandler);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

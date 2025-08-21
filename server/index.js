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
import { spawn } from "child_process";

dotenv.config();
connectDb();

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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/dashboard", dashboardRoutes);

import Docker from "dockerode";

const docker = new Docker({
  host: "localhost", // Docker Desktop listens here
  port: 2375, // enable this port in Docker Desktop settings
});
// On Windows Docker Desktop use:
// const docker = new Docker({ socketPath: '//./pipe/docker_engine' });

// app.post("/api/run", async (req, res) => {
//   try {
//     const { code } = req.body;
//     // const tempDir = path.join(process.cwd(), "temp");
//     // const filePath = path.join(tempDir, "main.js");

//     // Ensure temp dir exists
//     // if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

//     // Save code to file
//     // fs.writeFileSync(filePath, code);

//     const image = "code-editor";
//     exec(`docker run -e code=${code} ${image}`, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error: ${error.message}`);
//         return;
//       }
//       if (stderr) {
//         console.error(`Stderr: ${stderr}`);
//         return;
//       }
//       console.log(`Output:\n${stdout}`);
//     });

//     // // Create container
//     // const container = await docker.createContainer({
//     //   Image: "node:18", // official Node.js Docker image
//     //   Cmd: ["node", "/usr/src/app/main.js"],
//     //   HostConfig: {
//     //     Binds: [`${tempDir}:/usr/src/app`], // mount your temp dir into container
//     //   },
//     // });

//     // // Start container
//     // await container.start();

//     // // Collect logs
//     // const logs = await container.logs({
//     //   stdout: true,
//     //   stderr: true,
//     //   follow: true,
//     // });

//     // let output = "";
//     // logs.on("data", (chunk) => {
//     //   output += chunk.toString();
//     // });

//     // logs.on("end", async () => {
//     //   await container.remove({ force: true }); // cleanup
//     //   res.json({ output: output.trim() });
//     // });
//     return res.json(200);
//   } catch (err) {
//     console.error("❌ Dockerode error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

app.post("/api/run", async (req, res) => {
  try {
    const { code } = req.body;
    const safeCode = code.replace(/(["`$\\])/g, "\\$1");
    console.log("Running code:", safeCode);
    const cmd = `docker run --rm -e code="${safeCode}" code-editor`;
    const testcase = " Hello Aryan from Docker!";
    exec(cmd, (error, stdout, stderr) => {
      if (error) return console.error("Error:", error.message);
      if (stderr) console.warn("Stderr:", stderr);
      console.log("Output:", stdout);
      console.log(stdout == testcase ? "Test passed!" : "Test failed!");
    });

    // const image = "code-editor";
    // exec(`docker run -e code=${code} ${image}`, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`Error: ${error.message}`);
    //     return;
    //   }
    //   if (stderr) {
    //     console.error(`Stderr: ${stderr}`);
    //     return;
    //   }
    //   console.log(`Output:\n${stdout}`);
    // });

    return res.json(200);
  } catch (err) {
    console.error("❌ Dockerode error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.use(errorHandler);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

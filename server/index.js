// import fs from "fs";
// import { exec } from "child_process";
// import dotenv from "dotenv";
// import express from "express";
// import connectDb from "./config/dbConnection.js";
// import authRoutes from "./routes/authroutes.js";
// import problemRoutes from "./routes/problemRoutes.js";
// import dashboardRoutes from "./routes/dashboardRoutes.js";
// import feedbackRoute from "./routes/feedback.js";
// import submitRoutes from "./routes/submitRoutes.js";
// import cors from "cors";
// import errorHandler from "./middleware/errorHandler.js";
// import path from "path";
// import { fileURLToPath } from "url";
// import bodyParser from "body-parser";

// dotenv.config();
// connectDb();

// const app = express();

// // --------------------
// // ES Module __dirname fix
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// // --------------------

// // Middleware to parse JSON
// app.use(express.json());
// app.use(express.static("public"));

// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/problems", problemRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/submit", submitRoutes);
// app.use("/api/send-feedback", feedbackRoute);
// app.use(bodyParser.json());



// app.get("/", (req, res) => {
//   res.render();
// });




// import { spawn } from "child_process";

// app.post("/api/run", async (req, res) => {
//   try {
//     const { code, tests } = req.body;
//     if (!code || !tests) {
//       return res.status(400).json({ error: "Code and tests are required" });
//     }

//     // console.log(code);
//     // console.log(tests);

//     // Base64 encode user code + tests
//     const codeB64 = Buffer.from(code).toString("base64");
//     const testsB64 = Buffer.from(JSON.stringify(tests)).toString("base64");

//     // console.log("Encoded CODE:", codeB64.slice(0, 50) + "...");

//     const child = spawn(
//       "docker",
//       [
//         "run",
//         "--rm",
//         "-e",
//         `CODE=${codeB64}`,
//         "-e",
//         `TESTS=${testsB64}`,
//         "backrite-runner",
//       ],
//       { shell: true }
//     );

//     let stdout = "";
//     let stderr = "";

//     child.stdout.on("data", (data) => {
//       console.log("DOCKER STDOUT:", data.toString()); // ✅ debug log
//       stdout += data.toString();
//     });

//     child.stderr.on("data", (data) => {
//       stderr += data.toString();
//     });

//     child.on("close", (code) => {
//       if (code !== 0) {
//         console.error("Docker failed:", stderr);
//         return res
//           .status(500)
//           .json({ error: "Execution failed", details: stderr });
//       }

//       try {
//         const jsonStartIndex = stdout.indexOf("[");
//         const jsonPart = stdout.slice(jsonStartIndex);

//         const parsedResults = JSON.parse(jsonPart);

//         return res.json({ results: parsedResults });
//       } catch (e) {
//         return res
//           .status(500)
//           .json({ error: "Invalid container output", raw: stdout });
//       }
//     });
//   } catch (err) {
//     console.error("Server error:", err);
//     res.status(500).json({ error: "Server crashed", details: err.message });
//   }
// });

// app.use(errorHandler);



//   const port = process.env.PORT || 5001;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// import fs from "fs";
import dotenv from "dotenv";
import express from "express";
import connectDb from "./config/dbConnection.js";
import authRoutes from "./routes/authroutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import feedbackRoute from "./routes/feedback.js";
import submitRoutes from "./routes/submitRoutes.js";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import bodyParser from "body-parser";
import {
  RunTaskCommand,
  ECSClient,
  DescribeTasksCommand,
} from "@aws-sdk/client-ecs";
import {
  CloudWatchLogsClient,
  GetLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";
dotenv.config();
connectDb();

const app = express();

// // --------------------
// // ES Module __dirname fix
// const __filename = fileURLToPath(import.meta.url);
// const _dirname = path.dirname(_filename);
// // --------------------

// Middleware to parse JSON
app.use(express.json());
app.use(express.static("public"));

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
app.use("/api/submit", submitRoutes);
app.use("/api/send-feedback", feedbackRoute);
app.use(bodyParser.json());
import { spawn } from "child_process";

const ecsClient = new ECSClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const logsClient = new CloudWatchLogsClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

import { DescribeLogStreamsCommand } from "@aws-sdk/client-cloudwatch-logs";

async function waitForLogStream(
  logGroupName,
  logStreamName,
  logsClient,
  timeout = 30000
) {
  const startTime = Date.now();
  while (true) {
    const resp = await logsClient.send(
      new DescribeLogStreamsCommand({
        logGroupName,
        logStreamNamePrefix: logStreamName,
      })
    );

    const found = resp.logStreams.find(
      (ls) => ls.logStreamName === logStreamName
    );
    if (found) return;

    if (Date.now() - startTime > timeout) {
      throw new Error("Timeout waiting for log stream to be created");
    }

    await new Promise((r) => setTimeout(r, 1000)); // wait 1 sec
  }
}

app.post("/api/run", async (req, res) => {
  try {
    const { code, tests } = req.body;
    if (!code || !tests) {
      return res.status(400).json({ error: "Code and tests are required" });
    }

    const codeB64 = Buffer.from(code).toString("base64");
    const testsB64 = Buffer.from(JSON.stringify(tests)).toString("base64");

    // 1️⃣ Run ECS Task
    const runTaskCommand = new RunTaskCommand({
      cluster:
        "arn:aws:ecs:ap-south-1:211125305105:cluster/ideal-flamingo-p8ogwo",
      taskDefinition: "backrite-taskdefinitions",
      launchType: "FARGATE",
      networkConfiguration: {
        awsvpcConfiguration: {
          securityGroups: ["sg-0805d984f9b76fe15"],
          subnets: [
            "subnet-011e5393cd4c9c625",
            "subnet-09c2c7d8e19c995a2",
            "subnet-02dd0c9384482e3df",
          ],
          assignPublicIp: "ENABLED",
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: "backrite-repo",
            environment: [
              { name: "CODE", value: codeB64 },
              { name: "TESTS", value: testsB64 },
            ],
          },
        ],
      },
    });

    const runResp = await ecsClient.send(runTaskCommand);
    const taskArn = runResp.tasks[0].taskArn;
    const taskId = taskArn.split("/").pop();
    const logStreamName = `ecs/backrite-repo/${taskId}`;

    await waitForLogStream(
      "/ecs/backrite-taskdefinitions",
      logStreamName,
      logsClient
    );

    // 2️⃣ Poll logs until task finishes
    let nextToken;
    let stdout = "";
    let stderr = "";
    let finished = false;

    while (!finished) {
      // Fetch logs
      const logsResp = await logsClient.send(
        new GetLogEventsCommand({
          logGroupName: "/ecs/backrite-taskdefinitions",
          logStreamName,
          startFromHead: true,
          nextToken,
        })
      );

      logsResp.events.forEach((e) => {
        stdout += e.message + "\n"; // accumulate log lines
      });
      nextToken = logsResp.nextForwardToken;

      // Check if task stopped
      const describeResp = await ecsClient.send(
        new DescribeTasksCommand({
          cluster:
            "arn:aws:ecs:ap-south-1:211125305105:cluster/ideal-flamingo-p8ogwo",
          tasks: [taskArn],
        })
      );

      const lastStatus = describeResp.tasks[0].lastStatus;
      if (lastStatus === "STOPPED") finished = true;
      else await new Promise((r) => setTimeout(r, 2000)); // wait 2 sec
    }

    // 3️⃣ Parse output if container prints JSON
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



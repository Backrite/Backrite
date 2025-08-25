const fs = require("fs");
const { spawn } = require("child_process");
const request = require("postman-request");
const http = require("http");

// Read user code and tests
// Handle both raw and Base64 env vars
let code = process.env.CODE;
let testsRaw = process.env.TESTS;

if (process.env.CODE) {
  try {
    code = Buffer.from(process.env.CODE, "base64").toString("utf8");
  } catch (e) {
    console.error("Failed to decode CODE:", e.message);
    process.exit(1);
  }
}

if (process.env.TESTS) {
  try {
    testsRaw = Buffer.from(process.env.TESTS, "base64").toString("utf8");
  } catch (e) {
    console.error("Failed to decode TESTS:", e.message);
    process.exit(1);
  }
}

let testCases;
try {
  testCases = JSON.parse(testsRaw);
} catch (e) {
  console.error("Invalid TESTS JSON:", e.message);
  process.exit(1);
}

// ✅ Write the solution file for execution
fs.writeFileSync("solution.js", code);

// Spawn user code server
const child = spawn("node", ["solution.js"], {
  stdio: ["ignore", "pipe", "pipe"],
});

child.stdout.on("data", (data) => process.stdout.write(data));
child.stderr.on("data", (data) => process.stderr.write(data));

child.on("exit", (code) => {
  if (code !== 0) {
    console.error(`Child process exited with code ${code}`);
  }
});

// Wait until server is ready
function waitForServer(url, retries = 20, delay = 500) {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      http
        .get(url, () => resolve())
        .on("error", (e) => {
          if (retries === 0) return reject(e);
          retries--;
          setTimeout(attempt, delay);
        });
    };
    attempt();
  });
}

function normalize(value) {
  return typeof value === "object"
    ? JSON.stringify(value, Object.keys(value).sort())
    : String(value);
}

// Run test cases
async function runTests() {
  try {
    const results = [];
    const defaultUrl = "http://localhost:3000/";

    await waitForServer(defaultUrl);

    for (let i = 0; i < testCases.length; i++) {
      const test = testCases[i];

      const options = {
        url: test.url || defaultUrl,
        method: test.method || "GET",
        body: test.body || undefined,
        json: test.body ? true : undefined,
        timeout: 5000,
      };

      await new Promise((resolve) => {
        request(options, (err, res, body) => {
          if (err) {
            results.push({
              index: i + 1,
              passed: false,
              error: err.message,
              expected: test.expected,
              actual: null,
            });
            return resolve();
          }

          const actual = normalize(body);
          const expected = normalize(test.expected);
          const passed = actual === expected;

          results.push({
            index: i + 1,
            passed,
            expected: test.expected,
            actual: body,
          });

          resolve();
        });
      });
    }

    console.log(JSON.stringify(results, null, 2));
  } catch (e) {
    console.error("Error running tests:", e.message);
  } finally {
    child.kill();
    process.exit(0);
  }
}

runTests();

const fs = require("fs");
const { spawn } = require("child_process");
const request = require("postman-request");
const http = require("http");

// Read user code and tests from mounted folder
const code = fs.readFileSync("/app/solution.js", "utf-8");
const testsRaw = fs.readFileSync("/app/tests.json", "utf-8");

// Write code to temporary solution.js inside container
fs.writeFileSync("solution.js", code);

// Parse test cases
let testCases;
try {
  testCases = JSON.parse(testsRaw);
} catch (e) {
  console.error("Invalid TESTS JSON:", e.message);
  process.exit(1);
}

// Spawn user code server
const child = spawn("node", ["solution.js"], {
  stdio: ["ignore", "pipe", "pipe"],
});

child.stdout.on("data", (data) => process.stdout.write(data));
child.stderr.on("data", (data) => process.stderr.write(data));

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
        json: test.body ? true : undefined, // send JSON if body provided
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

          // Normalize response
          let actual = body;
          if (typeof body === "object") {
            actual = JSON.stringify(body);
          }

          // Normalize expected
          let expected = test.expected;
          if (typeof expected === "object") {
            expected = JSON.stringify(expected);
          }

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
     child.kill();
    process.exit(0);
  } catch (e) {
    console.error("Error running tests:", e.message);
  } finally {
    child.kill();
    process.exit(0);
  }
}

runTests();

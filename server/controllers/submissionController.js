import User from "../models/User.js";
import Submission from "../models/Submission.js";

export const submitSolution = async (req, res) => {
  try {
    const { problemId, code, testResults, timeSpent } = req.body;
    const userId = req.user.id;

    if (!problemId || !code || !testResults) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Determine if all test cases passed
    const allPassed = testResults.every((tr) => tr.passed);

    // Create submission record
    const submission = await Submission.create({
      user: userId,
      problem: problemId,
      code,
      status: allPassed ? "passed" : "failed",
      testResults,
      timeSpent,
      submittedAt: new Date(),
    });

    // Update user model
    const user = await User.findById(userId);

    if (allPassed) {
      // Add to solvedProblems if not already
      if (!user.solvedProblems.includes(problemId)) {
        user.solvedProblems.push(problemId);
      }
      // Remove from attemptedProblems if it exists
      user.attemptedProblems = user.attemptedProblems.filter(
        (pid) => pid.toString() !== problemId
      );
    } else {
      // Only add to attemptedProblems if not already solved or attempted
      if (
        !user.solvedProblems.includes(problemId) &&
        !user.attemptedProblems.includes(problemId)
      ) {
        user.attemptedProblems.push(problemId);
      }
    }

    await user.save();

    res.status(200).json({
      message: "Submission recorded",
      submission,
    });
  } catch (error) {
    console.error("Submit endpoint error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

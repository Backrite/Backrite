// controllers/problem.controller.js
import Problem from "../models/Problem.js";

// @desc    Get all problems (hide test cases)
// @route   GET /problems
export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}, { testCases: 0 }).sort({
      createdAt: -1,
    });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching problems" });
  }
};

// @desc    Get single problem by slug (hide test cases)
// @route   GET /problems/:slug
export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(
      req.params.id, // get id from URL params
      { testCases: 0 } // exclude testCases
    );

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching problem" });
  }
};

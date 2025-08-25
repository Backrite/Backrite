// controllers/problem.controller.js
import Problem from "../models/Problem.js";

// @desc    Get all problems (hide test cases)
// @route   GET /problems
export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}).sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching problems" });
  }
};

// GET /problems/:slug
export const getProblemBySlug = async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching problem" });
  }
};

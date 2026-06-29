// controllers/problem.controller.js
import Problem from "../models/Problem.js";
import User from "../models/User.js";

// @desc    Get all problems (hide test cases)
// @route   GET /problems
export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}).sort({ _id: 1 });
    
    // Check user's completed problems
    const userId = req.user.id;
    const user = await User.findById(userId);
    const solvedIds = new Set(user?.solvedProblems?.map(id => id.toString()) || []);

    const problemsWithStatus = problems.map(problem => {
      const pObj = problem.toObject();
      return {
        ...pObj,
        completed: solvedIds.has(pObj._id.toString())
      };
    });

    res.json(problemsWithStatus);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching problems" });
  }
};

// @desc    Get single problem by slug
// @route   GET /problems/:slug
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

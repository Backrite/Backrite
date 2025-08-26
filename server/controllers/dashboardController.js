import User from "../models/User.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id; // set by your validateToken middleware
    console.log(userId);

    const user = await User.findById(userId)
      .populate("solvedProblems", "difficulty")
      .populate("attemptedProblems", "difficulty");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Totals
    const totalSolved = user.solvedProblems.length;
    const totalAttempted = user.attemptedProblems.length;

    // Breakdown by difficulty
    const difficultyStats = { Easy: 0, Medium: 0, Hard: 0 };
    user.solvedProblems.forEach((p) => {
      difficultyStats[p.difficulty]++;
    });

    res.status(200).json({
      username: user.username,
      totalSolved,
      totalAttempted,
      difficultyStats,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

import User from "../models/User.js";
import Submission from "../models/Submission.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id; // set by your validateToken middleware

    const user = await User.findById(userId)
      .populate("solvedProblems", "difficulty")
      .populate("attemptedProblems", "difficulty");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all successful submissions
    const submissions = await Submission.find({ user: userId, status: "passed" }).sort({ submittedAt: 1 });

    // Extract unique dates as YYYY-MM-DD in local/UTC date format
    const solvedDates = [...new Set(submissions.map(sub => {
      const d = new Date(sub.submittedAt);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }))];

    // Calculate active daily streak
    let streak = 0;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    const hasSubmissionToday = solvedDates.includes(todayStr);
    const hasSubmissionYesterday = solvedDates.includes(yesterdayStr);

    if (hasSubmissionToday || hasSubmissionYesterday) {
      let currentCheck = hasSubmissionToday ? today : yesterday;
      while (true) {
        const checkStr = `${currentCheck.getFullYear()}-${String(currentCheck.getMonth() + 1).padStart(2, '0')}-${String(currentCheck.getDate()).padStart(2, '0')}`;
        if (solvedDates.includes(checkStr)) {
          streak++;
          currentCheck.setDate(currentCheck.getDate() - 1);
        } else {
          break;
        }
      }
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
      streak,
      solvedDates,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

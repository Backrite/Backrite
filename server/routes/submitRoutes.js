import express from "express";
import { submitSolution, getSubmissions, getAllUserSubmissions } from "../controllers/submissionController.js";
import validateToken from "../middleware/validateToken.js"; // make sure path is correct

const router = express.Router();

// Submit a solution
router.post("/", validateToken, submitSolution);

// Get all submissions of the logged-in user
router.get("/", validateToken, getAllUserSubmissions);

// Get submissions for a specific problem
router.get("/:problemId", validateToken, getSubmissions);

export default router;

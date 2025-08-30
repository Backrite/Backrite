import express from "express";
import { submitSolution } from "../controllers/submissionController.js";
import validateToken from "../middleware/validateToken.js"; // make sure path is correct

const router = express.Router();

// Create new account
router.post("/", validateToken, submitSolution);

export default router;

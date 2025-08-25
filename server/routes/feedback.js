import express from "express";
import { feedbackgenerator } from "../controllers/FeedbackController.js";
import validateToken from "../middleware/validateToken.js"; // make sure path is correct

const router = express.Router();

// Create new account
router.post("/", feedbackgenerator);

export default router;

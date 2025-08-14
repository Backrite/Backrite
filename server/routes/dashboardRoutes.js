import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import  validateToken  from "../middleware/validateToken.js";

const router = express.Router();

// GET /api/dashboard
router.get("/", validateToken, getDashboard);

export default router;

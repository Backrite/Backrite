import express from "express";
import {
  getAllProblems,
  getProblemBySlug,
} from "../controllers/problemController.js";
import validateToken from "../middleware/validateToken.js";

const router = express.Router();

// GET /problems - fetch all problems
router.get("/",validateToken, getAllProblems);

router.get("/:slug",validateToken, getProblemBySlug);

export default router;

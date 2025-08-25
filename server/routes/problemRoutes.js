import express from "express";
import {
  getAllProblems,
  getProblemBySlug,
} from "../controllers/problemController.js";

const router = express.Router();

// GET /problems - fetch all problems
router.get("/", getAllProblems);

router.get("/:slug", getProblemBySlug);

export default router;

import express from "express";
import {
  getAllProblems,
  getProblemById,
} from "../controllers/problemController.js";

const router = express.Router();

// GET /problems - fetch all problems
router.get("/", getAllProblems);

// GET /problems/:slug - fetch a single problem
router.get("/:id", getProblemById);

export default router;

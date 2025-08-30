import express from "express";
import { registerAccount, getAccount, loginAccount } from "../controllers/authcontroller.js";
import validateToken from "../middleware/validateToken.js"; // make sure path is correct

const router = express.Router();

// Create new account
router.post("/register", registerAccount);

// Get logged-in account
router.get("/account", validateToken, getAccount);

// Login account
router.post("/login", loginAccount);

export default router;

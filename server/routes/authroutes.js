import express from "express";
import { 
    registerAccount, 
    getAccount, 
    loginAccount,
    resendOtp, 
    verifyOtp // 1. Import the new verifyOtp function
} from "../controllers/authcontroller.js";
import validateToken from "../middleware/validateToken.js";

const router = express.Router();

// --- Public Authentication Routes ---

// Step 1: Create a new account (sends OTP)
router.post("/register", registerAccount);

// Step 2: Verify the OTP to activate the account and log in
router.post("/verify-otp", verifyOtp); // 2. Add the new route for OTP verification

// Login for existing, verified accounts
router.post("/login", loginAccount);

// Step 3: Resend OTP (in case user didn’t get it or it expired)
router.post("/resend-otp", resendOtp);


// --- Private Route ---

// Get logged-in account details (requires a valid token)
router.get("/account", validateToken, getAccount);


export default router;
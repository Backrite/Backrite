import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, "User already exists"],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  
  // --- Fields for Email OTP Verification ---
  
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailOtp: {
    type: String,
  },
  emailOtpExpires: {
    type: Date,
  },
  
  // --- Your existing fields ---
  
  solvedProblems: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
    }
  ],
  attemptedProblems: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
    }
  ],
}, { timestamps: true });

export default model('User', userSchema);
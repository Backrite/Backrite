// models/pendingUser.js
import { Schema, model } from 'mongoose';

const pendingUserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // prevent multiple pending docs for same email
  },
  password: {
    type: String,
    required: true, // already hashed before saving
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpires: {
    type: Date,
    required: true,
    index: { expires: '5m' } // auto delete after 5 minutes
  },
}, { timestamps: true });

export default model('PendingUser', pendingUserSchema);

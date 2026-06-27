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
    select: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: true,
  },
  authProviders: [{
    provider: {
      type: String,
      enum: ['google', 'github'],
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  }],
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

userSchema.index(
  { 'authProviders.provider': 1, 'authProviders.providerId': 1 },
  { unique: true, sparse: true },
);

export default model('User', userSchema);

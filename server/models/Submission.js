import { Schema, model } from "mongoose";

const submissionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    problem: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
    code: { type: String, required: true },
    status: { type: String, enum: ["passed", "failed"], required: true },
    testResults: [
      {
        index: Number,
        input: String, // Optional: input for reference
        expected: String,
        actual: String,
        passed: Boolean,
        error: String, // Optional: to store runtime errors
      },
    ],
    timeSpent: { type: Number, default: 0 }, // time in seconds
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model("Submission", submissionSchema);

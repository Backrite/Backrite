import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema({
  input: String,
  output: String,
  explanation: String,
});

const testCaseSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String,
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true 
},
  slug: { 
    type: String, 
    unique: true, 
    required: true 
}, // for URLs
  description: { 
    type: String, 
    required: true 
},
  difficulty: { 
    type: String, 
    enum: ["Easy", "Medium", "Hard"], 
    default: "Easy" 
},
  tags: [String],
  examples: [exampleSchema],
  constraints: [String],
  starterCode: { 
    type: String 
},
  testCases: [testCaseSchema],
}, { timestamps: true });

export default mongoose.model("Problem", problemSchema);

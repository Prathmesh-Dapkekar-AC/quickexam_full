import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },
    text: { type: String, required: true },
    options: {
      type: [String],
      validate: [
        (v) => Array.isArray(v) && v.length === 4,
        "Question must have exactly 4 choices",
      ],
    },
    correctIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
      select: false,
    },
    marks: { type: Number, default: 1, min: 0 },
    negativeMarks: { type: Number, default: 0, min: 0 },
    order: { type: Number, default: 1 },
  },
  { timestamps: true },
);

questionSchema.index({ exam: 1, order: 1 });

export default mongoose.model("Question", questionSchema);

import mongoose from "mongoose";

const attemptAnswerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    selectedIndex: { type: Number, default: null },
    markedForReview: { type: Boolean, default: false },
  },
  { _id: false },
);

const violationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["tab_switch", "fullscreen_exit"],
      required: true,
    },
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const attemptSchema = new mongoose.Schema(
  {
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startedAt: { type: Date, default: Date.now },
    deadlineAt: { type: Date, required: true },
    submittedAt: { type: Date },
    status: {
      type: String,
      enum: ["in_progress", "submitted", "abandoned"],
      default: "in_progress",
    },
    answers: [attemptAnswerSchema],
    score: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    violations: [violationSchema],
    questionOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true },
);

attemptSchema.index({ exam: 1, student: 1 }, { unique: true });
attemptSchema.index({ status: 1, deadlineAt: 1 });

export default mongoose.model("Attempt", attemptSchema);

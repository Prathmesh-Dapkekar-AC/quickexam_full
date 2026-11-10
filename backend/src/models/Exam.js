import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalMarks: { type: Number, default: 0 },
    gradingScheme: {
      type: {
        type: String,
        enum: ["standard_negative", "zero_penalty", "per_question"],
        default: "standard_negative",
      },
      defaultNegativeFactor: { type: Number, default: 0.25 },
    },
    shuffleQuestions: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
    },
    isPublished: { type: Boolean, default: false },
    isRestricted: { type: Boolean, default: false },
    allowedStudents: [{ type: String, trim: true }],
    accessCode: { type: String, uppercase: true, trim: true },
  },
  { timestamps: true },
);

examSchema.index({ status: 1, startTime: 1, endTime: 1 });
examSchema.index({ isPublished: 1, allowedStudents: 1 });

export default mongoose.model("Exam", examSchema);

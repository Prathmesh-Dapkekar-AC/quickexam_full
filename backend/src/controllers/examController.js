// import { z } from "zod";
// import Exam from "../models/Exam.js";
// import Question from "../models/Question.js";
// import Attempt from "../models/Attempt.js";

// export const createExamSchema = z.object({
//   title: z.string().min(3),
//   description: z.string().optional(),
//   durationMinutes: z.number().int().min(1),
//   startTime: z.string().datetime(),
//   endTime: z.string().datetime(),
//   gradingScheme: z
//     .object({
//       type: z.enum(["standard_negative", "zero_penalty", "per_question"]),
//       defaultNegativeFactor: z.number().min(0).max(1).optional(),
//     })
//     .optional(),
//   shuffleQuestions: z.boolean().optional(),
//   accessCode: z.string().optional(),
// });

// export const getExams = async (req, res) => {
//   let query = {};
//   if (req.user.role === "teacher") {
//     query = { createdBy: req.user._id };
//   } else if (req.user.role === "student") {
//     query = { status: { $in: ["published", "closed"] } };
//   }
//   const exams = await Exam.find(query).sort({ startTime: -1 });
//   res.json(exams);
// };

// export const createExam = async (req, res) => {
//   const data = req.validatedBody;
//   const exam = await Exam.create({
//     ...data,
//     createdBy: req.user._id,
//   });
//   res.status(201).json(exam);
// };

// export const getExamById = async (req, res) => {
//   const exam = await Exam.findById(req.params.id).populate(
//     "createdBy",
//     "name email",
//   );
//   if (!exam) return res.status(404).json({ error: "Exam not found" });

//   let questions = [];
//   if (req.user.role === "teacher" && exam.createdBy._id.equals(req.user._id)) {
//     questions = await Question.find({ exam: exam._id })
//       .select("+correctIndex")
//       .sort({ order: 1 });
//   }

//   res.json({ exam, questions });
// };

// export const updateExamStatus = async (req, res) => {
//   const { status } = req.body;
//   if (!["draft", "published", "closed"].includes(status)) {
//     return res.status(400).json({ error: "Invalid status" });
//   }

//   const exam = await Exam.findOne({
//     _id: req.params.id,
//     createdBy: req.user._id,
//   });
//   if (!exam)
//     return res.status(404).json({ error: "Exam not found or unauthorized" });

//   exam.status = status;
//   await exam.save();
//   res.json(exam);
// };

// export const addQuestion = async (req, res) => {
//   const { text, options, correctIndex, marks, negativeMarks } = req.body;
//   const exam = await Exam.findOne({
//     _id: req.params.id,
//     createdBy: req.user._id,
//   });
//   if (!exam) return res.status(404).json({ error: "Exam not found" });

//   const count = await Question.countDocuments({ exam: exam._id });
//   const question = await Question.create({
//     exam: exam._id,
//     text,
//     options,
//     correctIndex,
//     marks: marks || 1,
//     negativeMarks: negativeMarks || 0,
//     order: count + 1,
//   });

//   exam.totalMarks = (exam.totalMarks || 0) + (marks || 1);
//   await exam.save();

//   res.status(201).json(question);
// };

// export const deleteQuestion = async (req, res) => {
//   const exam = await Exam.findOne({
//     _id: req.params.id,
//     createdBy: req.user._id,
//   });
//   if (!exam) return res.status(404).json({ error: "Exam not found" });

//   const question = await Question.findOneAndDelete({
//     _id: req.params.qId,
//     exam: exam._id,
//   });
//   if (question) {
//     exam.totalMarks = Math.max(0, (exam.totalMarks || 0) - question.marks);
//     await exam.save();
//   }
//   res.json({ message: "Question deleted successfully" });
// };

// export const getExamAnalytics = async (req, res) => {
//   const exam = await Exam.findOne({
//     _id: req.params.id,
//     createdBy: req.user._id,
//   });
//   if (!exam) return res.status(404).json({ error: "Exam not found" });

//   const attempts = await Attempt.find({ exam: exam._id, status: "submitted" })
//     .populate("student", "name email")
//     .sort({ score: -1 });

//   const total = attempts.length;
//   const scores = attempts.map((a) => a.score);
//   const avgScore = total
//     ? (scores.reduce((a, b) => a + b, 0) / total).toFixed(2)
//     : 0;
//   const maxScore = total ? Math.max(...scores) : 0;
//   const minScore = total ? Math.min(...scores) : 0;

//   res.json({
//     exam,
//     totalSubmissions: total,
//     avgScore,
//     maxScore,
//     minScore,
//     roster: attempts.map((a, idx) => ({
//       rank: idx + 1,
//       studentName: a.student.name,
//       studentEmail: a.student.email,
//       score: a.score,
//       percentage: a.percentage,
//       submittedAt: a.submittedAt,
//       violationsCount: a.violations.length,
//     })),
//   });
// };

import { z } from "zod";
import Exam from "../models/Exam.js";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";

export const createExamSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  durationMinutes: z.number().int().min(1),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  gradingScheme: z
    .object({
      type: z.enum(["standard_negative", "zero_penalty", "per_question"]),
      defaultNegativeFactor: z.number().min(0).max(1).optional(),
    })
    .optional(),
  shuffleQuestions: z.boolean().optional(),
  accessCode: z.string().optional(),
  allowedStudents: z.array(z.string()).optional(),
  isRestricted: z.boolean().optional(),
});

export const getExams = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "teacher") {
      query = { createdBy: req.user._id };
    } else if (req.user.role === "student") {
      const studentPrn = req.user?.prn || "";
      const studentId = req.user?._id;

      // Status either "published" or isPublished: true
      query = {
        $and: [
          {
            $or: [
              { status: { $in: ["published", "closed"] } },
              { isPublished: true },
            ],
          },
          {
            $or: [
              { isRestricted: false },
              { isRestricted: { $exists: false } },
              { allowedStudents: { $exists: false } },
              { allowedStudents: { $size: 0 } },
              ...(studentPrn ? [{ allowedStudents: studentPrn }] : []),
              ...(studentId ? [{ allowedStudents: studentId }] : []),
            ],
          },
        ],
      };
    }

    const exams = await Exam.find(query).sort({ startTime: -1, createdAt: -1 });
    return res.json(exams);
  } catch (error) {
    console.error("Error in getExams:", error);
    return res.status(500).json({ error: "Failed to fetch exams" });
  }
};

export const createExam = async (req, res) => {
  try {
    const data = req.validatedBody;
    const exam = await Exam.create({
      ...data,
      createdBy: req.user._id,
      status: "draft",
    });
    return res.status(201).json(exam);
  } catch (error) {
    console.error("Error in createExam:", error);
    return res.status(500).json({ error: "Failed to create exam" });
  }
};

export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    let questions = [];
    if (req.user.role === "teacher" && exam.createdBy._id.equals(req.user._id)) {
      questions = await Question.find({ exam: exam._id })
        .select("+correctIndex")
        .sort({ order: 1 });
    } else if (req.user.role === "student") {
      // Student ko correctIndex kabhi mat bhejo
      questions = await Question.find({ exam: exam._id })
        .select("-correctIndex")
        .sort({ order: 1 });
    }

    return res.json({ exam, questions });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch exam details" });
  }
};

export const updateExamStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["draft", "published", "closed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const exam = await Exam.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!exam) {
      return res.status(404).json({ error: "Exam not found or unauthorized" });
    }

    exam.status = status;
    exam.isPublished = status === "published";
    await exam.save();
    return res.json(exam);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update exam status" });
  }
};

export const addQuestion = async (req, res) => {
  try {
    const { text, options, correctIndex, marks, negativeMarks } = req.body;
    const exam = await Exam.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    const count = await Question.countDocuments({ exam: exam._id });
    const question = await Question.create({
      exam: exam._id,
      text,
      options,
      correctIndex,
      marks: marks || 1,
      negativeMarks: negativeMarks || 0,
      order: count + 1,
    });

    exam.totalMarks = (exam.totalMarks || 0) + (marks || 1);
    await exam.save();

    return res.status(201).json(question);
  } catch (error) {
    return res.status(500).json({ error: "Failed to add question" });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const exam = await Exam.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    const question = await Question.findOneAndDelete({
      _id: req.params.qId,
      exam: exam._id,
    });
    if (question) {
      exam.totalMarks = Math.max(0, (exam.totalMarks || 0) - question.marks);
      await exam.save();
    }
    return res.json({ message: "Question deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete question" });
  }
};

export const getExamAnalytics = async (req, res) => {
  try {
    const exam = await Exam.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    const attempts = await Attempt.find({ exam: exam._id, status: "submitted" })
      .populate("student", "name email prn")
      .sort({ score: -1 });

    const total = attempts.length;
    const scores = attempts.map((a) => a.score);
    const avgScore = total
      ? (scores.reduce((a, b) => a + b, 0) / total).toFixed(2)
      : 0;
    const maxScore = total ? Math.max(...scores) : 0;
    const minScore = total ? Math.min(...scores) : 0;

    return res.json({
      exam,
      totalSubmissions: total,
      avgScore,
      maxScore,
      minScore,
      roster: attempts.map((a, idx) => ({
        rank: idx + 1,
        studentName: a.student?.name || "Student",
        studentEmail: a.student?.email || "",
        studentPrn: a.student?.prn || "N/A",
        score: a.score,
        percentage: a.percentage,
        submittedAt: a.submittedAt,
        violationsCount: a.violations?.length || 0,
      })),
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

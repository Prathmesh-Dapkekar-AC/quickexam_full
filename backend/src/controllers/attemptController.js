import Attempt from "../models/Attempt.js";
import Exam from "../models/Exam.js";
import Question from "../models/Question.js";

export const startAttempt = async (req, res) => {
  const { examId, accessCode } = req.body;
  const exam = await Exam.findById(examId);
  if (!exam || exam.status !== "published") {
    return res.status(400).json({ error: "Exam is not currently active" });
  }

  const now = new Date();
  if (now < new Date(exam.startTime) || now > new Date(exam.endTime)) {
    return res
      .status(400)
      .json({ error: "Exam is outside active testing window" });
  }

  if (exam.accessCode && exam.accessCode !== accessCode) {
    return res.status(403).json({ error: "Invalid access code" });
  }

  let attempt = await Attempt.findOne({ exam: examId, student: req.user._id });
  if (attempt) {
    return res
      .status(409)
      .json({ error: "You have already started or submitted this exam" });
  }

  // Server-authoritative deadline calculation
  const calculatedEnd = new Date(now.getTime() + exam.durationMinutes * 60000);
  const examWindowEnd = new Date(exam.endTime);
  const deadlineAt =
    calculatedEnd < examWindowEnd ? calculatedEnd : examWindowEnd;

  let questions = await Question.find({ exam: examId }).select("-correctIndex");
  if (exam.shuffleQuestions) {
    questions = questions.sort(() => Math.random() - 0.5);
  }

  const questionOrder = questions.map((q) => q._id);
  const initialAnswers = questions.map((q) => ({
    question: q._id,
    selectedIndex: null,
    markedForReview: false,
  }));

  attempt = await Attempt.create({
    exam: examId,
    student: req.user._id,
    startedAt: now,
    deadlineAt,
    questionOrder,
    answers: initialAnswers,
  });

  res.status(201).json({
    attemptId: attempt._id,
    deadlineAt,
    remainingMs: Math.max(0, new Date(deadlineAt).getTime() - Date.now()),
    questions,
    savedAnswers: attempt.answers,
  });
};

export const syncAttempt = async (req, res) => {
  const attempt = await Attempt.findOne({
    _id: req.params.id,
    student: req.user._id,
  });
  if (!attempt) return res.status(404).json({ error: "Attempt not found" });

  const remainingMs = Math.max(
    0,
    new Date(attempt.deadlineAt).getTime() - Date.now(),
  );
  const questions = await Question.find({
    _id: { $in: attempt.questionOrder },
  }).select("-correctIndex");

  const orderedQuestions = attempt.questionOrder
    .map((id) => questions.find((q) => q._id.equals(id)))
    .filter(Boolean);

  res.json({
    attemptId: attempt._id,
    deadlineAt: attempt.deadlineAt,
    remainingMs,
    status: attempt.status,
    questions: orderedQuestions,
    savedAnswers: attempt.answers,
  });
};

export const saveAnswer = async (req, res) => {
  const { questionId, selectedIndex, markedForReview } = req.body;
  const attempt = await Attempt.findOne({
    _id: req.params.id,
    student: req.user._id,
  });
  if (!attempt) return res.status(404).json({ error: "Attempt not found" });

  if (attempt.status !== "in_progress") {
    return res
      .status(400)
      .json({ error: "Exam attempt has already concluded" });
  }

  // Grace period 5 seconds
  if (Date.now() > new Date(attempt.deadlineAt).getTime() + 5000) {
    return res
      .status(403)
      .json({ error: "Deadline expired. Late saves are rejected" });
  }

  const ansIndex = attempt.answers.findIndex(
    (a) => a.question.toString() === questionId,
  );
  if (ansIndex > -1) {
    if (selectedIndex !== undefined)
      attempt.answers[ansIndex].selectedIndex = selectedIndex;
    if (markedForReview !== undefined)
      attempt.answers[ansIndex].markedForReview = markedForReview;
  } else {
    attempt.answers.push({
      question: questionId,
      selectedIndex,
      markedForReview,
    });
  }

  await attempt.save();
  res.json({ status: "saved" });
};

export const logViolation = async (req, res) => {
  const { type } = req.body;
  const attempt = await Attempt.findOne({
    _id: req.params.id,
    student: req.user._id,
  });
  if (!attempt || attempt.status !== "in_progress") {
    return res.status(400).json({ error: "Active attempt not found" });
  }

  attempt.violations.push({ type, at: new Date() });
  await attempt.save();
  res.json({ count: attempt.violations.length });
};

export const submitAttempt = async (req, res) => {
  const attempt = await Attempt.findOne({
    _id: req.params.id,
    student: req.user._id,
  });
  if (!attempt) return res.status(404).json({ error: "Attempt not found" });
  if (attempt.status === "submitted") {
    return res.json({
      message: "Attempt already submitted",
      score: attempt.score,
      percentage: attempt.percentage,
    });
  }

  const result = await evaluateAttemptLogic(attempt);
  res.json(result);
};

export const getResult = async (req, res) => {
  const attempt = await Attempt.findOne({
    _id: req.params.id,
    student: req.user._id,
  }).populate("exam");
  if (!attempt) return res.status(404).json({ error: "Attempt not found" });

  const isExamClosed =
    new Date() > new Date(attempt.exam.endTime) ||
    attempt.exam.status === "closed";

  let questionReviews = [];
  if (isExamClosed) {
    const questions = await Question.find({ exam: attempt.exam._id }).select(
      "+correctIndex",
    );
    questionReviews = questions.map((q) => {
      const studentAns = attempt.answers.find((a) => a.question.equals(q._id));
      return {
        questionId: q._id,
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
        selectedIndex: studentAns ? studentAns.selectedIndex : null,
        marks: q.marks,
      };
    });
  }

  res.json({
    examTitle: attempt.exam.title,
    score: attempt.score,
    totalMarks: attempt.exam.totalMarks,
    percentage: attempt.percentage,
    submittedAt: attempt.submittedAt,
    isExamClosed,
    reviews: questionReviews,
  });
};

export const evaluateAttemptLogic = async (attempt) => {
  const exam = await Exam.findById(attempt.exam);
  const questions = await Question.find({ exam: exam._id }).select(
    "+correctIndex",
  );

  let rawScore = 0;
  const scheme = exam.gradingScheme?.type || "standard_negative";
  const defaultFactor = exam.gradingScheme?.defaultNegativeFactor || 0.25;

  for (const q of questions) {
    const studentAns = attempt.answers.find((a) => a.question.equals(q._id));
    if (
      studentAns &&
      studentAns.selectedIndex !== null &&
      studentAns.selectedIndex !== undefined
    ) {
      if (studentAns.selectedIndex === q.correctIndex) {
        rawScore += q.marks;
      } else {
        if (scheme === "standard_negative") {
          rawScore -= q.marks * defaultFactor;
        } else if (scheme === "per_question") {
          rawScore -= q.negativeMarks || 0;
        }
      }
    }
  }

  // Guaranteed score floor
  const finalScore = Math.max(0, Number(rawScore.toFixed(2)));
  const percentage =
    exam.totalMarks > 0
      ? Number(((finalScore / exam.totalMarks) * 100).toFixed(2))
      : 0;

  attempt.score = finalScore;
  attempt.percentage = percentage;
  attempt.status = "submitted";
  attempt.submittedAt = new Date();
  await attempt.save();

  return { score: finalScore, percentage, submittedAt: attempt.submittedAt };
};

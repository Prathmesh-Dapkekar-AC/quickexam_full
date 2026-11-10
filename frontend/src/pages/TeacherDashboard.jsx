import React, { useEffect, useState } from "react";
import client from "../api/client";
import { Card, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { QuestionForm } from "../components/teacher/QuestionForm";
import { RosterTable } from "../components/teacher/RosterTable";
import { PlusCircle, FileSpreadsheet, Users, Trash2 } from "lucide-react";

export const TeacherDashboard = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showCreateExam, setShowCreateExam] = useState(false);

  // New Exam Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDuration, setNewDuration] = useState(30);
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [gradingType, setGradingType] = useState("standard_negative");

  const fetchExams = async () => {
    const res = await client.get("/exams");
    setExams(res.data);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const selectExamForManagement = async (examId) => {
    const res = await client.get(`/exams/${examId}`);
    setSelectedExam(res.data.exam);
    setQuestions(res.data.questions);

    const anRes = await client.get(`/exams/${examId}/analytics`);
    setAnalytics(anRes.data);
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    await client.post("/exams", {
      title: newTitle,
      durationMinutes: Number(newDuration),
      startTime: new Date(newStart).toISOString(),
      endTime: new Date(newEnd).toISOString(),
      gradingScheme: { type: gradingType, defaultNegativeFactor: 0.25 },
    });
    setShowCreateExam(false);
    fetchExams();
  };

  const handleAddQuestion = async (qData) => {
    await client.post(`/exams/${selectedExam._id}/questions`, qData);
    setShowQuestionForm(false);
    selectExamForManagement(selectedExam._id);
  };

  const handleDeleteQuestion = async (qId) => {
    await client.delete(`/exams/${selectedExam._id}/questions/${qId}`);
    selectExamForManagement(selectedExam._id);
  };

  const handleStatusChange = async (newStatus) => {
    await client.patch(`/exams/${selectedExam._id}/status`, {
      status: newStatus,
    });
    selectExamForManagement(selectedExam._id);
    fetchExams();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Faculty Assessment Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure grading rules, author question banks, and audit candidates
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateExam(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> Create Examination
        </Button>
      </div>

      {showCreateExam && (
        <Card className="border-indigo-200 bg-indigo-50/30">
          <h3 className="font-semibold text-slate-900 text-sm mb-4">
            Initialize Assessment Module
          </h3>
          <form
            onSubmit={handleCreateExam}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Assessment Title
              </label>
              <input
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                required
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Window Start Time
              </label>
              <input
                type="datetime-local"
                required
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Window End Time
              </label>
              <input
                type="datetime-local"
                required
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Grading Model
              </label>
              <select
                value={gradingType}
                onChange={(e) => setGradingType(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 p-2"
              >
                <option value="standard_negative">
                  Standard Negative (0.25x Factor)
                </option>
                <option value="zero_penalty">
                  Zero Penalty (Additive Only)
                </option>
                <option value="per_question">
                  Per-Question Granular Weighting
                </option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" variant="primary">
                Launch Module
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateExam(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-800">
            Authored Assessments
          </h3>
          {exams.map((exam) => (
            <div
              key={exam._id}
              onClick={() => selectExamForManagement(exam._id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedExam?._id === exam._id
                  ? "border-indigo-600 bg-indigo-50/40 shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-slate-900 text-sm">
                  {exam.title}
                </h4>
                <Badge
                  variant={exam.status === "published" ? "green" : "slate"}
                >
                  {exam.status}
                </Badge>
              </div>
              <div className="text-xs text-slate-500 mt-2 flex justify-between">
                <span>{exam.durationMinutes} Mins</span>
                <span>Max: {exam.totalMarks || 0} pts</span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedExam ? (
            <>
              <Card>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedExam.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Grading: <b>{selectedExam.gradingScheme?.type}</b>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {selectedExam.status === "draft" && (
                      <Button
                        variant="primary"
                        onClick={() => handleStatusChange("published")}
                      >
                        Publish
                      </Button>
                    )}
                    {selectedExam.status === "published" && (
                      <Button
                        variant="danger"
                        onClick={() => handleStatusChange("closed")}
                      >
                        Close Exam
                      </Button>
                    )}
                  </div>
                </div>

                {analytics && (
                  <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                    <div>
                      Submissions: <b>{analytics.totalSubmissions}</b>
                    </div>
                    <div>
                      Avg: <b>{analytics.avgScore}</b>
                    </div>
                    <div>
                      High: <b>{analytics.maxScore}</b>
                    </div>
                    <div>
                      Floor: <b>{analytics.minScore}</b>
                    </div>
                  </div>
                )}
              </Card>

              <Card>
                <CardHeader
                  title="Question Bank Inventory"
                  subtitle={`${questions.length} items configured`}
                  action={
                    <Button
                      variant="secondary"
                      onClick={() => setShowQuestionForm(!showQuestionForm)}
                    >
                      <PlusCircle className="h-4 w-4 mr-1.5" /> Add Question
                    </Button>
                  }
                />

                {showQuestionForm && (
                  <QuestionForm
                    onSubmit={handleAddQuestion}
                    onCancel={() => setShowQuestionForm(false)}
                  />
                )}

                <div className="space-y-3">
                  {questions.map((q, idx) => (
                    <div
                      key={q._id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">
                          Q{idx + 1}: {q.text}
                        </div>
                        <div className="text-slate-500 mt-0.5">
                          Key: Option {q.correctIndex + 1} | +{q.marks} / -
                          {q.negativeMarks || 0}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteQuestion(q._id)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader
                  title="Cohort Grade Roster & Telemetry"
                  subtitle="Submissions rank-sorted with tie-breaking"
                />
                <RosterTable roster={analytics?.roster} />
              </Card>
            </>
          ) : (
            <Card className="text-center py-16 text-slate-500 text-sm">
              Select an examination from the left panel to inspect questions and
              candidate grade rosters.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

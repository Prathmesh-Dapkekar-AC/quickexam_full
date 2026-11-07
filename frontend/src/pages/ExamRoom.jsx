import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { CountdownTimer } from '../components/exam/CountdownTimer';
import { QuestionCard } from '../components/exam/QuestionCard';
import { QuestionPalette } from '../components/exam/QuestionPalette';
import { ViolationToast } from '../components/exam/ViolationToast';
import { Button } from '../components/ui/button';

export const ExamRoom = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [violationModal, setViolationModal] = useState(false);
  const [violationsCount, setViolationsCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Sync session on mount
  useEffect(() => {
    const syncSession = async () => {
      try {
        const res = await client.get(`/attempts/${attemptId}/sync`);
        if (res.data.status === 'submitted') {
          navigate(`/result/${attemptId}`);
          return;
        }
        setAttempt(res.data);
        setQuestions(res.data.questions);
        setAnswers(res.data.savedAnswers || []);
      } catch (err) {
        alert('Failed to connect to exam session');
        navigate('/student');
      }
    };
    syncSession();
  }, [attemptId, navigate]);

  // Anti-Cheat: Visibility Change Listener
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        try {
          const res = await client.post(`/attempts/${attemptId}/violations`, { type: 'tab_switch' });
          setViolationsCount(res.data.count);
          setViolationModal(true);
        } catch (err) {
          console.error('Violation record error:', err);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [attemptId]);

  // Debounced Auto-Save answer
  const autoSave = useCallback(async (qId, selectedIdx, isReview) => {
    try {
      await client.patch(`/attempts/${attemptId}/save`, {
        questionId: qId,
        selectedIndex: selectedIdx,
        markedForReview: isReview
      });
    } catch (err) {
      console.error('Auto-save error:', err.response?.data?.error);
    }
  }, [attemptId]);

  const handleSelectOption = (optIndex) => {
    const currentQ = questions[currentIndex];
    const updated = [...answers];
    const existingIdx = updated.findIndex(a => a.question === currentQ._id);

    if (existingIdx > -1) {
      updated[existingIdx].selectedIndex = optIndex;
    } else {
      updated.push({ question: currentQ._id, selectedIndex: optIndex, markedForReview: false });
    }

    setAnswers(updated);
    const rev = existingIdx > -1 ? updated[existingIdx].markedForReview : false;
    autoSave(currentQ._id, optIndex, rev);
  };

  const handleToggleReview = () => {
    const currentQ = questions[currentIndex];
    const updated = [...answers];
    const existingIdx = updated.findIndex(a => a.question === currentQ._id);

    let newReviewState = true;
    let selected = null;

    if (existingIdx > -1) {
      newReviewState = !updated[existingIdx].markedForReview;
      updated[existingIdx].markedForReview = newReviewState;
      selected = updated[existingIdx].selectedIndex;
    } else {
      updated.push({ question: currentQ._id, selectedIndex: null, markedForReview: true });
    }

    setAnswers(updated);
    autoSave(currentQ._id, selected, newReviewState);
  };

  const handleSubmit = async () => {
    if (!window.confirm('Are you sure you want to finalize and submit your assessment?')) return;
    setSubmitting(true);
    try {
      await client.post(`/attempts/${attemptId}/submit`);
      navigate(`/result/${attemptId}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Submission error');
      setSubmitting(false);
    }
  };

  if (!attempt || questions.length === 0) {
    return <div className="text-center py-20 text-slate-500">Connecting to secure testing room...</div>;
  }

  const currentQ = questions[currentIndex];
  const currentAnswer = answers.find(a => a.question === currentQ._id);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Live Examination Session</h2>
          <p className="text-xs text-slate-500">Progress is auto-saved synchronously to authoritative engine</p>
        </div>
        <div className="flex items-center gap-4">
          <CountdownTimer deadlineAt={attempt.deadlineAt} onExpire={handleSubmit} />
          <Button variant="danger" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'End Exam'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <QuestionCard
            question={currentQ}
            index={currentIndex}
            selectedOption={currentAnswer ? currentAnswer.selectedIndex : null}
            onSelectOption={handleSelectOption}
            isMarkedForReview={currentAnswer ? currentAnswer.markedForReview : false}
            onToggleReview={handleToggleReview}
          />

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="secondary"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(c => c - 1)}
            >
              Previous
            </Button>
            <span className="text-xs text-slate-500">
              Item {currentIndex + 1} of {questions.length}
            </span>
            <Button
              variant="secondary"
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex(c => c + 1)}
            >
              Next
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <QuestionPalette
            questions={questions}
            answers={answers}
            currentIndex={currentIndex}
            onSelectQuestion={idx => setCurrentIndex(idx)}
          />
        </div>
      </div>

      <ViolationToast
        open={violationModal}
        count={violationsCount}
        onClose={() => setViolationModal(false)}
      />
    </div>
  );
};

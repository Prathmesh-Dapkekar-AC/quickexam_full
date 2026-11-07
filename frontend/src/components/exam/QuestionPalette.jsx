import React from 'react';

export const QuestionPalette = ({ questions, answers, currentIndex, onSelectQuestion }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <h4 className="text-sm font-semibold text-slate-900 mb-4">Question Overview</h4>
      
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, idx) => {
          const ans = answers.find(a => a.question === q._id);
          const isAnswered = ans && ans.selectedIndex !== null && ans.selectedIndex !== undefined;
          const isReview = ans && ans.markedForReview;
          const isCurrent = currentIndex === idx;

          let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
          if (isReview) {
            badgeColor = 'bg-amber-400 text-white border-amber-500 font-bold';
          } else if (isAnswered) {
            badgeColor = 'bg-emerald-600 text-white border-emerald-700';
          }

          return (
            <button
              key={q._id}
              onClick={() => onSelectQuestion(idx)}
              className={`h-9 w-9 rounded-lg text-xs font-semibold flex items-center justify-center border transition-transform ${badgeColor} ${
                isCurrent ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105' : ''
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-600"></span>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-amber-400"></span>
          <span>Marked for Review</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-slate-200 border border-slate-300"></span>
          <span>Unattempted</span>
        </div>
      </div>
    </div>
  );
};

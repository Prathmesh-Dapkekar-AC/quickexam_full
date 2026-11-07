import React from 'react';

export const QuestionCard = ({ question, index, selectedOption, onSelectOption, isMarkedForReview, onToggleReview }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs select-none">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
            Question {index + 1}
          </span>
          <p className="mt-3 text-base font-medium text-slate-800 leading-relaxed">
            {question.text}
          </p>
        </div>
        <button
          onClick={onToggleReview}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
            isMarkedForReview
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
          }`}
        >
          {isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
        </button>
      </div>

      <div className="space-y-3 mt-6">
        {question.options.map((option, optIdx) => {
          const isSelected = selectedOption === optIdx;
          return (
            <label
              key={optIdx}
              className={`flex items-center p-3.5 rounded-lg border cursor-pointer transition-colors ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-medium'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name={`question-${question._id}`}
                checked={isSelected}
                onChange={() => onSelectOption(optIdx)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span className="ml-3 text-sm">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

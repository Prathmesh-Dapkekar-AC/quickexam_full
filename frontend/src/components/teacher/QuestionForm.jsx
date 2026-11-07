import React, { useState } from 'react';
import { Button } from '../ui/button';

export const QuestionForm = ({ onSubmit, onCancel }) => {
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0.25);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ text, options, correctIndex, marks: Number(marks), negativeMarks: Number(negativeMarks) });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 space-y-4">
      <h4 className="font-semibold text-slate-900 text-sm">Add New Question</h4>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Question Statement</label>
        <textarea
          required
          rows={2}
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
          placeholder="State the problem prompt..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((opt, i) => (
          <div key={i}>
            <label className="block text-xs font-medium text-slate-700 mb-1">Choice {i + 1}</label>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="correctOption"
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <input
                type="text"
                required
                value={opt}
                onChange={e => {
                  const copy = [...options];
                  copy[i] = e.target.value;
                  setOptions(copy);
                }}
                className="w-full text-sm rounded-lg border border-slate-300 p-2"
                placeholder={`Option ${i + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-2">
        <div className="w-1/2">
          <label className="block text-xs font-medium text-slate-700 mb-1">Positive Marks</label>
          <input
            type="number"
            min="1"
            value={marks}
            onChange={e => setMarks(e.target.value)}
            className="w-full text-sm rounded-lg border border-slate-300 p-2"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-xs font-medium text-slate-700 mb-1">Negative Deduction</label>
          <input
            type="number"
            step="0.05"
            min="0"
            value={negativeMarks}
            onChange={e => setNegativeMarks(e.target.value)}
            className="w-full text-sm rounded-lg border border-slate-300 p-2"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" variant="primary">Save Question</Button>
      </div>
    </form>
  );
};

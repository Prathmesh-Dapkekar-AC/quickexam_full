import React from 'react';
import { Badge } from '../ui/badge';

export const RosterTable = ({ roster }) => {
  if (!roster || roster.length === 0) {
    return <p className="text-sm text-slate-500 py-4">No completed submissions recorded yet.</p>;
  }

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-lg">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
          <tr>
            <th className="py-3 px-4">Rank</th>
            <th className="py-3 px-4">Candidate</th>
            <th className="py-3 px-4">Score</th>
            <th className="py-3 px-4">Percentage</th>
            <th className="py-3 px-4">Flags</th>
            <th className="py-3 px-4">Submitted At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {roster.map(r => (
            <tr key={r.rank} className="hover:bg-slate-50/50">
              <td className="py-3 px-4 font-bold text-slate-900">#{r.rank}</td>
              <td className="py-3 px-4">
                <div className="font-medium text-slate-900">{r.studentName}</div>
                <div className="text-xs text-slate-500">{r.studentEmail}</div>
              </td>
              <td className="py-3 px-4 font-semibold text-indigo-600">{r.score}</td>
              <td className="py-3 px-4">{r.percentage}%</td>
              <td className="py-3 px-4">
                {r.violationsCount > 0 ? (
                  <Badge variant="rose">{r.violationsCount} Alert(s)</Badge>
                ) : (
                  <Badge variant="green">Clean</Badge>
                )}
              </td>
              <td className="py-3 px-4 text-xs text-slate-500">
                {new Date(r.submittedAt).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

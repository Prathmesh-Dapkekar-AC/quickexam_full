import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Award, CheckCircle, XCircle } from 'lucide-react';

export const ResultScorecard = () => {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await client.get(`/attempts/${attemptId}/result`);
        setResult(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  if (loading) return <div className="text-center py-20 text-slate-500">Compiling Scorecard...</div>;
  if (!result) return <div className="text-center py-20 text-slate-500">Result not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <Card className="text-center py-8">
        <Award className="h-12 w-12 text-indigo-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-slate-900">{result.examTitle}</h1>
        <p className="text-xs text-slate-500 mt-1">Assessment Completion Scorecard</p>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto my-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div>
            <div className="text-xs text-slate-500">Marks Scored</div>
            <div className="text-xl font-bold text-indigo-600">{result.score}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Max Marks</div>
            <div className="text-xl font-bold text-slate-700">{result.totalMarks}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Percentage</div>
            <div className="text-xl font-bold text-emerald-600">{result.percentage}%</div>
          </div>
        </div>

        <Link to="/student"><Button variant="primary">Back to Dashboard</Button></Link>
      </Card>

      {result.isExamClosed ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Post-Exam Review & Rationales</h3>
          {result.reviews?.map((q, idx) => {
            const isCorrect = q.selectedIndex === q.correctIndex;
            return (
              <div key={q.questionId} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">Question {idx + 1}</span>
                  {isCorrect ? (
                    <Badge variant="green"><CheckCircle className="h-3 w-3 mr-1 inline" /> Correct (+{q.marks})</Badge>
                  ) : (
                    <Badge variant="rose"><XCircle className="h-3 w-3 mr-1 inline" /> Incorrect</Badge>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-800 mb-4">{q.text}</p>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isUserPick = q.selectedIndex === optIdx;
                    const isKey = q.correctIndex === optIdx;

                    let rowStyle = 'bg-slate-50 border-slate-200 text-slate-700';
                    if (isKey) rowStyle = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-medium';
                    else if (isUserPick && !isCorrect) rowStyle = 'bg-rose-50 border-rose-300 text-rose-800';

                    return (
                      <div key={optIdx} className={`text-xs p-2.5 rounded-lg border flex justify-between ${rowStyle}`}>
                        <span>{opt}</span>
                        {isKey && <span className="font-semibold text-emerald-700">Correct Answer</span>}
                        {isUserPick && !isKey && <span className="font-semibold text-rose-700">Your Selection</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-6 text-xs text-slate-500">
          Answer key and item reviews will unlock automatically once the global examination window has closed.
        </Card>
      )}
    </div>
  );
};

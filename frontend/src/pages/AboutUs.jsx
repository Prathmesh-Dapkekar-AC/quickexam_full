import React from 'react';
import { Card } from '../components/ui/card';

export const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">About QuickExam</h1>
      <Card>
        <p className="text-sm text-slate-700 leading-relaxed">
          QuickExam is an engineering-grade evaluation platform engineered to address common online exam vulnerabilities, including workstation clock manipulations, manual negative calculation errors, and unmonitored window switching.
        </p>
        <h3 className="font-semibold text-slate-900 mt-6 mb-2">Architectural Principles</h3>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
          <li><b>Server-Authoritative Clock:</b> All deadlines are calculated and enforced at the server layer.</li>
          <li><b>Multi-Scheme Auto-Grading:</b> Native calculation for Standard Negative (-0.25x), Zero Penalty, and Per-Question weighting.</li>
          <li><b>Auditing & Telemetry:</b> Passive client-side focus and fullscreen transition tracking.</li>
        </ul>
      </Card>
    </div>
  );
};

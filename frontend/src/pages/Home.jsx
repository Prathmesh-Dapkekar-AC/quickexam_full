import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle, ShieldAlert, Award, Clock } from 'lucide-react';

export const Home = () => {
  return (
    <div className="space-y-16 py-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
          Authoritative Online Assessment Engine
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Fair, Reliable, and Automated Evaluations
        </h1>
        <p className="text-slate-600 text-base sm:text-lg">
          Zero client clock tampering. Dynamic 3-mode automated negative grading. Passive integrity tracking that ensures evaluation reliability for classrooms and academies.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link to="/register"><Button variant="primary" className="px-6 py-2.5">Get Started Free</Button></Link>
          <Link to="/about"><Button variant="secondary" className="px-6 py-2.5">Platform Architecture</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <Clock className="h-8 w-8 text-indigo-600 mb-3" />
          <h3 className="font-semibold text-slate-900 mb-1">Server-Owned Timers</h3>
          <p className="text-sm text-slate-600">
            Immutable server countdowns prevent workstation clock manipulation from giving unfair time advantages.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <ShieldAlert className="h-8 w-8 text-indigo-600 mb-3" />
          <h3 className="font-semibold text-slate-900 mb-1">Integrity Auditing</h3>
          <p className="text-sm text-slate-600">
            Full audit tracking via Page Visibility & Fullscreen APIs provides instructors with detailed event timelines.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <Award className="h-8 w-8 text-indigo-600 mb-3" />
          <h3 className="font-semibold text-slate-900 mb-1">Multi-Mode Grading</h3>
          <p className="text-sm text-slate-600">
            Instantly grade Standard Negative, Zero Penalty, or Per-Question custom weights with guaranteed zero-floor boundaries.
          </p>
        </div>
      </div>
    </div>
  );
};

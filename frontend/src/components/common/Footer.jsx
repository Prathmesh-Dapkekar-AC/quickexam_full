import React from "react";

export const Footer = () => (
  <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
    <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
      <p>
        &copy; {new Date().getFullYear()} QuickExam Evaluation Engine.
        Authoritative Timed Assessments.
      </p>
    </div>
  </footer>
);

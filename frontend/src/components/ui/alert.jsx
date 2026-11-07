import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Alert = ({ title, description, variant = 'default' }) => {
  const isDestructive = variant === 'destructive';
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border text-sm ${
      isDestructive 
        ? 'bg-rose-50 border-rose-200 text-rose-800' 
        : 'bg-indigo-50 border-indigo-200 text-indigo-800'
    }`}>
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <div>
        {title && <h5 className="font-semibold leading-tight mb-1">{title}</h5>}
        {description && <div className="text-xs leading-relaxed">{description}</div>}
      </div>
    </div>
  );
};

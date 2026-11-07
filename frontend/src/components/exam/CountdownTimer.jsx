import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export const CountdownTimer = ({ deadlineAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTime = () => {
      const remaining = Math.max(0, new Date(deadlineAt).getTime() - Date.now());
      setTimeLeft(remaining);
      if (remaining === 0 && onExpire) {
        onExpire();
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [deadlineAt, onExpire]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const isUrgent = totalSeconds < 300; // < 5 mins

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-medium text-sm transition-colors ${
      isUrgent ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
    }`}>
      <Clock className="h-4 w-4" />
      <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    </div>
  );
};

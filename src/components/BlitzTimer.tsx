import { useEffect } from 'react';
import { Timer } from 'lucide-react';
import { sounds } from '../utils/sound';

interface BlitzTimerProps {
  timeLeft: number; // 0 to 5
  maxTime?: number;
  isActive: boolean;
}

export function BlitzTimer({ timeLeft, maxTime = 5, isActive }: BlitzTimerProps) {
  useEffect(() => {
    if (isActive && timeLeft <= 3 && timeLeft > 0) {
      sounds.playTick();
    }
  }, [timeLeft, isActive]);

  const percentage = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));

  let barColor = 'bg-emerald-500';
  if (percentage <= 40) {
    barColor = 'bg-rose-500';
  } else if (percentage <= 70) {
    barColor = 'bg-amber-500';
  }

  return (
    <div id="blitz-timer-container" className="w-full max-w-md mx-auto space-y-1">
      <div className="flex items-center justify-between text-xs font-bold px-1">
        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
          <Timer className="w-4 h-4 animate-spin-slow" />
          <span>Speed Blitz: {timeLeft.toFixed(1)}s</span>
        </div>
        <span className={timeLeft <= 2 ? 'text-rose-500 font-extrabold animate-ping' : 'text-zinc-500'}>
          {timeLeft <= 2 ? 'Hurry!' : 'Move fast!'}
        </span>
      </div>
      <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-100 ease-linear rounded-full ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

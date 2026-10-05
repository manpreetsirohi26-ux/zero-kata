import { Trophy, X, CheckCircle2, Lock } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  streak: number;
  bestStreak: number;
}

export function AchievementsModal({
  isOpen,
  onClose,
  achievements,
  streak,
  bestStreak,
}: AchievementsModalProps) {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Achievements & Badges</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Unlocked {unlockedCount} of {achievements.length} badges
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Streaks Banner */}
        <div className="grid grid-cols-2 gap-2 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-3 rounded-2xl">
          <div className="text-center">
            <div className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">Current Streak</div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">🔥 {streak}</div>
          </div>
          <div className="text-center border-l border-amber-200 dark:border-amber-900/60">
            <div className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">Best Streak</div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">⚡ {bestStreak}</div>
          </div>
        </div>

        {/* Badges List */}
        <div className="space-y-2.5">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                item.unlocked
                  ? 'bg-amber-50/40 dark:bg-zinc-800/80 border-amber-300/80 dark:border-amber-700/50 shadow-xs'
                  : 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 opacity-60'
              }`}
            >
              <div className="text-2xl select-none p-1.5 rounded-xl bg-white dark:bg-zinc-800 shadow-xs">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.title}</h3>
                  {item.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}

import { Player, GameMode, SymbolSetId, ThemeId } from '../types';
import { DynamicSymbol } from './Symbols';
import { Minus, Flame } from 'lucide-react';
import { THEMES } from '../utils/theme';

interface ScoreBoardProps {
  xWins: number;
  oWins: number;
  ties: number;
  currentTurn: Player;
  gameMode: GameMode;
  userPlayer: Player;
  isGameOver: boolean;
  symbolSet: SymbolSetId;
  themeId: ThemeId;
  streak: number;
  onOpenAchievements: () => void;
}

export function ScoreBoard({
  xWins,
  oWins,
  ties,
  currentTurn,
  gameMode,
  userPlayer,
  isGameOver,
  symbolSet,
  themeId,
  streak,
  onOpenAchievements,
}: ScoreBoardProps) {
  const theme = THEMES[themeId] || THEMES.classic;

  const getPlayerLabel = (symbol: Player) => {
    if (gameMode === 'pvp') {
      return symbol === 'X' ? 'Player 1' : 'Player 2';
    }
    if (userPlayer === symbol) {
      return 'You';
    }
    return 'Computer';
  };

  const isXActive = !isGameOver && currentTurn === 'X';
  const isOActive = !isGameOver && currentTurn === 'O';

  return (
    <div className="w-full max-w-md mx-auto space-y-2 mb-3">
      {/* Top mini-bar with Streak and Achievements launcher */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
          <span>Win Streak: {streak}</span>
        </div>

        <button
          type="button"
          onClick={onOpenAchievements}
          className="flex items-center gap-1 font-semibold text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          <span>🏆 Badges</span>
        </button>
      </div>

      <div id="scoreboard-container" className="grid grid-cols-3 gap-2.5">
        {/* X Card */}
        <div
          id="score-card-x"
          className={`relative flex flex-col items-center justify-between p-2.5 rounded-2xl transition-all duration-200 border ${
            theme.cardBg
          } ${
            isXActive
              ? 'ring-2 ring-rose-500/50 shadow-md scale-102'
              : ''
          }`}
        >
          {isXActive && (
            <span
              id="badge-x-turn"
              className="absolute -top-2.5 px-2 py-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full uppercase tracking-wider shadow-xs animate-pulse"
            >
              Turn
            </span>
          )}
          <div className="flex items-center gap-1.5 font-semibold text-xs text-rose-600 dark:text-rose-400">
            <div className="w-5 h-5 flex items-center justify-center">
              <DynamicSymbol player="X" symbolSet={symbolSet} className="w-4 h-4" />
            </div>
            <span>{symbolSet === 'classic' ? 'Player (X)' : 'Player 1'}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black my-0.5">{xWins}</div>
          <div className="text-[11px] font-medium opacity-70">
            {getPlayerLabel('X')}
          </div>
        </div>

        {/* Ties Card */}
        <div
          id="score-card-ties"
          className={`flex flex-col items-center justify-between p-2.5 rounded-2xl border ${theme.cardBg}`}
        >
          <div className="flex items-center gap-1 opacity-70 font-semibold text-xs">
            <Minus className="w-3.5 h-3.5" />
            <span>Draws</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black my-0.5">{ties}</div>
          <div className="text-[11px] font-medium opacity-60">Matches</div>
        </div>

        {/* O Card */}
        <div
          id="score-card-o"
          className={`relative flex flex-col items-center justify-between p-2.5 rounded-2xl transition-all duration-200 border ${
            theme.cardBg
          } ${
            isOActive
              ? 'ring-2 ring-sky-500/50 shadow-md scale-102'
              : ''
          }`}
        >
          {isOActive && (
            <span
              id="badge-o-turn"
              className="absolute -top-2.5 px-2 py-0.5 bg-sky-500 text-white text-[9px] font-bold rounded-full uppercase tracking-wider shadow-xs animate-pulse"
            >
              Turn
            </span>
          )}
          <div className="flex items-center gap-1.5 font-semibold text-xs text-sky-600 dark:text-sky-400">
            <div className="w-5 h-5 flex items-center justify-center">
              <DynamicSymbol player="O" symbolSet={symbolSet} className="w-4 h-4" />
            </div>
            <span>{symbolSet === 'classic' ? 'Player (O)' : 'Player 2'}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black my-0.5">{oWins}</div>
          <div className="text-[11px] font-medium opacity-70">
            {getPlayerLabel('O')}
          </div>
        </div>
      </div>
    </div>
  );
}

import { GameMode, GameRule, Player, SymbolSetId } from '../types';
import { DynamicSymbol } from './Symbols';
import { Trophy, MinusCircle, Flame, Sparkles } from 'lucide-react';

interface StatusBannerProps {
  winner: Player | 'tie' | null;
  currentTurn: Player;
  isComputerThinking: boolean;
  gameMode: GameMode;
  userPlayer: Player;
  rule: GameRule;
  symbolSet: SymbolSetId;
}

export function StatusBanner({
  winner,
  currentTurn,
  isComputerThinking,
  gameMode,
  userPlayer,
  rule,
  symbolSet,
}: StatusBannerProps) {
  // Game Over: Winner
  if (winner && winner !== 'tie') {
    const isUserWinner = gameMode === 'pve' && winner === userPlayer;
    const isAIWinner = gameMode === 'pve' && winner !== userPlayer;

    let title = `Player ${winner} Won!`;
    if (isUserWinner) title = '🎉 Congratulations! You Won!';
    if (isAIWinner) title = '🤖 Computer Won!';

    return (
      <div
        id="status-banner-winner"
        className="w-full max-w-md mx-auto py-2.5 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center justify-center gap-2.5 text-amber-700 dark:text-amber-300 font-bold text-sm shadow-xs animate-bounce"
      >
        <Trophy className="w-5 h-5 text-amber-500 fill-amber-500" />
        <span>{title}</span>
        <DynamicSymbol player={winner} symbolSet={symbolSet} className="w-5 h-5" isWinning />
      </div>
    );
  }

  // Game Over: Draw
  if (winner === 'tie') {
    return (
      <div
        id="status-banner-tie"
        className="w-full max-w-md mx-auto py-2.5 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center gap-2 text-zinc-700 dark:text-zinc-300 font-bold text-sm shadow-xs"
      >
        <MinusCircle className="w-5 h-5 text-zinc-500" />
        <span>Match Draw! Well played both.</span>
      </div>
    );
  }

  // Active Game: Computer is thinking
  if (isComputerThinking) {
    return (
      <div
        id="status-banner-thinking"
        className="w-full max-w-md mx-auto py-2.5 px-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-center gap-2.5 text-purple-700 dark:text-purple-300 font-semibold text-sm shadow-xs"
      >
        <div className="w-2.5 h-2.5 bg-purple-600 dark:bg-purple-400 rounded-full animate-ping" />
        <span>Computer is strategizing...</span>
      </div>
    );
  }

  // Active Game: Current Turn
  const isUserTurn = gameMode === 'pve' && currentTurn === userPlayer;
  let turnText = `Player ${currentTurn}'s Turn`;
  if (gameMode === 'pve') {
    turnText = isUserTurn ? 'Your Turn' : "Computer's Turn";
  }

  return (
    <div
      id="status-banner-active"
      className="w-full max-w-md mx-auto py-2 px-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs sm:text-sm font-semibold shadow-xs"
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 flex items-center justify-center">
          <DynamicSymbol player={currentTurn} symbolSet={symbolSet} className="w-4 h-4" />
        </div>
        <span className="text-zinc-900 dark:text-white font-bold">{turnText}</span>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
        {rule === 'disappearing' && (
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" /> 3 Marks Limit
          </span>
        )}
        {rule === 'blitz' && (
          <span className="flex items-center gap-1 text-rose-500 font-bold">
            <Flame className="w-3.5 h-3.5 fill-rose-500" /> 5s Blitz
          </span>
        )}
        {rule === 'classic' && (
          <span>Classic Rules</span>
        )}
      </div>
    </div>
  );
}

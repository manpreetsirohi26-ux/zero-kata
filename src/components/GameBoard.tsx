import { useState } from 'react';
import { BoardState, GridSize, MoveRecord, Player, SymbolSetId, ThemeId } from '../types';
import { DynamicSymbol } from './Symbols';
import { THEMES } from '../utils/theme';

interface GameBoardProps {
  board: BoardState;
  gridSize: GridSize;
  onCellClick: (index: number) => void;
  winningLine: number[] | null;
  winner: Player | 'tie' | null;
  currentTurn: Player;
  isComputerThinking: boolean;
  themeId: ThemeId;
  symbolSet: SymbolSetId;
  movesHistory: MoveRecord[];
  isDisappearingMode: boolean;
}

export function GameBoard({
  board,
  gridSize,
  onCellClick,
  winningLine,
  winner,
  currentTurn,
  isComputerThinking,
  themeId,
  symbolSet,
  movesHistory,
  isDisappearingMode,
}: GameBoardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const theme = THEMES[themeId] || THEMES.classic;

  const isCellWinning = (index: number) => {
    return winningLine ? winningLine.includes(index) : false;
  };

  // Find oldest piece of each player in disappearing mode (if they have 3 pieces)
  const getFadingStatus = (index: number, cellPlayer: Player | null) => {
    if (!isDisappearingMode || !cellPlayer || winner) return false;
    const playerMoves = movesHistory.filter((m) => m.player === cellPlayer);
    if (playerMoves.length >= 3 && playerMoves[0].index === index) {
      return true;
    }
    return false;
  };

  const gridColsClass = gridSize === 4 ? 'grid-cols-4 grid-rows-4' : 'grid-cols-3 grid-rows-3';
  const maxWidthClass = gridSize === 4 ? 'max-w-[400px]' : 'max-w-[360px]';

  return (
    <div className={`relative w-full ${maxWidthClass} mx-auto aspect-square p-2`}>
      {/* Grid container */}
      <div
        id="tictactoe-grid"
        className={`grid ${gridColsClass} gap-2 w-full h-full p-2.5 rounded-3xl transition-all duration-300 ${theme.gridBg}`}
      >
        {board.map((cell, index) => {
          const winning = isCellWinning(index);
          const isFading = getFadingStatus(index, cell);
          const canInteract = !cell && !winner && !isComputerThinking;

          return (
            <button
              key={index}
              id={`board-cell-${index}`}
              type="button"
              disabled={!canInteract}
              onClick={() => onCellClick(index)}
              onMouseEnter={() => canInteract && setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative flex items-center justify-center rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 select-none ${
                theme.tileBg
              } ${theme.tileBorder} ${
                winning
                  ? cell === 'X'
                    ? 'bg-rose-100 dark:bg-rose-950/70 ring-3 ring-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-105 z-10'
                    : 'bg-sky-100 dark:bg-sky-950/70 ring-3 ring-sky-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105 z-10'
                  : ''
              } ${
                canInteract
                  ? 'hover:brightness-95 active:scale-95 cursor-pointer'
                  : 'cursor-default'
              }`}
            >
              {/* Placed symbol */}
              {cell && (
                <DynamicSymbol
                  player={cell}
                  symbolSet={symbolSet}
                  className={gridSize === 4 ? 'w-10 h-10' : 'w-14 h-14 sm:w-16 sm:h-16'}
                  isWinning={winning}
                  isFading={isFading}
                />
              )}

              {/* Disappearing piece warning badge */}
              {isFading && !winning && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-amber-500 text-white text-[9px] font-black rounded-full shadow-xs animate-bounce">
                  Next 💨
                </span>
              )}

              {/* Ghost preview on normal hover */}
              {!cell && !winner && hoveredIndex === index && !isComputerThinking && (
                <div className="opacity-30 pointer-events-none scale-90 transition-transform">
                  <DynamicSymbol
                    player={currentTurn}
                    symbolSet={symbolSet}
                    className={gridSize === 4 ? 'w-8 h-8' : 'w-12 h-12'}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

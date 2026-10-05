import { motion } from 'motion/react';
import { Player, SymbolSetId } from '../types';

interface SymbolProps {
  player: Player;
  symbolSet?: SymbolSetId;
  className?: string;
  isWinning?: boolean;
  isFading?: boolean; // For disappearing mode
}

export const SYMBOL_SETS: {
  id: SymbolSetId;
  name: string;
  xIcon: string;
  oIcon: string;
}[] = [
  { id: 'classic', name: 'Classic (X & O)', xIcon: '✕', oIcon: '◯' },
  { id: 'fire_ice', name: 'Fire & Ice', xIcon: '🔥', oIcon: '❄️' },
  { id: 'animals', name: 'Lion & Tiger', xIcon: '🦁', oIcon: '🐯' },
  { id: 'food', name: 'Pizza & Burger', xIcon: '🍕', oIcon: '🍔' },
  { id: 'royalty', name: 'Crown & Diamond', xIcon: '👑', oIcon: '💎' },
];

export function KataSymbol({ className = 'w-16 h-16', isWinning = false }: { className?: string; isWinning?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 80 80"
      className={`${className} ${isWinning ? 'drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]' : ''}`}
      initial={{ scale: 0.6, rotate: -25, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
    >
      <motion.line
        x1="20"
        y1="20"
        x2="60"
        y2="60"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      />
      <motion.line
        x1="60"
        y1="20"
        x2="20"
        y2="60"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.22, delay: 0.08, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}

export function ZeroSymbol({ className = 'w-16 h-16', isWinning = false }: { className?: string; isWinning?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 80 80"
      className={`${className} ${isWinning ? 'drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]' : ''}`}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
    >
      <motion.circle
        cx="40"
        cy="40"
        r="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="9.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, rotate: -90 }}
        animate={{ pathLength: 1, rotate: 0 }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}

export function DynamicSymbol({
  player,
  symbolSet = 'classic',
  className = 'w-14 h-14',
  isWinning = false,
  isFading = false,
}: SymbolProps) {
  const currentSet = SYMBOL_SETS.find((s) => s.id === symbolSet) || SYMBOL_SETS[0];

  if (symbolSet === 'classic') {
    return (
      <div className={`relative ${isFading ? 'opacity-40 animate-pulse' : ''}`}>
        {player === 'X' ? (
          <KataSymbol className={className} isWinning={isWinning} />
        ) : (
          <ZeroSymbol className={className} isWinning={isWinning} />
        )}
      </div>
    );
  }

  // Emoji / custom symbol set
  const emoji = player === 'X' ? currentSet.xIcon : currentSet.oIcon;

  return (
    <motion.div
      initial={{ scale: 0.4, rotate: -15, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: isFading ? 0.45 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`select-none flex items-center justify-center text-3xl sm:text-4xl ${
        isWinning ? 'drop-shadow-[0_0_16px_rgba(245,158,11,0.7)] scale-110' : ''
      } ${isFading ? 'animate-pulse' : ''}`}
    >
      {emoji}
    </motion.div>
  );
}

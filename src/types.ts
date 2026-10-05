export type Player = 'X' | 'O';

export type BoardState = (Player | null)[];

export type GameMode = 'pvp' | 'pve';

export type Difficulty = 'easy' | 'medium' | 'unbeatable';

export type GridSize = 3 | 4;

export type GameRule = 'classic' | 'disappearing' | 'blitz';

export type ThemeId = 'classic' | 'notebook' | 'neon' | 'wooden';

export type SymbolSetId = 'classic' | 'fire_ice' | 'animals' | 'food' | 'royalty';

export interface WinInfo {
  winner: Player | 'tie' | null;
  line: number[] | null;
}

export interface ScoreState {
  xWins: number;
  oWins: number;
  ties: number;
  currentStreak: number;
  bestStreak: number;
}

export interface MoveRecord {
  player: Player;
  index: number;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}

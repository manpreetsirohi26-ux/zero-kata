import { BoardState, Difficulty, GridSize, Player, WinInfo } from '../types';

export const WINNING_LINES_3X3: number[][] = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

export const WINNING_LINES_4X4: number[][] = [
  // Rows
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
  // Columns
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  // Diagonals
  [0, 5, 10, 15],
  [3, 6, 9, 12],
];

export function getWinningLines(gridSize: GridSize): number[][] {
  return gridSize === 4 ? WINNING_LINES_4X4 : WINNING_LINES_3X3;
}

export function checkWinner(board: BoardState, gridSize: GridSize = 3): WinInfo {
  const lines = getWinningLines(gridSize);

  for (const line of lines) {
    const first = board[line[0]];
    if (first && line.every((idx) => board[idx] === first)) {
      return { winner: first, line };
    }
  }

  const isFull = board.every((cell) => cell !== null);
  if (isFull) {
    return { winner: 'tie', line: null };
  }

  return { winner: null, line: null };
}

export function getAvailableMoves(board: BoardState): number[] {
  const moves: number[] = [];
  board.forEach((cell, index) => {
    if (cell === null) {
      moves.push(index);
    }
  });
  return moves;
}

// AI logic supporting both 3x3 and 4x4
export function getAIMove(
  board: BoardState,
  aiPlayer: Player,
  difficulty: Difficulty,
  gridSize: GridSize = 3
): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';
  const lines = getWinningLines(gridSize);

  // 1. Can AI win in one move?
  const testBoard = [...board];
  for (const move of availableMoves) {
    testBoard[move] = aiPlayer;
    if (checkWinner(testBoard, gridSize).winner === aiPlayer) {
      return move;
    }
    testBoard[move] = null;
  }

  // 2. Can Human win in one move? Block them!
  for (const move of availableMoves) {
    testBoard[move] = humanPlayer;
    if (checkWinner(testBoard, gridSize).winner === humanPlayer) {
      return move;
    }
    testBoard[move] = null;
  }

  if (difficulty === 'easy') {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // 3. Strategic positioning: take centers or strategic points
  if (gridSize === 3) {
    if (board[4] === null) return 4;

    const corners = [0, 2, 6, 8].filter((c) => availableMoves.includes(c));
    if (corners.length > 0 && (difficulty === 'unbeatable' || Math.random() < 0.7)) {
      return corners[Math.floor(Math.random() * corners.length)];
    }
  } else {
    // 4x4 inner center squares [5, 6, 9, 10]
    const centers = [5, 6, 9, 10].filter((c) => availableMoves.includes(c));
    if (centers.length > 0 && Math.random() < 0.8) {
      return centers[Math.floor(Math.random() * centers.length)];
    }
  }

  // Find move that maximizes line progress
  let bestScore = -1;
  let bestCandidate = availableMoves[0];

  for (const move of availableMoves) {
    let score = 0;
    for (const line of lines) {
      if (line.includes(move)) {
        const aiCount = line.filter((i) => board[i] === aiPlayer).length;
        const oppCount = line.filter((i) => board[i] === humanPlayer).length;
        if (oppCount === 0) {
          score += (aiCount + 1) * 2;
        } else if (aiCount === 0) {
          score += oppCount;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = move;
    }
  }

  return bestCandidate;
}

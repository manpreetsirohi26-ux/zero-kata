import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Achievement,
  BoardState,
  Difficulty,
  GameMode,
  GameRule,
  GridSize,
  MoveRecord,
  Player,
  ScoreState,
  SymbolSetId,
  ThemeId,
  WinInfo,
} from './types';
import { checkWinner, getAIMove } from './utils/gameLogic';
import { sounds } from './utils/sound';
import { announcer } from './utils/voice';
import { THEMES } from './utils/theme';
import { GameBoard } from './components/GameBoard';
import { ScoreBoard } from './components/ScoreBoard';
import { StatusBanner } from './components/StatusBanner';
import { GameControls } from './components/GameControls';
import { BlitzTimer } from './components/BlitzTimer';
import { AchievementsModal } from './components/AchievementsModal';
import { Gamepad2, Info } from 'lucide-react';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_win', title: 'First Victory', desc: 'Win your first game', icon: '🎯', unlocked: false },
  { id: 'streak_3', title: 'Hat-trick Master', desc: 'Win 3 matches in a row', icon: '🔥', unlocked: false },
  { id: 'blitz_champ', title: 'Speed Demon', desc: 'Win a Speed Blitz game', icon: '⚡', unlocked: false },
  { id: 'bot_slayer', title: 'Bot Slayer', desc: 'Defeat the Unbeatable AI', icon: '🤖', unlocked: false },
  { id: 'disappearing_master', title: 'Phantom Master', desc: 'Win in Disappearing Pieces mode', icon: '💨', unlocked: false },
  { id: 'grid_4x4', title: '4x4 Champion', desc: 'Win on the 4x4 grid', icon: '📐', unlocked: false },
];

export function App() {
  // Game Configuration State
  const [gridSize, setGridSize] = useState<GridSize>(3);
  const [rule, setRule] = useState<GameRule>('classic');
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [userPlayer, setUserPlayer] = useState<Player>('X');
  const [themeId, setThemeId] = useState<ThemeId>('classic');
  const [symbolSet, setSymbolSet] = useState<SymbolSetId>('classic');

  // Core Play State
  const [board, setBoard] = useState<BoardState>(() => Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<Player>('X');
  const [winInfo, setWinInfo] = useState<WinInfo>({ winner: null, line: null });
  const [isComputerThinking, setIsComputerThinking] = useState<boolean>(false);
  const [movesHistory, setMovesHistory] = useState<MoveRecord[]>([]);

  // Blitz Timer State
  const [timeLeft, setTimeLeft] = useState<number>(5.0);
  const blitzIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scores & Streaks
  const [scores, setScores] = useState<ScoreState>({
    xWins: 0,
    oWins: 0,
    ties: 0,
    currentStreak: 0,
    bestStreak: 0,
  });

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);

  // Audio Toggles
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  const theme = THEMES[themeId] || THEMES.classic;

  const createEmptyBoard = (size: GridSize) => Array(size * size).fill(null);

  // Unlock achievement helper
  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) =>
      prev.map((item) => {
        if (item.id === id && !item.unlocked) {
          sounds.playAchievement();
          announcer.announceAchievement(item.title);
          return { ...item, unlocked: true };
        }
        return item;
      })
    );
  }, []);

  // Reset Round
  const handleResetRound = useCallback(() => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
    setBoard(createEmptyBoard(gridSize));
    setWinInfo({ winner: null, line: null });
    setIsComputerThinking(false);
    setCurrentTurn('X');
    setMovesHistory([]);
    setTimeLeft(5.0);
    announcer.announceStart(rule);
  }, [gridSize, rule]);

  // Reset Scores
  const handleResetScores = () => {
    setScores({
      xWins: 0,
      oWins: 0,
      ties: 0,
      currentStreak: 0,
      bestStreak: 0,
    });
    handleResetRound();
  };

  // Switch Rule
  const handleRuleChange = (newRule: GameRule) => {
    setRule(newRule);
    handleResetRound();
  };

  // Switch Grid Size
  const handleGridSizeChange = (newSize: GridSize) => {
    setGridSize(newSize);
    setBoard(createEmptyBoard(newSize));
    setWinInfo({ winner: null, line: null });
    setIsComputerThinking(false);
    setCurrentTurn('X');
    setMovesHistory([]);
    setTimeLeft(5.0);
    announcer.announceStart(rule);
  };

  // Switch Mode (PVP vs PVE)
  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    handleResetRound();
  };

  // Handle Game End & Scores
  const handleGameOver = useCallback(
    (resultWinner: Player | 'tie', line: number[] | null) => {
      setWinInfo({ winner: resultWinner, line });

      if (resultWinner === 'tie') {
        sounds.playTie();
        announcer.announceTie();
        setScores((prev) => ({
          ...prev,
          ties: prev.ties + 1,
          currentStreak: 0,
        }));
      } else {
        sounds.playWin();

        const isUserWinner = gameMode === 'pvp' || resultWinner === userPlayer;
        const newStreak = isUserWinner ? scores.currentStreak + 1 : 0;
        const newBestStreak = Math.max(scores.bestStreak, newStreak);

        setScores((prev) => ({
          ...prev,
          xWins: resultWinner === 'X' ? prev.xWins + 1 : prev.xWins,
          oWins: resultWinner === 'O' ? prev.oWins + 1 : prev.oWins,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
        }));

        announcer.announceWin(resultWinner, gameMode, userPlayer, newStreak);

        // Check Achievements
        if (isUserWinner) {
          unlockAchievement('first_win');
          if (newStreak >= 3) unlockAchievement('streak_3');
          if (rule === 'blitz') unlockAchievement('blitz_champ');
          if (rule === 'disappearing') unlockAchievement('disappearing_master');
          if (gridSize === 4) unlockAchievement('grid_4x4');
          if (gameMode === 'pve' && difficulty === 'unbeatable') {
            unlockAchievement('bot_slayer');
          }
        }
      }
    },
    [gameMode, userPlayer, scores.currentStreak, scores.bestStreak, rule, gridSize, difficulty, unlockAchievement]
  );

  // Process a standard cell placement
  const makeMove = useCallback(
    (index: number, player: Player) => {
      if (board[index] || winInfo.winner) return;

      sounds.playMove(player);

      let nextBoard = [...board];
      let nextHistory = [...movesHistory, { player, index }];

      // Disappearing mode: if player now has > 3 marks, vanish their oldest mark!
      if (rule === 'disappearing') {
        const playerMoves = nextHistory.filter((m) => m.player === player);
        if (playerMoves.length > 3) {
          const oldestMove = playerMoves[0];
          nextBoard[oldestMove.index] = null;
          nextHistory = nextHistory.filter(
            (m) => !(m.player === player && m.index === oldestMove.index)
          );
          sounds.playDisappear();
          announcer.announceDisappear(player);
        }
      }

      nextBoard[index] = player;
      setBoard(nextBoard);
      setMovesHistory(nextHistory);

      // Check win condition
      const checkResult = checkWinner(nextBoard, gridSize);
      if (checkResult.winner) {
        handleGameOver(checkResult.winner, checkResult.line);
        return;
      }

      // Next turn
      const nextTurn: Player = player === 'X' ? 'O' : 'X';
      setCurrentTurn(nextTurn);
      setTimeLeft(5.0);
      announcer.announceNextTurn(nextTurn, gameMode, userPlayer);
    },
    [board, winInfo.winner, movesHistory, rule, gridSize, handleGameOver, gameMode, userPlayer]
  );

  // User click on cell
  const handleCellClick = (index: number) => {
    if (winInfo.winner || isComputerThinking) return;

    if (gameMode === 'pve' && currentTurn !== userPlayer) {
      return;
    }

    makeMove(index, currentTurn);
  };

  // Speed Blitz countdown loop
  useEffect(() => {
    if (rule !== 'blitz' || winInfo.winner) {
      if (blitzIntervalRef.current) clearInterval(blitzIntervalRef.current);
      return;
    }

    blitzIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          sounds.playTie();
          announcer.announceTimeOut(currentTurn);
          const nextTurn: Player = currentTurn === 'X' ? 'O' : 'X';
          setCurrentTurn(nextTurn);
          announcer.announceNextTurn(nextTurn, gameMode, userPlayer);
          return 5.0;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    return () => {
      if (blitzIntervalRef.current) clearInterval(blitzIntervalRef.current);
    };
  }, [rule, winInfo.winner, currentTurn, gameMode, userPlayer]);

  // AI Turn Logic
  useEffect(() => {
    if (
      gameMode === 'pve' &&
      !winInfo.winner &&
      currentTurn !== userPlayer
    ) {
      setIsComputerThinking(true);
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);

      aiTimeoutRef.current = setTimeout(() => {
        setIsComputerThinking(false);
        aiTimeoutRef.current = null;
        const aiMove = getAIMove(board, currentTurn, difficulty, gridSize);
        if (aiMove !== -1) {
          makeMove(aiMove, currentTurn);
        }
      }, 450);
    } else {
      setIsComputerThinking(false);
    }

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
    };
  }, [
    gameMode,
    winInfo.winner,
    currentTurn,
    userPlayer,
    board,
    difficulty,
    gridSize,
    makeMove,
  ]);

  return (
    <main
      id="zero-kata-app"
      className={`min-h-screen ${theme.bgClass} flex flex-col justify-between p-3 sm:p-5 antialiased transition-colors duration-300`}
    >
      <div className="w-full max-w-md mx-auto space-y-3">
        {/* Header */}
        <header id="game-header" className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/70 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Zero Kata Deluxe • Voice & Modes</span>
          </div>
          <h1
            id="game-title"
            className="text-3xl sm:text-4xl font-black tracking-tight flex items-center justify-center gap-2"
          >
            <span>Tic-Tac-Toe</span>
            <span className="text-xs sm:text-sm font-bold px-2 py-0.5 rounded-lg bg-amber-500 text-white shadow-xs">
              {gridSize}x{gridSize}
            </span>
          </h1>
        </header>

        {/* Score Board & Streak Counter */}
        <ScoreBoard
          xWins={scores.xWins}
          oWins={scores.oWins}
          ties={scores.ties}
          currentTurn={currentTurn}
          gameMode={gameMode}
          userPlayer={userPlayer}
          isGameOver={!!winInfo.winner}
          symbolSet={symbolSet}
          themeId={themeId}
          streak={scores.currentStreak}
          onOpenAchievements={() => setShowAchievementsModal(true)}
        />

        {/* Blitz Mode Countdown Progress Bar */}
        {rule === 'blitz' && !winInfo.winner && (
          <BlitzTimer timeLeft={timeLeft} maxTime={5.0} isActive={!winInfo.winner} />
        )}

        {/* Turn / Winner Status Banner */}
        <StatusBanner
          winner={winInfo.winner}
          currentTurn={currentTurn}
          isComputerThinking={isComputerThinking}
          gameMode={gameMode}
          userPlayer={userPlayer}
          rule={rule}
          symbolSet={symbolSet}
        />

        {/* Main Game Grid (3x3 or 4x4 with Themes & Custom Avatars) */}
        <GameBoard
          board={board}
          gridSize={gridSize}
          onCellClick={handleCellClick}
          winningLine={winInfo.line}
          winner={winInfo.winner}
          currentTurn={currentTurn}
          isComputerThinking={isComputerThinking}
          themeId={themeId}
          symbolSet={symbolSet}
          movesHistory={movesHistory}
          isDisappearingMode={rule === 'disappearing'}
        />

        {/* Game Rules, Opponents, Themes & Custom Avatars Controls */}
        <GameControls
          gameMode={gameMode}
          onModeChange={handleModeChange}
          rule={rule}
          onRuleChange={handleRuleChange}
          gridSize={gridSize}
          onGridSizeChange={handleGridSizeChange}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          userPlayer={userPlayer}
          onUserPlayerChange={(p) => {
            setUserPlayer(p);
            handleResetRound();
          }}
          themeId={themeId}
          onThemeChange={setThemeId}
          symbolSet={symbolSet}
          onSymbolSetChange={setSymbolSet}
          onResetRound={handleResetRound}
          onResetScores={handleResetScores}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            sounds.enabled = next;
          }}
          voiceEnabled={voiceEnabled}
          onToggleVoice={() => {
            const next = !voiceEnabled;
            setVoiceEnabled(next);
            announcer.enabled = next;
            if (next) announcer.speak('Voice commentary active');
          }}
          isGameOver={!!winInfo.winner}
        />

        {/* Rule Helper Footer */}
        <footer id="game-footer" className="text-center pt-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <Info className="w-3.5 h-3.5" />
            <span>
              {gridSize === 4
                ? 'Align 4 in a row to win on 4x4 grid!'
                : rule === 'disappearing'
                ? 'Max 3 marks per player! 4th mark removes your oldest piece.'
                : 'Align 3 in a row (horizontal, vertical, or diagonal) to win!'}
            </span>
          </div>
        </footer>
      </div>

      {/* Badges & Achievements Modal */}
      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        achievements={achievements}
        streak={scores.currentStreak}
        bestStreak={scores.bestStreak}
      />
    </main>
  );
}
export default App;

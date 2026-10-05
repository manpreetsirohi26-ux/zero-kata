import { useState } from 'react';
import { Difficulty, GameMode, GameRule, GridSize, Player, SymbolSetId, ThemeId } from '../types';
import { SYMBOL_SETS } from './Symbols';
import { THEMES } from '../utils/theme';
import { sounds } from '../utils/sound';
import {
  RotateCcw,
  Users,
  Bot,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RefreshCw,
  Palette,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface GameControlsProps {
  gameMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  rule: GameRule;
  onRuleChange: (rule: GameRule) => void;
  gridSize: GridSize;
  onGridSizeChange: (size: GridSize) => void;
  difficulty: Difficulty;
  onDifficultyChange: (diff: Difficulty) => void;
  userPlayer: Player;
  onUserPlayerChange: (player: Player) => void;
  themeId: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  symbolSet: SymbolSetId;
  onSymbolSetChange: (set: SymbolSetId) => void;
  onResetRound: () => void;
  onResetScores: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  isGameOver: boolean;
}

export function GameControls({
  gameMode,
  onModeChange,
  rule,
  onRuleChange,
  gridSize,
  onGridSizeChange,
  difficulty,
  onDifficultyChange,
  userPlayer,
  onUserPlayerChange,
  themeId,
  onThemeChange,
  symbolSet,
  onSymbolSetChange,
  onResetRound,
  onResetScores,
  soundEnabled,
  onToggleSound,
  voiceEnabled,
  onToggleVoice,
  isGameOver,
}: GameControlsProps) {
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false);

  const ruleOptions: { id: GameRule; label: string; icon: string; desc: string }[] = [
    { id: 'classic', label: 'Classic', icon: '🎯', desc: 'Standard rules' },
    { id: 'disappearing', label: 'Disappearing', icon: '🔥', desc: 'Max 3 marks' },
    { id: 'blitz', label: 'Speed Blitz', icon: '⚡', desc: '5s turn timer' },
  ];

  return (
    <div id="game-controls-container" className="w-full max-w-md mx-auto space-y-3">
      {/* Primary Action Buttons Bar */}
      <div className="flex items-center gap-2">
        <button
          id="btn-reset-round"
          type="button"
          onClick={() => {
            sounds.playClick();
            onResetRound();
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 ${
            isGameOver
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-500/40 shadow-md'
              : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isGameOver ? 'Next Round' : 'New Round'}</span>
        </button>

        {/* Voice Commentary Toggle */}
        <button
          id="btn-voice-toggle"
          type="button"
          onClick={onToggleVoice}
          title={voiceEnabled ? 'Mute Voice Commentary' : 'Unmute Voice Commentary'}
          className={`p-3 border rounded-xl transition-colors shadow-sm flex items-center gap-1.5 ${
            voiceEnabled
              ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 text-purple-600 dark:text-purple-300 font-semibold'
              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
          }`}
        >
          {voiceEnabled ? <Mic className="w-5 h-5 text-purple-600 dark:text-purple-400" /> : <MicOff className="w-5 h-5 text-zinc-400" />}
        </button>

        {/* Sound SFX Toggle */}
        <button
          id="btn-sound-toggle"
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute Sound SFX' : 'Unmute Sound SFX'}
          className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 transition-colors shadow-sm"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-5 h-5 text-zinc-400" />}
        </button>

        {/* Reset Scores */}
        <button
          id="btn-reset-scores"
          type="button"
          onClick={() => {
            sounds.playClick();
            onResetScores();
          }}
          title="Reset Scores"
          className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shadow-sm"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Game Rule Modes Selector (Classic, Disappearing, Blitz) */}
      <div className="bg-zinc-100 dark:bg-zinc-900/60 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
        <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Game Rule
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {ruleOptions.map((opt) => (
            <button
              key={opt.id}
              id={`rule-btn-${opt.id}`}
              type="button"
              onClick={() => {
                sounds.playClick();
                onRuleChange(opt.id);
              }}
              className={`p-2 rounded-xl text-left border transition-all ${
                rule === opt.id
                  ? 'bg-white dark:bg-zinc-800 border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'bg-transparent border-transparent hover:bg-white/60 dark:hover:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                {opt.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Opponent Mode (Pass & Play vs AI) & Grid Size */}
      <div className="bg-zinc-100 dark:bg-zinc-900/60 p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          {/* 2 Players */}
          <button
            id="tab-mode-pvp"
            type="button"
            onClick={() => {
              sounds.playClick();
              onModeChange('pvp');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              gameMode === 'pvp'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-500" />
            <span>2 Players (PVP)</span>
          </button>

          {/* vs Computer */}
          <button
            id="tab-mode-pve"
            type="button"
            onClick={() => {
              sounds.playClick();
              onModeChange('pve');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              gameMode === 'pve'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-500" />
            <span>vs Computer (AI)</span>
          </button>
        </div>

        {/* Grid Size (3x3 vs 4x4) */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-200 dark:border-zinc-800">
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">Grid Size:</span>
          <div className="flex bg-zinc-200 dark:bg-zinc-800 p-0.5 rounded-lg">
            <button
              id="grid-size-3"
              type="button"
              onClick={() => {
                sounds.playClick();
                onGridSizeChange(3);
              }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                gridSize === 3
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-300'
              }`}
            >
              3x3 Classic
            </button>
            <button
              id="grid-size-4"
              type="button"
              onClick={() => {
                sounds.playClick();
                onGridSizeChange(4);
              }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                gridSize === 4
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-300'
              }`}
            >
              4x4 Grid
            </button>
          </div>
        </div>

        {/* AI Settings Sub-panel if PvE */}
        {gameMode === 'pve' && (
          <div id="ai-settings-subpanel" className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            {/* Choose side */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Play as:</span>
              <div className="flex bg-zinc-200 dark:bg-zinc-800 p-0.5 rounded-lg">
                <button
                  id="choose-player-x"
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onUserPlayerChange('X');
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    userPlayer === 'X'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900'
                  }`}
                >
                  Player X
                </button>
                <button
                  id="choose-player-o"
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onUserPlayerChange('O');
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    userPlayer === 'O'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900'
                  }`}
                >
                  Player O
                </button>
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">AI Difficulty:</span>
              <div className="flex bg-zinc-200 dark:bg-zinc-800 p-0.5 rounded-lg gap-0.5">
                {(['easy', 'medium', 'unbeatable'] as Difficulty[]).map((level) => {
                  const labels: Record<Difficulty, string> = {
                    easy: 'Easy',
                    medium: 'Medium',
                    unbeatable: 'Unbeatable',
                  };
                  return (
                    <button
                      key={level}
                      id={`difficulty-${level}`}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onDifficultyChange(level);
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        difficulty === level
                          ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                      }`}
                    >
                      {labels[level]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Themes & Custom Avatars Dropdown Accordion */}
      <div className="bg-zinc-100 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowCustomizer(!showCustomizer)}
          className="w-full py-2.5 px-3.5 flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-purple-500" />
            <span>Themes & Custom Avatars</span>
          </span>
          {showCustomizer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showCustomizer && (
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 space-y-3 text-xs">
            {/* Theme selector */}
            <div className="space-y-1.5">
              <span className="text-zinc-500 dark:text-zinc-400 font-semibold block">Board Theme:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(THEMES) as ThemeId[]).map((tid) => {
                  const t = THEMES[tid];
                  return (
                    <button
                      key={tid}
                      id={`theme-btn-${tid}`}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onThemeChange(tid);
                      }}
                      className={`p-2 rounded-xl text-left border flex items-center gap-2 transition-all ${
                        themeId === tid
                          ? 'bg-white dark:bg-zinc-800 border-purple-500 ring-2 ring-purple-500/20 shadow-xs font-bold'
                          : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      <span className="text-lg">{t.icon}</span>
                      <span className="truncate">{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Symbol / Emoji Avatar selector */}
            <div className="space-y-1.5">
              <span className="text-zinc-500 dark:text-zinc-400 font-semibold block">Piece Symbols:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {SYMBOL_SETS.map((set) => (
                  <button
                    key={set.id}
                    id={`symbol-btn-${set.id}`}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onSymbolSetChange(set.id);
                    }}
                    className={`p-2 rounded-xl text-left border flex items-center justify-between transition-all ${
                      symbolSet === set.id
                        ? 'bg-white dark:bg-zinc-800 border-purple-500 ring-2 ring-purple-500/20 shadow-xs font-bold'
                        : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <span className="truncate text-[11px]">{set.name}</span>
                    <span className="text-sm shrink-0">
                      {set.xIcon} {set.oIcon}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

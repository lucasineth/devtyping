import React from 'react';
import { 
  Code2, 
  Volume2, 
  VolumeX, 
  Trophy, 
  PlusCircle, 
  Keyboard as KeyboardIcon,
  RotateCcw,
  Sparkles,
  Zap,
  Sliders
} from 'lucide-react';
import { LanguageId, DifficultyLevel, SoundMode } from '../types';
import { DEFAULT_TRACKS } from '../data/challenges';

interface HeaderProps {
  currentLanguage: LanguageId;
  currentDifficulty: DifficultyLevel;
  soundMode: SoundMode;
  showKeyboard: boolean;
  onSelectLanguage: (lang: LanguageId) => void;
  onSelectDifficulty: (diff: DifficultyLevel) => void;
  onToggleSound: () => void;
  onToggleKeyboard: () => void;
  onOpenLeaderboard: () => void;
  onOpenCustomSnippets: () => void;
  onRestartGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  currentDifficulty,
  soundMode,
  showKeyboard,
  onSelectLanguage,
  onSelectDifficulty,
  onToggleSound,
  onToggleKeyboard,
  onOpenLeaderboard,
  onOpenCustomSnippets,
  onRestartGame
}) => {
  return (
    <header className="w-full bg-[#161922]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold text-lg ring-1 ring-white/20">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
                Dev<span className="text-cyan-400">Typing</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> Memória Muscular
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans hidden sm:block">
              Treine digitação de sintaxe &amp; comandos em tempo real
            </p>
          </div>
        </div>

        {/* Track & Language Selector */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
          <div className="flex items-center bg-[#0d1017] p-1 rounded-xl border border-slate-800">
            {DEFAULT_TRACKS.map((track) => {
              const isSelected = currentLanguage === track.id;
              return (
                <button
                  key={track.id}
                  id={`track-btn-${track.id}`}
                  onClick={() => onSelectLanguage(track.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                  title={track.description}
                >
                  <span>{track.icon}</span>
                  <span className="hidden md:inline">{track.name}</span>
                  <span className="md:hidden">
                    {track.id === 'js-classic' ? 'JS Guia' : track.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
            <button
              id="track-btn-custom"
              onClick={onOpenCustomSnippets}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                currentLanguage === 'custom'
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title="Criar ou treinar com seus próprios códigos"
            >
              <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>Personalizado</span>
            </button>
          </div>
        </div>

        {/* Difficulty & Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Difficulty Chips */}
          <div className="hidden lg:flex items-center bg-[#0d1017] p-1 rounded-xl border border-slate-800 text-xs">
            {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => {
              const isSelected = currentDifficulty === level;
              const labels = { easy: 'Fácil', medium: 'Médio', hard: 'Sênior' };
              const colors = {
                easy: isSelected ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'text-slate-400',
                medium: isSelected ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'text-slate-400',
                hard: isSelected ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'text-slate-400',
              };
              return (
                <button
                  key={level}
                  id={`diff-btn-${level}`}
                  onClick={() => onSelectDifficulty(level)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all border border-transparent cursor-pointer ${colors[level]}`}
                >
                  {labels[level]}
                </button>
              );
            })}
          </div>

          {/* Sound Mode Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundMode !== 'mute'
                ? 'bg-slate-800/80 text-cyan-300 border-slate-700 hover:bg-slate-700/80'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title={`Som do Teclado: ${soundMode === 'mute' ? 'Mudo' : soundMode}`}
          >
            {soundMode === 'mute' ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {/* Virtual Keyboard Toggle */}
          <button
            id="keyboard-toggle-btn"
            onClick={onToggleKeyboard}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              showKeyboard
                ? 'bg-slate-800/80 text-cyan-300 border-slate-700'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title="Mostrar Teclado Visual de Digitação"
          >
            <KeyboardIcon className="w-4 h-4" />
          </button>

          {/* Leaderboard Button */}
          <button
            id="leaderboard-btn"
            onClick={onOpenLeaderboard}
            className="p-2 rounded-xl bg-slate-800/80 text-amber-300 border border-slate-700 hover:bg-slate-700/80 transition-all cursor-pointer"
            title="Ranking e Melhores Pontuações"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Restart Button */}
          <button
            id="quick-restart-btn"
            onClick={onRestartGame}
            className="p-2 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/30 transition-all cursor-pointer"
            title="Reiniciar Desafio (ou pressione Esc)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

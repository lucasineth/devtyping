import React from 'react';
import { Timer, Gauge, Target, AlertTriangle, Layers, ArrowLeft, RotateCcw, Volume2, VolumeX, Swords, User, Users } from 'lucide-react';
import { GameMetrics, GameStatus, SoundMode, GameMode } from '../types';

interface GameTopBarProps {
  currentPhase: number;
  totalPhases: number;
  phaseTitle: string;
  trackName: string;
  metrics: GameMetrics;
  gameStatus: GameStatus;
  soundMode: SoundMode;
  penaltyAnimation: boolean;
  gameMode?: GameMode;
  activePlayerIndex?: 1 | 2;
  player1Name?: string;
  player2Name?: string;
  player1TargetTime?: number | null;
  onBackToMenu: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const GameTopBar: React.FC<GameTopBarProps> = ({
  currentPhase,
  totalPhases,
  phaseTitle,
  trackName,
  metrics,
  gameStatus,
  soundMode,
  penaltyAnimation,
  gameMode = 'solo',
  activePlayerIndex = 1,
  player1Name = 'Dev 1',
  player2Name = 'Dev 2',
  player1TargetTime = null,
  onBackToMenu,
  onRestart,
  onToggleSound
}) => {
  const currentPlayerName = activePlayerIndex === 1 ? player1Name : player2Name;

  return (
    <div className="w-full bg-[#141722]/95 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-3 mb-6">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Back to Menu & Track / Player Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            title="Voltar para seleção de linguagem"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Menu</span>
          </button>

          <div className="border-l border-slate-800 pl-3">
            {gameMode === 'dual' ? (
              <div className="flex items-center gap-2">
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  activePlayerIndex === 1 
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' 
                    : 'bg-purple-950 text-purple-300 border border-purple-700'
                }`}>
                  <Swords className="w-3 h-3" />
                  <span>Vez de: {currentPlayerName} (Rodada {activePlayerIndex}/2)</span>
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  Fase {currentPhase + 1} de {totalPhases}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-xs font-bold text-cyan-400 block sm:inline mr-2">
                  {trackName}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Fase {currentPhase + 1} de {totalPhases}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Live Timer (Count UP) with +5s Penalty Alert */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-2 bg-[#0a0d14] px-4 py-1.5 rounded-xl border border-slate-800 shadow-inner">
            <Timer className="w-4 h-4 text-cyan-400" />
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                {gameMode === 'dual' ? `Tempo de ${currentPlayerName}` : 'Tempo Total'}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
                {formatTime(metrics.timeElapsed)}
              </span>
            </div>

            {/* Floating +5s Penalty Badge */}
            {penaltyAnimation && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold font-mono text-xs shadow-lg shadow-rose-600/50 animate-bounce">
                +5s Penalidade!
              </div>
            )}
          </div>

          {/* If Player 2 in Dual Mode: Show Target Time to beat! */}
          {gameMode === 'dual' && activePlayerIndex === 2 && player1TargetTime !== null && (
            <div className="hidden md:flex flex-col items-center px-3 py-1 bg-amber-950/30 border border-amber-800/60 rounded-xl text-[11px] font-mono">
              <span className="text-amber-400 font-bold">Tempo do {player1Name}:</span>
              <span className="text-white font-black">{formatTime(player1TargetTime)} ({player1TargetTime}s)</span>
            </div>
          )}
        </div>

        {/* Right: Metrics & Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 bg-[#0a0d14] px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            <div className="text-slate-400 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-bold text-white">{metrics.wpm}</span> WPM
            </div>
            <div className="text-slate-600">|</div>
            <div className="text-slate-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-emerald-400">{metrics.accuracy}%</span>
            </div>
            {metrics.penaltySeconds > 0 && (
              <>
                <div className="text-slate-600">|</div>
                <div className="text-rose-400 font-bold">
                  +{metrics.penaltySeconds}s pen.
                </div>
              </>
            )}
          </div>

          <button
            onClick={onToggleSound}
            className="p-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer flex items-center gap-1 text-xs"
            title={`Som: ${soundMode === 'mechanical' ? 'Mecânico' : soundMode === 'soft' ? 'Suave' : soundMode === 'click' ? 'Click' : 'Mudo'}`}
          >
            {soundMode === 'mute' ? (
              <VolumeX className="w-4 h-4 text-slate-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            )}
            <span className="text-[10px] hidden md:inline text-slate-400">
              {soundMode === 'mechanical' ? 'Mecânico' : soundMode === 'soft' ? 'Suave' : soundMode === 'click' ? 'Click' : 'Mudo'}
            </span>
          </button>

          <button
            onClick={onRestart}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title="Reiniciar Desafio"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

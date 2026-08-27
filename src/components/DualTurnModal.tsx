import React from 'react';
import { Swords, User, Play, Trophy, Timer, AlertTriangle, Gauge } from 'lucide-react';
import { GameMetrics } from '../types';
import { formatTime } from './StatsBar';

interface DualTurnModalProps {
  isOpen: boolean;
  player1Name: string;
  player2Name: string;
  player1Metrics: GameMetrics;
  onStartPlayer2Turn: () => void;
  onBackToMenu: () => void;
}

export const DualTurnModal: React.FC<DualTurnModalProps> = ({
  isOpen,
  player1Name,
  player2Name,
  player1Metrics,
  onStartPlayer2Turn,
  onBackToMenu
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#141722] border border-slate-700/80 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative overflow-hidden text-center">
        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 bg-purple-500" />

        <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25">
          <Swords className="w-7 h-7" />
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Fim da 1ª Rodada!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          <strong className="text-cyan-400">{player1Name}</strong> finalizou todos os desafios.
        </p>

        {/* Player 1 summary card */}
        <div className="my-4 p-4 rounded-xl bg-[#0e1118] border border-cyan-500/30 text-center">
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block mb-1">
            Tempo a bater de {player1Name}
          </span>
          <div className="text-3xl sm:text-4xl font-black font-mono text-white">
            {formatTime(player1Metrics.timeElapsed)}{' '}
            <span className="text-base text-slate-400 font-bold font-sans">({player1Metrics.timeElapsed}s)</span>
          </div>

          <div className="flex items-center justify-center gap-4 mt-2 text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-2">
            <div>
              <span>Velocidade:</span> <strong className="text-cyan-300">{player1Metrics.wpm} WPM</strong>
            </div>
            <div>•</div>
            <div>
              <span>Penalidades:</span> <strong className="text-rose-400">+{player1Metrics.penaltySeconds}s</strong>
            </div>
          </div>
        </div>

        {/* Next Player Call to Action */}
        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/50 mb-5 text-xs text-purple-200 text-left flex items-start gap-2.5">
          <span className="text-lg">🎯</span>
          <div>
            <span className="font-bold block text-white">Vez de {player2Name}:</span>
            <span>
              Passe o teclado para <strong className="text-purple-300">{player2Name}</strong>. Faça o menor tempo possível e evite erros (+5s cada) para vencer!
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBackToMenu}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            Abandonar Duelo
          </button>

          <button
            id="start-player-2-turn-btn"
            onClick={onStartPlayer2Turn}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Iniciar Rodada de {player2Name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

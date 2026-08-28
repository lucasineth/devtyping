import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Award, 
  Gauge, 
  Target, 
  Timer, 
  Sparkles, 
  Share2,
  CheckCircle2,
  ArrowLeft,
  Flame,
  AlertTriangle,
  Swords,
  Crown,
  User,
  Users
} from 'lucide-react';
import { GameMetrics, CodeChallenge, DifficultyLevel, GameMode, DualMatchResult } from '../types';
import { formatTime } from './StatsBar';

interface ResultModalProps {
  isOpen: boolean;
  isWin: boolean;
  isNewRecord?: boolean;
  gameMode: GameMode;
  metrics: GameMetrics;
  dualResult: DualMatchResult | null;
  completedPhases: number;
  totalPhases: number;
  challenges: CodeChallenge[];
  languageName: string;
  difficulty: DifficultyLevel;
  onRestart: () => void;
  onBackToMenu: () => void;
  onOpenLeaderboard: () => void;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  isWin,
  isNewRecord = false,
  gameMode,
  metrics,
  dualResult,
  completedPhases,
  totalPhases,
  challenges,
  languageName,
  difficulty,
  onRestart,
  onBackToMenu,
  onOpenLeaderboard,
  onClose
}) => {
  useEffect(() => {
    if (isOpen && (isWin || gameMode === 'dual')) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#22d3ee', '#38bdf8', '#34d399', '#f59e0b', '#a855f7', '#ec4899']
      });
    }
  }, [isOpen, isWin, gameMode]);

  if (!isOpen) return null;

  const isDual = gameMode === 'dual' && dualResult;
  const rawTimeSeconds = Math.max(0, metrics.timeElapsed - metrics.penaltySeconds);

  // Solo Badges
  const badges: { title: string; icon: string }[] = [];
  if (isWin) {
    badges.push({ title: '5 Fases Concluídas', icon: '🏆' });
  }
  if (metrics.penaltySeconds === 0) {
    badges.push({ title: 'Zero Penalidades', icon: '⚡' });
  }
  if (metrics.accuracy >= 98) {
    badges.push({ title: 'Precisão 98%+', icon: '🎯' });
  }
  if (metrics.wpm >= 50) {
    badges.push({ title: 'Velocista (50+ WPM)', icon: '🚀' });
  }

  const handleCopyResult = () => {
    let text = '';
    if (isDual) {
      const winnerName = dualResult.winner === 'player1' 
        ? dualResult.player1.name 
        : dualResult.winner === 'player2' 
        ? dualResult.player2.name 
        : 'Empate';
      text = `⚔️ DevTyping — Duelo 1v1!\nTrilha: ${languageName}\n👑 Vencedor: ${winnerName}\n\n👤 ${dualResult.player1.name}: ${formatTime(dualResult.player1.metrics.timeElapsed)} (${dualResult.player1.metrics.timeElapsed}s) | ${dualResult.player1.metrics.wpm} WPM | +${dualResult.player1.metrics.penaltySeconds}s pen.\n👤 ${dualResult.player2.name}: ${formatTime(dualResult.player2.metrics.timeElapsed)} (${dualResult.player2.metrics.timeElapsed}s) | ${dualResult.player2.metrics.wpm} WPM | +${dualResult.player2.metrics.penaltySeconds}s pen.`;
    } else {
      text = `🎮 DevTyping — Placar Final!\nTrilha: ${languageName}\n⏱️ Tempo Total: ${formatTime(metrics.timeElapsed)} (${metrics.timeElapsed}s)\n⚡ Velocidade: ${metrics.wpm} WPM | 🎯 Precisão: ${metrics.accuracy}%\n❌ Penalidades: +${metrics.penaltySeconds}s (${metrics.errorsCount} erros)\n🏆 Concluído: ${completedPhases}/${totalPhases} fases!`;
    }
    navigator.clipboard?.writeText(text);
    alert('Placar copiado com sucesso para a área de transferência!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-[#141722] border border-slate-700/80 rounded-2xl p-4 sm:p-6 max-w-4xl w-full shadow-2xl relative overflow-hidden my-auto max-h-[92vh] flex flex-col justify-between">
        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 bg-cyan-500" />

        {/* Top Header - Compact */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center shadow-md shadow-amber-500/20 font-bold">
              {isDual ? <Swords className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                {isDual ? 'Resultado do Duelo 1v1' : 'Placar Final dos Desafios'}
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-normal">
                  {languageName}
                </span>
              </h2>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            {totalPhases} de {totalPhases} Fases Concluídas
          </div>
        </div>

        {/* Solo record banner if new personal record */}
        {!isDual && isWin && isNewRecord && (
          <div className="mb-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 border border-amber-500/50 flex items-center justify-center gap-2 text-amber-300 font-extrabold text-xs sm:text-sm animate-pulse relative z-10 shadow-lg shadow-amber-500/10">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>🎉 NOVO RECORDE PESSOAL NESTA TRILHA! ({metrics.timeElapsed}s)</span>
          </div>
        )}

        {/* MAIN BODY: HORIZONTAL 2-COLUMN LAYOUT */}
        {isDual ? (
          /* DUAL MODE RESULT (1v1 BATTLE COMPARISON) */
          <div className="space-y-3 relative z-10">
            {/* Winner Banner */}
            <div className={`p-3.5 rounded-xl border text-center relative overflow-hidden ${
              dualResult.winner === 'tie'
                ? 'bg-purple-950/40 border-purple-600/50 text-purple-200'
                : 'bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-amber-950/40 border-amber-500/50 text-amber-200'
            }`}>
              <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-extrabold">
                <Crown className="w-5 h-5 text-amber-400 animate-bounce" />
                <span>
                  {dualResult.winner === 'player1' && `Vitória de ${dualResult.player1.name}!`}
                  {dualResult.winner === 'player2' && `Vitória de ${dualResult.player2.name}!`}
                  {dualResult.winner === 'tie' && 'Empate Incrível!'}
                </span>
              </div>
              {dualResult.winner !== 'tie' && (
                <div className="text-xs text-amber-300/80 font-mono mt-0.5">
                  Diferença de tempo: {Math.abs(dualResult.player1.metrics.timeElapsed - dualResult.player2.metrics.timeElapsed)}s
                </div>
              )}
            </div>

            {/* Side by Side Players Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Player 1 Card */}
              <div className={`p-3.5 rounded-xl border relative ${
                dualResult.winner === 'player1'
                  ? 'bg-[#172030] border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/30'
                  : 'bg-[#0f121a] border-slate-800'
              }`}>
                {dualResult.winner === 'player1' && (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-cyan-500 text-black text-[10px] font-bold">
                    VENCEDOR 👑
                  </span>
                )}
                <div className="flex items-center gap-2 mb-2 font-bold text-white text-sm">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>{dualResult.player1.name}</span>
                </div>

                <div className="mb-2 p-2 rounded-lg bg-[#080a0f] border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Tempo Total</span>
                  <span className="text-2xl font-black font-mono text-cyan-300">
                    {formatTime(dualResult.player1.metrics.timeElapsed)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono ml-1">
                    ({dualResult.player1.metrics.timeElapsed}s)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-mono">
                  <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                    <div className="text-[9px] text-slate-400">WPM</div>
                    <div className="font-bold text-white">{dualResult.player1.metrics.wpm}</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                    <div className="text-[9px] text-slate-400">Precisão</div>
                    <div className="font-bold text-emerald-400">{dualResult.player1.metrics.accuracy}%</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                    <div className="text-[9px] text-slate-400">Penalidades</div>
                    <div className="font-bold text-rose-400">+{dualResult.player1.metrics.penaltySeconds}s</div>
                  </div>
                </div>
              </div>

              {/* Player 2 Card */}
              <div className={`p-3.5 rounded-xl border relative ${
                dualResult.winner === 'player2'
                  ? 'bg-[#221a30] border-purple-500/80 shadow-lg shadow-purple-500/10 ring-1 ring-purple-400/30'
                  : 'bg-[#0f121a] border-slate-800'
              }`}>
                {dualResult.winner === 'player2' && (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-bold">
                    VENCEDOR 👑
                  </span>
                )}
                <div className="flex items-center gap-2 mb-2 font-bold text-white text-sm">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>{dualResult.player2.name}</span>
                </div>

                <div className="mb-2 p-2 rounded-lg bg-[#080a0f] border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Tempo Total</span>
                  <span className="text-2xl font-black font-mono text-purple-300">
                    {formatTime(dualResult.player2.metrics.timeElapsed)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono ml-1">
                    ({dualResult.player2.metrics.timeElapsed}s)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-mono">
                  <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                    <div className="text-[9px] text-slate-400">WPM</div>
                    <div className="font-bold text-white">{dualResult.player2.metrics.wpm}</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                    <div className="text-[9px] text-slate-400">Precisão</div>
                    <div className="font-bold text-emerald-400">{dualResult.player2.metrics.accuracy}%</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                    <div className="text-[9px] text-slate-400">Penalidades</div>
                    <div className="font-bold text-rose-400">+{dualResult.player2.metrics.penaltySeconds}s</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* SOLO MODE RESULT (HORIZONTAL 2 COLUMNS) */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 relative z-10">
            {/* Left Column: Big Time & Breakdown (5 cols) */}
            <div className="md:col-span-5 bg-gradient-to-b from-[#182332] to-[#0f1522] border border-cyan-500/40 rounded-xl p-3.5 flex flex-col justify-between shadow-lg shadow-cyan-500/10">
              <div>
                <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Timer className="w-3.5 h-3.5 text-cyan-400" />
                  Tempo Total Final
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight my-1">
                  {formatTime(metrics.timeElapsed)}{' '}
                  <span className="text-base text-slate-400 font-bold font-sans">({metrics.timeElapsed}s)</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tempo de Digitação:</span>
                  <strong className="text-slate-200">{rawTimeSeconds}s</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-400">Penalidades ({metrics.errorsCount} erros):</span>
                  <strong className="text-rose-400">+{metrics.penaltySeconds}s</strong>
                </div>
              </div>
            </div>

            {/* Right Column: Key Metrics & Badges (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-between gap-2.5">
              {/* 3 Metric Cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-[#0d1017] rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                    <Gauge className="w-3 h-3 text-cyan-400" /> WPM
                  </div>
                  <div className="text-xl font-black text-cyan-400 font-mono">
                    {metrics.wpm}
                  </div>
                  <div className="text-[9px] text-slate-400">{metrics.cpm} CPM</div>
                </div>

                <div className="p-2.5 bg-[#0d1017] rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                    <Target className="w-3 h-3 text-emerald-400" /> Precisão
                  </div>
                  <div className="text-xl font-black text-emerald-400 font-mono">
                    {metrics.accuracy}%
                  </div>
                  <div className="text-[9px] text-slate-400">{metrics.correctChars}/{metrics.totalChars} carac.</div>
                </div>

                <div className="p-2.5 bg-[#0d1017] rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-400" /> Erros
                  </div>
                  <div className="text-xl font-black text-rose-400 font-mono">
                    {metrics.errorsCount}
                  </div>
                  <div className="text-[9px] text-rose-400 font-semibold">+{metrics.penaltySeconds}s pen.</div>
                </div>
              </div>

              {/* Badges and summary in horizontal chips */}
              <div className="bg-[#0e1117] p-2.5 rounded-xl border border-slate-800 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                  Conquistas:
                </span>
                {badges.map((b, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px] text-slate-200 flex items-center gap-1 font-medium"
                  >
                    <span>{b.icon}</span>
                    <span>{b.title}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ACTION BUTTONS (Clean Horizontal Bar) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 mt-3 border-t border-slate-800 relative z-10">
          <div className="flex items-center gap-2">
            <button
              id="result-menu-btn"
              onClick={onBackToMenu}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>Voltar ao Menu</span>
            </button>

            <button
              id="result-leaderboard-btn"
              onClick={onOpenLeaderboard}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Ver Placar</span>
            </button>

            {/* <button
              id="result-share-btn"
              onClick={handleCopyResult}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1 cursor-pointer transition-all"
              title="Copiar Placar"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copiar</span>
            </button> */}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="result-play-again-btn"
              onClick={onRestart}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isDual ? 'Revanche 1v1' : 'Jogar Novamente'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

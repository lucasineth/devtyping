import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Trash2, 
  X, 
  Gauge, 
  Target, 
  Calendar, 
  Award, 
  Timer, 
  AlertTriangle, 
  Swords, 
  Crown, 
  Zap, 
  CheckCircle2, 
  Flame,
  Filter,
  ArrowUpDown,
  History,
  TrendingUp
} from 'lucide-react';
import { ScoreRecord, LanguageId } from '../types';
import { DEFAULT_TRACKS } from '../data/challenges';
import { formatTime } from './StatsBar';

interface LeaderboardModalProps {
  isOpen: boolean;
  scores: ScoreRecord[];
  onClearScores: () => void;
  onDeleteScore?: (id: string) => void;
  onClose: () => void;
}

type SortMode = 'best_time' | 'best_wpm' | 'recent';

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  scores,
  onClearScores,
  onDeleteScore,
  onClose
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [sortMode, setSortMode] = useState<SortMode>('best_time');
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  // Available tracks for filter
  const filterOptions = useMemo(() => {
    const list = [
      { id: 'all', name: 'Todas as Trilhas', icon: '🌐' },
      ...DEFAULT_TRACKS.map(t => ({ id: t.id, name: t.name, icon: t.icon })),
      { id: 'custom', name: 'Personalizado', icon: '✨' }
    ];
    return list;
  }, []);

  // Filtered dataset
  const filteredScores = useMemo(() => {
    if (selectedFilter === 'all') return scores;
    return scores.filter(s => s.categoryId === selectedFilter);
  }, [scores, selectedFilter]);

  // Sorted dataset according to active SortMode
  const sortedScores = useMemo(() => {
    const list = [...filteredScores];

    if (sortMode === 'best_time') {
      // 1st: completed full phases (won = true) first
      // 2nd: lower timeElapsed is better (fastest)
      // 3rd: higher wpm
      return list.sort((a, b) => {
        if (a.won && !b.won) return -1;
        if (!a.won && b.won) return 1;
        if (a.timeElapsed !== b.timeElapsed) {
          return a.timeElapsed - b.timeElapsed;
        }
        return b.wpm - a.wpm;
      });
    } else if (sortMode === 'best_wpm') {
      // highest WPM first
      return list.sort((a, b) => b.wpm - a.wpm);
    } else {
      // recent: chronologically by insertion (id with timestamp)
      return list;
    }
  }, [filteredScores, sortMode]);

  // Calculated track / global stats
  const stats = useMemo(() => {
    const completed = filteredScores.filter(s => s.won);
    const bestTime = completed.length > 0 
      ? Math.min(...completed.map(s => s.timeElapsed)) 
      : 0;
    const bestWpm = filteredScores.reduce((max, cur) => Math.max(max, cur.wpm), 0);
    const avgAccuracy = filteredScores.length > 0 
      ? Math.round(filteredScores.reduce((sum, cur) => sum + cur.accuracy, 0) / filteredScores.length) 
      : 0;
    const totalDuelWins = filteredScores.filter(s => s.gameMode === 'dual' && s.isDuelWinner).length;

    return {
      totalGames: filteredScores.length,
      bestTime,
      bestWpm,
      avgAccuracy,
      totalDuelWins
    };
  }, [filteredScores]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#141722] border border-slate-700/80 rounded-3xl p-4 sm:p-6 max-w-2xl w-full shadow-2xl relative max-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-15 bg-amber-500" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Placar &amp; Melhores Tempos
              </h2>
              <p className="text-xs text-slate-400">
                Recordes de velocidade, menor tempo e histórico salvos localmente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Stats Bar */}
        <div className="grid grid-cols-3 gap-2 my-3 relative z-10">
          <div className="bg-[#0c0f16] p-2.5 rounded-2xl border border-slate-800 text-center shadow-sm">
            <div className="text-[10px] text-amber-400 uppercase font-bold tracking-wider flex items-center justify-center gap-1">
              <Crown className="w-3 h-3" /> Melhor Tempo
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-amber-300 my-0.5">
              {stats.bestTime > 0 ? `${stats.bestTime}s` : '--'}
            </div>
            <div className="text-[9px] text-slate-400 font-mono">
              {stats.bestTime > 0 ? formatTime(stats.bestTime) : 'Nenhum tempo'}
            </div>
          </div>

          <div className="bg-[#0c0f16] p-2.5 rounded-2xl border border-slate-800 text-center shadow-sm">
            <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider flex items-center justify-center gap-1">
              <Gauge className="w-3 h-3" /> Recorde WPM
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-cyan-400 my-0.5">
              {stats.bestWpm > 0 ? stats.bestWpm : '--'}
            </div>
            <div className="text-[9px] text-slate-400 font-mono">
              {stats.bestWpm > 0 ? `${Math.round(stats.bestWpm * 5)} CPM` : 'Palavras/minuto'}
            </div>
          </div>

          <div className="bg-[#0c0f16] p-2.5 rounded-2xl border border-slate-800 text-center shadow-sm">
            <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider flex items-center justify-center gap-1">
              <Target className="w-3 h-3" /> Precisão Média
            </div>
            <div className="text-xl sm:text-2xl font-mono font-black text-emerald-400 my-0.5">
              {stats.avgAccuracy > 0 ? `${stats.avgAccuracy}%` : '--'}
            </div>
            <div className="text-[9px] text-slate-400 font-mono">
              {stats.totalGames} {stats.totalGames === 1 ? 'partida' : 'partidas'}
            </div>
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="space-y-2 relative z-10">
          {/* Sorting Tabs */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-1 bg-[#0a0d14] rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                id="leaderboard-sort-time"
                onClick={() => setSortMode('best_time')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  sortMode === 'best_time'
                    ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Melhores Tempos</span>
              </button>

              <button
                id="leaderboard-sort-wpm"
                onClick={() => setSortMode('best_wpm')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  sortMode === 'best_wpm'
                    ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Maior WPM</span>
              </button>

              <button
                id="leaderboard-sort-recent"
                onClick={() => setSortMode('recent')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  sortMode === 'recent'
                    ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Recentes</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
              {sortedScores.length} {sortedScores.length === 1 ? 'registro' : 'registros'}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {filterOptions.map(opt => {
              const isSelected = selectedFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedFilter(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap flex items-center gap-1 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-700 text-white border-cyan-500/80 shadow-sm'
                      : 'bg-[#0f121a] text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scores List */}
        <div className="flex-1 overflow-y-auto my-2 pr-1 space-y-2 max-h-[38vh] min-h-[160px] relative z-10">
          {sortedScores.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs sm:text-sm bg-[#0a0d14]/60 rounded-2xl border border-slate-800/80 p-6 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-amber-400 mb-2">
                <Trophy className="w-6 h-6 opacity-40" />
              </div>
              <span className="font-semibold text-slate-300 mb-1">Nenhum tempo gravado ainda!</span>
              <p className="text-[11px] text-slate-500 max-w-sm">
                Complete as 5 fases no Modo Solo ou em um Duelo 1v1 para gravar seu tempo e disputar o ranking.
              </p>
            </div>
          ) : (
            sortedScores.map((record, index) => {
              const isTop1 = index === 0 && sortMode === 'best_time' && record.won;
              const isTop2 = index === 1 && sortMode === 'best_time' && record.won;
              const isTop3 = index === 2 && sortMode === 'best_time' && record.won;

              return (
                <div
                  key={record.id}
                  className={`p-3 bg-[#0d1017] hover:bg-[#121622] border rounded-2xl flex items-center justify-between gap-3 transition-colors text-xs relative overflow-hidden group ${
                    isTop1
                      ? 'border-amber-500/60 bg-gradient-to-r from-amber-950/20 to-[#0d1017]'
                      : isTop2
                      ? 'border-slate-400/50 bg-[#0e121b]'
                      : isTop3
                      ? 'border-amber-700/50 bg-[#0e121b]'
                      : 'border-slate-800/80'
                  }`}
                >
                  {/* Left rank badge & Track details */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold font-mono text-xs shadow-sm ${
                        isTop1
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black shadow-amber-500/20'
                          : isTop2
                          ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-black font-bold'
                          : isTop3
                          ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white font-bold'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${index + 1}`}
                    </div>

                    <div>
                      <div className="font-bold text-slate-100 flex items-center gap-2">
                        <span>{record.categoryName}</span>
                        {record.gameMode === 'dual' ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 font-mono font-normal flex items-center gap-1">
                            <Swords className="w-2.5 h-2.5" />
                            <span>{record.playerName || 'Duelo'}</span>
                            {record.isDuelWinner && <span className="text-amber-300">👑</span>}
                          </span>
                        ) : record.playerName && (
                          <span className="text-[10px] text-cyan-400 font-mono">
                            ({record.playerName})
                          </span>
                        )}
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                          record.won
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                        }`}>
                          {record.completedPhases}/{record.totalPhases} Fases
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                        <span>{record.date}</span>
                        <span>•</span>
                        <span className="text-amber-300 font-extrabold flex items-center gap-1">
                          <Timer className="w-3 h-3 text-amber-400" />
                          {formatTime(record.timeElapsed)} ({record.timeElapsed}s)
                        </span>
                        {record.penaltySeconds > 0 ? (
                          <span className="text-rose-400 font-medium">
                            (+{record.penaltySeconds}s pen.)
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-medium">
                            (0 erros ⚡)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right side: WPM, accuracy, and delete option */}
                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <div className="text-sm sm:text-base font-black text-cyan-400 flex items-center justify-end gap-1">
                        {record.wpm} <span className="text-[10px] text-slate-400 font-sans font-normal">WPM</span>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-medium">
                        {record.accuracy}% precisão
                      </div>
                    </div>

                    {onDeleteScore && (
                      <button
                        onClick={() => onDeleteScore(record.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-all cursor-pointer"
                        title="Excluir este registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between relative z-10">
          {scores.length > 0 ? (
            confirmClear ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-rose-400">Limpar todos os {scores.length} registros?</span>
                <button
                  onClick={() => {
                    onClearScores();
                    setConfirmClear(false);
                  }}
                  className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                >
                  Sim, Limpar
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="text-xs text-rose-400/80 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-rose-950/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Todo o Placar</span>
              </button>
            )
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="ml-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

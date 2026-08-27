import React from 'react';
import { 
  Code2, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Keyboard as KeyboardIcon, 
  PlusCircle, 
  Play, 
  Sparkles, 
  Flame, 
  Clock, 
  ShieldAlert,
  ChevronRight,
  Zap,
  Check,
  User,
  Users,
  Swords,
  Crown,
  Github
} from 'lucide-react';
import { LanguageId, DifficultyLevel, SoundMode, GameMode } from '../types';
import { DEFAULT_TRACKS } from '../data/challenges';

interface MenuScreenProps {
  selectedTrackId: LanguageId;
  selectedDifficulty: DifficultyLevel;
  gameMode: GameMode;
  player1Name: string;
  player2Name: string;
  soundMode: SoundMode;
  showKeyboard: boolean;
  customChallengesCount: number;
  bestTimesMap: Record<string, number>;
  totalScoresCount: number;
  onSelectTrack: (id: LanguageId) => void;
  onSelectDifficulty: (diff: DifficultyLevel) => void;
  onSelectGameMode: (mode: GameMode) => void;
  onChangePlayer1Name: (name: string) => void;
  onChangePlayer2Name: (name: string) => void;
  onToggleSound: () => void;
  onToggleKeyboard: () => void;
  onStartGame: () => void;
  onOpenLeaderboard: () => void;
  onOpenCustomSnippets: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  selectedTrackId,
  selectedDifficulty,
  gameMode,
  player1Name,
  player2Name,
  soundMode,
  showKeyboard,
  customChallengesCount,
  bestTimesMap,
  totalScoresCount,
  onSelectTrack,
  onSelectDifficulty,
  onSelectGameMode,
  onChangePlayer1Name,
  onChangePlayer2Name,
  onToggleSound,
  onToggleKeyboard,
  onStartGame,
  onOpenLeaderboard,
  onOpenCustomSnippets
}) => {
  const currentTrack = DEFAULT_TRACKS.find(t => t.id === selectedTrackId) || {
    id: 'custom' as LanguageId,
    name: 'Trilha Personalizada',
    icon: '✨',
    description: 'Seus próprios códigos e comandos personalizados',
    challenges: []
  };

  return (
    <div className="min-h-screen bg-[#0d1017] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Simple Bar */}
      <div className="w-full border-b border-slate-800/80 bg-[#12141a]/90 backdrop-blur-md px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold ring-1 ring-white/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-100 tracking-tight flex items-center gap-1.5">
                Dev<span className="text-cyan-400">Typing</span>
              </span>
            </div>
          </div>

          {/* Quick Nav / Settings */}
          <div className="flex items-center gap-2">
            <button
              id="menu-leaderboard-btn"
              onClick={onOpenLeaderboard}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Placar &amp; Recordes</span>
              {totalScoresCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                  {totalScoresCount}
                </span>
              )}
            </button>

            <button
              onClick={onToggleSound}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                soundMode !== 'mute'
                  ? 'bg-slate-800 text-cyan-300 border-slate-700 hover:bg-slate-700 shadow-sm'
                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
              title="Clique para alternar o efeito sonoro do teclado"
            >
              {soundMode === 'mute' ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Mudo</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[11px] capitalize">{soundMode === 'mechanical' ? 'Mecânico' : soundMode === 'soft' ? 'Suave' : 'Click'}</span>
                </>
              )}
            </button>

            <button
              onClick={onToggleKeyboard}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                showKeyboard
                  ? 'bg-slate-800 text-cyan-300 border-slate-700'
                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
              title="Teclado Visual de Dicas"
            >
              <KeyboardIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Selection Area */}
      <main className="max-w-5xl w-full mx-auto px-4 py-6 flex-1 flex flex-col justify-center">
        {/* Mode Switcher Banner (Solo vs Dual) */}
        <div className="flex flex-col items-center mb-6">
          <div className="inline-flex items-center gap-1.5 p-1 bg-[#151924] border border-slate-800 rounded-2xl shadow-xl mb-4">
            <button
              id="mode-select-solo-btn"
              onClick={() => onSelectGameMode('solo')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                gameMode === 'solo'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Modo Solo (1 Jogador)</span>
            </button>

            <button
              id="mode-select-dual-btn"
              onClick={() => onSelectGameMode('dual')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                gameMode === 'dual'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Modo Dual (Duelo 1v1)</span>
            </button>
          </div>

          {/* Dual Mode Custom Names Config */}
          {gameMode === 'dual' ? (
            <div className="w-full max-w-xl bg-gradient-to-b from-[#1b152b] to-[#120e1e] border border-purple-500/40 rounded-2xl p-4 shadow-xl mb-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <Swords className="w-4 h-4 text-purple-400" />
                  <span>Configuração do Duelo (Turnos no mesmo teclado)</span>
                </div>
                <span className="text-[11px] text-purple-400/80 font-mono">2 Rodadas Idênticas</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-cyan-300 block mb-1">
                    👤 Jogador 1 (Dev 1)
                  </label>
                  <input
                    id="player-1-name-input"
                    type="text"
                    value={player1Name}
                    onChange={(e) => onChangePlayer1Name(e.target.value)}
                    placeholder="Nome do Dev 1"
                    maxLength={16}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#090b10] border border-cyan-800/80 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-purple-300 block mb-1">
                    👥 Jogador 2 (Dev 2)
                  </label>
                  <input
                    id="player-2-name-input"
                    type="text"
                    value={player2Name}
                    onChange={(e) => onChangePlayer2Name(e.target.value)}
                    placeholder="Nome do Dev 2"
                    maxLength={16}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#090b10] border border-purple-800/80 text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                {player1Name || 'Dev 1'} digita primeiro as 5 fases. Em seguida, {player2Name || 'Dev 2'} digita os mesmos códigos para tentar bater o tempo!
              </p>
            </div>
          ) : (
            <div className="text-center mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Escolha uma Categoria para Jogar
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-1">
                Frases do dia a dia, listas de palavras ou linguagens de código. Erros adicionam <strong className="text-rose-400">+5s de penalidade</strong>!
              </p>
            </div>
          )}
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {DEFAULT_TRACKS.map((track) => {
            const isSelected = selectedTrackId === track.id;
            const trackBestTime = bestTimesMap[track.id];

            return (
              <div
                key={track.id}
                id={`menu-track-${track.id}`}
                onClick={() => onSelectTrack(track.id)}
                className={`p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer text-left relative overflow-hidden flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#182332] to-[#121924] border-cyan-500 shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-400/40'
                    : 'bg-[#141722]/80 hover:bg-[#191d2b] border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Active check badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{track.icon}</span>
                      <div>
                        <h3 className="font-bold text-slate-100 text-sm group-hover:text-cyan-300 transition-colors">
                          {track.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {track.challenges.length} Fases
                        </span>
                      </div>
                    </div>

                    {/* Best Record Badge */}
                    {trackBestTime ? (
                      <div className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800/80 text-[10px] font-mono font-bold text-amber-300 flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-400" />
                        <span>{trackBestTime}s</span>
                      </div>
                    ) : null}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5 line-clamp-2">
                    {track.description}
                  </p>
                </div>

                {/* Snippet preview */}
                <div className="bg-[#0b0e14] p-2 rounded-xl border border-slate-800/80 font-mono text-[10px] text-slate-400 truncate flex items-center justify-between">
                  <span className="truncate">
                    <span className="text-cyan-400">1.</span> {track.challenges[0]?.code}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Custom Track Card */}
          <div
            id="menu-track-custom"
            onClick={() => {
              onSelectTrack('custom');
              if (customChallengesCount === 0) {
                onOpenCustomSnippets();
              }
            }}
            className={`p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer text-left relative overflow-hidden flex flex-col justify-between group ${
              selectedTrackId === 'custom'
                ? 'bg-gradient-to-b from-[#241a35] to-[#171124] border-purple-500 shadow-lg shadow-purple-500/15 ring-1 ring-purple-400/40'
                : 'bg-[#141722]/80 hover:bg-[#191d2b] border-slate-800 hover:border-slate-700'
            }`}
          >
            {selectedTrackId === 'custom' && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm group-hover:text-purple-300 transition-colors">
                      Personalizado
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {customChallengesCount} códigos cadastrados
                    </span>
                  </div>
                </div>

                {bestTimesMap['custom'] ? (
                  <div className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800/80 text-[10px] font-mono font-bold text-amber-300 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>{bestTimesMap['custom']}s</span>
                  </div>
                ) : null}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
                Crie ou cole seus próprios comandos e funções para treinar.
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenCustomSnippets();
              }}
              className="w-full py-1.5 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/60 text-purple-300 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3 h-3" />
              <span>Gerenciar Meus Códigos</span>
            </button>
          </div>
        </div>

        {/* Rules & Play Button Bar */}
        <div className="bg-[#161922] border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">Cronômetro Progressivo &amp; Recordes</div>
              <div className="text-slate-400 text-[11px]">
                O menor tempo total vence. Erros somam +5s ao tempo final.
              </div>
            </div>
          </div>

          <button
            id="start-challenge-screen-btn"
            onClick={onStartGame}
            className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 group text-white ${
              gameMode === 'dual'
                ? 'bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 hover:from-purple-400 hover:to-blue-500 shadow-purple-500/25'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/25'
            }`}
          >
            {gameMode === 'dual' ? <Swords className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>
              {gameMode === 'dual' 
                ? `Iniciar Duelo (${player1Name || 'Dev 1'} vs ${player2Name || 'Dev 2'})` 
                : `Jogar Solo (${currentTrack.name})`}
            </span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#12141a] py-2.5 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DevTyping — Solo &amp; Duelo 1v1</span>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Desenvolvido por Lucas Ineth</span>
            <a
              href="https://github.com/lucasineth/devtyping"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-cyan-300 transition-colors"
              title="Acessar o projeto no GitHub"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

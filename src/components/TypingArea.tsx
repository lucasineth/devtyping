import React, { useRef, useEffect, useMemo } from 'react';
import { Play, RotateCcw, Terminal, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { CodeChallenge, GameStatus } from '../types';
import { tokenizeCodeToChars, getTokenTailwindColor } from '../utils/syntax';

interface TypingAreaProps {
  currentChallenge: CodeChallenge | null;
  currentPhase: number;
  totalPhases: number;
  userInput: string;
  gameStatus: GameStatus;
  hasError: boolean;
  penaltyAnimation: boolean;
  onInputChange: (value: string) => void;
  onStartGame: () => void;
  onRestartGame: () => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  currentChallenge,
  currentPhase,
  totalPhases,
  userInput,
  gameStatus,
  hasError,
  penaltyAnimation,
  onInputChange,
  onStartGame,
  onRestartGame
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const targetCode = currentChallenge?.code || '';
  const language = currentChallenge?.language || 'javascript';

  // Tokenize code for syntax highlighting
  const tokenizedChars = useMemo(() => {
    if (!targetCode) return [];
    return tokenizeCodeToChars(targetCode, language);
  }, [targetCode, language]);

  // Keep input focused during play and capture keypresses
  useEffect(() => {
    if (gameStatus === 'playing') {
      inputRef.current?.focus();
    }

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is pressing Esc, Tab, F-keys or modifier shortcuts
      if (e.key === 'Escape' || e.key === 'Tab' || e.key.startsWith('F') || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }
      // If typing in another text input, ignore
      const activeEl = document.activeElement;
      if (activeEl && activeEl !== inputRef.current && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }
      if (gameStatus === 'playing' || gameStatus === 'idle') {
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [gameStatus, currentPhase]);

  const handleEditorClick = () => {
    if (gameStatus === 'idle') {
      onStartGame();
    }
    inputRef.current?.focus();
  };

  const getCharStatus = (index: number) => {
    if (index < userInput.length) {
      const isCharCorrect = userInput[index] === targetCode[index];
      return isCharCorrect ? 'correct' : 'incorrect';
    }
    if (index === userInput.length) {
      return 'current';
    }
    return 'pending';
  };

  return (
    <div className="w-full bg-[#141722] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden mb-6 transition-all relative">
      {/* Code Editor Header Bar */}
      <div className="bg-[#0f1118] px-6 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mac-style Window Controls */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/50" />
          </div>

          {/* Active Tab */}
          <div className="flex items-center gap-2 bg-[#1a1e2b] px-3.5 py-1 rounded-lg border border-slate-700/60 text-xs font-mono text-cyan-300 shadow-inner">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              fase_{currentPhase + 1}_{currentChallenge?.title.toLowerCase().replace(/\s+/g, '_') || 'desafio'}.{language === 'python' ? 'py' : language === 'sql' ? 'sql' : 'js'}
            </span>
          </div>
        </div>

        {/* Phase Indicators */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPhases }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx < currentPhase
                  ? 'w-6 bg-emerald-400'
                  : idx === currentPhase
                  ? 'w-8 bg-cyan-400 animate-pulse'
                  : 'w-3 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Challenge Title & Info Banner */}
      {currentChallenge && (
        <div className="px-6 py-3 bg-[#11141e]/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">
              {currentChallenge.title}
            </span>
            <span className="text-slate-400 hidden sm:inline">— {currentChallenge.description}</span>
          </div>
          <div className="text-slate-400 font-mono text-xs flex items-center gap-2">
            <span>{userInput.length} / {targetCode.length} caracteres</span>
          </div>
        </div>
      )}

      {/* Main Spacious Code Editor Body */}
      <div 
        ref={editorRef}
        id="ide-editor-container"
        onClick={handleEditorClick}
        className={`relative p-8 sm:p-12 bg-[#0a0d14] min-h-[220px] flex items-center justify-start cursor-text select-none overflow-x-auto group transition-colors ${
          hasError ? 'bg-rose-950/15' : ''
        }`}
      >
        {/* Hidden Input for Native Keyboard & Typing Capture */}
        <input
          ref={inputRef}
          id="typing-hidden-input"
          type="text"
          value={userInput}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={gameStatus === 'completed'}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className="absolute inset-0 opacity-0 pointer-events-auto cursor-text z-10 w-full h-full"
          aria-label="Digite o código aqui"
        />

        {/* Big Line Number */}
        <div className="flex flex-col text-slate-600 font-mono text-xl sm:text-2xl pr-6 select-none border-r border-slate-800/80 mr-6 font-bold">
          <span>01</span>
        </div>

        {/* Target Code with Big Comfortable Font & Highlighting */}
        <div className="flex-1 font-mono text-xl sm:text-2xl md:text-3xl tracking-wide leading-relaxed break-all relative">
          {gameStatus === 'idle' ? (
            <div className="text-slate-400 flex flex-col items-center justify-center py-6 w-full text-center">
              <p className="text-slate-300 text-lg sm:text-xl font-medium mb-3">
                Clique abaixo ou comece a digitar para iniciar o cronômetro!
              </p>
              <div className="opacity-50 font-mono text-base sm:text-lg bg-slate-900/80 p-4 rounded-xl border border-slate-800 max-w-xl">
                {targetCode || 'function hello() { console.log("Oi"); }'}
              </div>
            </div>
          ) : (
            <div className="relative inline-block font-mono">
              {tokenizedChars.map((tokenInfo, idx) => {
                const char = tokenInfo.char;
                const status = getCharStatus(idx);
                const isCurrent = status === 'current';
                const isTypedCorrect = status === 'correct';
                const isError = status === 'incorrect';

                const colorClass = getTokenTailwindColor(tokenInfo.tokenType, isTypedCorrect, isError);

                return (
                  <span
                    key={idx}
                    className={`relative transition-colors duration-75 ${colorClass} ${
                      isError ? 'animate-shake' : ''
                    } ${isCurrent ? 'bg-cyan-500/25 text-cyan-100 ring-2 ring-cyan-400 rounded-sm' : ''}`}
                  >
                    {/* Blinking Glowing Cursor */}
                    {isCurrent && (
                      <span className="absolute -left-[1px] top-0 bottom-0 w-[3px] bg-cyan-400 animate-pulse shadow-[0_0_12px_#22d3ee] rounded-full z-20" />
                    )}
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                );
              })}

              {/* End of line cursor */}
              {userInput.length === targetCode.length && (
                <span className="inline-block w-[3px] h-7 bg-emerald-400 animate-pulse ml-0.5 align-middle" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer & Real-Time Status Feedback */}
      <div className="bg-[#0f1118] px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Status Message */}
        <div className="flex items-center gap-2 text-xs">
          {gameStatus === 'idle' && (
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Pronto para começar. O cronômetro inicia na primeira tecla digitada!
            </span>
          )}
          {gameStatus === 'playing' && !hasError && (
            <span className="text-emerald-400 flex items-center gap-1.5 font-medium text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Sintaxe correta! Digitando com precisão...
            </span>
          )}
          {gameStatus === 'playing' && hasError && (
            <span className="text-rose-400 flex items-center gap-1.5 font-bold text-sm animate-pulse">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              Erro digitado! (+5 segundos penalidade) Corrija com Backspace.
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {gameStatus === 'idle' ? (
            <button
              id="start-game-main-btn"
              onClick={onStartGame}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              Iniciar Digitação
            </button>
          ) : (
            <button
              id="restart-current-game-btn"
              onClick={onRestartGame}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              Reiniciar Desafio
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

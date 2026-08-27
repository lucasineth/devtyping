/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  AppScreen,
  LanguageId, 
  DifficultyLevel, 
  GameStatus, 
  GameMetrics, 
  CodeChallenge, 
  ScoreRecord, 
  SoundMode,
  GameMode,
  DualMatchResult
} from './types';
import { DEFAULT_TRACKS } from './data/challenges';
import { soundManager } from './utils/audio';
import { 
  getStoredScores, 
  saveScoreRecord, 
  deleteScoreRecord,
  clearStoredScores, 
  getBestTimesMap,
  getCustomChallenges, 
  saveCustomChallenges,
  getPreferences,
  savePreferences
} from './utils/storage';
import { MenuScreen } from './components/MenuScreen';
import { GameTopBar } from './components/StatsBar';
import { TypingArea } from './components/TypingArea';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { ResultModal } from './components/ResultModal';
import { DualTurnModal } from './components/DualTurnModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { CustomSnippetModal } from './components/CustomSnippetModal';
import { Flame, ShieldCheck, BookOpen } from 'lucide-react';

export default function App() {
  // Stored preferences
  const initialPrefs = useMemo(() => getPreferences(), []);

  // Screen navigation
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('menu');

  // Game Mode: Solo vs Dual (1v1 Duelo)
  const [gameMode, setGameMode] = useState<GameMode>('solo');
  const [player1Name, setPlayer1Name] = useState<string>('Dev 1');
  const [player2Name, setPlayer2Name] = useState<string>('Dev 2');
  const [activePlayerIndex, setActivePlayerIndex] = useState<1 | 2>(1);
  const [player1SavedMetrics, setPlayer1SavedMetrics] = useState<GameMetrics | null>(null);
  const [dualMatchResult, setDualMatchResult] = useState<DualMatchResult | null>(null);
  const [isDualTurnOpen, setIsDualTurnOpen] = useState<boolean>(false);

  // Configuration state
  const [selectedTrackId, setSelectedTrackId] = useState<LanguageId>(initialPrefs.selectedLanguage || 'js-classic');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(initialPrefs.selectedDifficulty || 'easy');
  const [soundMode, setSoundMode] = useState<SoundMode>(initialPrefs.soundMode || 'mechanical');
  const [showKeyboard, setShowKeyboard] = useState<boolean>(initialPrefs.showKeyboard ?? true);

  const [customChallenges, setCustomChallenges] = useState<CodeChallenge[]>(() => getCustomChallenges());
  const [scoreHistory, setScoreHistory] = useState<ScoreRecord[]>(() => getStoredScores());

  // Modals state
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isCustomSnippetsOpen, setIsCustomSnippetsOpen] = useState<boolean>(false);
  const [isResultOpen, setIsResultOpen] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // Best times map calculated across all saved records
  const bestTimesMap = useMemo(() => getBestTimesMap(scoreHistory), [scoreHistory]);

  // Active game state
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [penaltyAnimation, setPenaltyAnimation] = useState<boolean>(false);

  // Metrics tracking (Count-up timer & +5s penalty system)
  const [metrics, setMetrics] = useState<GameMetrics>({
    wpm: 0,
    rawWpm: 0,
    cpm: 0,
    accuracy: 100,
    errorsCount: 0,
    penaltySeconds: 0,
    correctChars: 0,
    totalChars: 0,
    timeElapsed: 0,
    phaseTimes: []
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const penaltySecondsRef = useRef<number>(0);
  const phaseStartTimeRef = useRef<number | null>(null);
  const errorCountRef = useRef<number>(0);
  const totalTypedCountRef = useRef<number>(0);
  const correctTypedCountRef = useRef<number>(0);
  const phaseTimesRef = useRef<number[]>([]);
  const penaltyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get active challenges based on track
  const currentTrack = useMemo(() => {
    if (selectedTrackId === 'custom') {
      return {
        id: 'custom' as LanguageId,
        name: 'Trilha Personalizada',
        icon: '✨',
        description: 'Seus próprios códigos e comandos personalizados',
        challenges: customChallenges.length > 0 ? customChallenges : DEFAULT_TRACKS[0].challenges
      };
    }
    return DEFAULT_TRACKS.find(t => t.id === selectedTrackId) || DEFAULT_TRACKS[0];
  }, [selectedTrackId, customChallenges]);

  const activeChallenges = useMemo(() => {
    return currentTrack.challenges;
  }, [currentTrack]);

  const currentChallenge = activeChallenges[currentPhase] || null;
  const currentTargetCode = currentChallenge?.code || '';
  const totalPhases = activeChallenges.length;

  // Next required character for visual keyboard guide
  const nextChar = useMemo(() => {
    if (gameStatus !== 'playing' || !currentTargetCode) return null;
    if (userInput.length < currentTargetCode.length) {
      return currentTargetCode[userInput.length];
    }
    return null;
  }, [gameStatus, currentTargetCode, userInput]);

  // Clean timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Trigger visual +5s penalty indicator
  const triggerPenaltyAnimation = useCallback(() => {
    setPenaltyAnimation(true);
    if (penaltyTimeoutRef.current) {
      clearTimeout(penaltyTimeoutRef.current);
    }
    penaltyTimeoutRef.current = setTimeout(() => {
      setPenaltyAnimation(false);
    }, 1200);
  }, []);

  // Helper to start timer
  const launchTimer = useCallback(() => {
    stopTimer();
    const startTime = Date.now();
    startTimeRef.current = startTime;
    phaseStartTimeRef.current = startTime;

    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const rawElapsed = (Date.now() - startTimeRef.current) / 1000;
        const total = Math.floor(rawElapsed + penaltySecondsRef.current);
        setMetrics(prev => ({
          ...prev,
          timeElapsed: total
        }));
      }
    }, 1000);
  }, [stopTimer]);

  // Start fresh game / turn
  const startTurn = useCallback((playerIdx: 1 | 2) => {
    stopTimer();
    setActivePlayerIndex(playerIdx);
    setCurrentPhase(0);
    setUserInput('');
    setHasError(false);
    setIsResultOpen(false);
    setIsDualTurnOpen(false);
    setIsGameWon(false);
    setPenaltyAnimation(false);

    errorCountRef.current = 0;
    penaltySecondsRef.current = 0;
    totalTypedCountRef.current = 0;
    correctTypedCountRef.current = 0;
    phaseTimesRef.current = [];

    setMetrics({
      wpm: 0,
      rawWpm: 0,
      cpm: 0,
      accuracy: 100,
      errorsCount: 0,
      penaltySeconds: 0,
      correctChars: 0,
      totalChars: 0,
      timeElapsed: 0,
      phaseTimes: []
    });

    setGameStatus('playing');
    launchTimer();
  }, [stopTimer, launchTimer]);

  // Start complete game from beginning
  const startNewGame = useCallback(() => {
    setPlayer1SavedMetrics(null);
    setDualMatchResult(null);
    startTurn(1);
  }, [startTurn]);

  // Compute final metrics helper
  const computeFinalMetrics = useCallback((): GameMetrics => {
    const now = Date.now();
    const rawElapsed = startTimeRef.current ? Math.max(1, Math.round((now - startTimeRef.current) / 1000)) : 1;
    const totalTimeWithPenalties = rawElapsed + penaltySecondsRef.current;

    const finalAccuracy = totalTypedCountRef.current > 0 
      ? Math.max(0, Math.round(((totalTypedCountRef.current - errorCountRef.current) / totalTypedCountRef.current) * 100))
      : 100;
    const finalWpm = Math.max(0, Math.round(((correctTypedCountRef.current / 5) / (Math.max(1, totalTimeWithPenalties) / 60))));
    const finalCpm = Math.max(0, Math.round((correctTypedCountRef.current / (Math.max(1, totalTimeWithPenalties) / 60))));

    return {
      wpm: finalWpm,
      rawWpm: Math.round((totalTypedCountRef.current / 5) / (totalTimeWithPenalties / 60)),
      cpm: finalCpm,
      accuracy: finalAccuracy,
      errorsCount: errorCountRef.current,
      penaltySeconds: penaltySecondsRef.current,
      correctChars: correctTypedCountRef.current,
      totalChars: totalTypedCountRef.current,
      timeElapsed: totalTimeWithPenalties,
      phaseTimes: phaseTimesRef.current
    };
  }, []);

  // End Game or Turn
  const handleGameCompletion = useCallback((won: boolean) => {
    stopTimer();
    const finalM = computeFinalMetrics();
    setMetrics(finalM);

    if (gameMode === 'dual') {
      if (activePlayerIndex === 1) {
        // Player 1 finished! Save metrics and open transition modal for Player 2
        setPlayer1SavedMetrics(finalM);
        soundManager.playPhaseCompleteSound(soundMode);
        setIsDualTurnOpen(true);
        setGameStatus('idle');
      } else {
        // Player 2 finished! Compute winner and open final comparison modal
        const p1Metrics = player1SavedMetrics || finalM;
        const p2Metrics = finalM;

        let winner: 'player1' | 'player2' | 'tie' = 'tie';
        if (p1Metrics.timeElapsed < p2Metrics.timeElapsed) {
          winner = 'player1';
        } else if (p2Metrics.timeElapsed < p1Metrics.timeElapsed) {
          winner = 'player2';
        }

        const matchResult: DualMatchResult = {
          player1: {
            name: player1Name || 'Dev 1',
            metrics: p1Metrics,
            completedPhases: totalPhases,
            totalPhases: totalPhases,
            won: winner === 'player1'
          },
          player2: {
            name: player2Name || 'Dev 2',
            metrics: p2Metrics,
            completedPhases: totalPhases,
            totalPhases: totalPhases,
            won: winner === 'player2'
          },
          winner,
          timeDifference: Math.abs(p1Metrics.timeElapsed - p2Metrics.timeElapsed)
        };

        // Save Player 1 record to leaderboard
        const p1Record: ScoreRecord = {
          id: `dual-${Date.now()}-p1`,
          date: new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          playerName: player1Name || 'Dev 1',
          gameMode: 'dual',
          categoryName: currentTrack.name,
          categoryId: selectedTrackId,
          difficulty: selectedDifficulty,
          wpm: p1Metrics.wpm,
          cpm: p1Metrics.cpm,
          accuracy: p1Metrics.accuracy,
          timeElapsed: p1Metrics.timeElapsed,
          rawTime: Math.max(0, p1Metrics.timeElapsed - p1Metrics.penaltySeconds),
          penaltySeconds: p1Metrics.penaltySeconds,
          errorsCount: p1Metrics.errorsCount,
          completedPhases: totalPhases,
          totalPhases: totalPhases,
          won: true,
          isDuelWinner: winner === 'player1',
          opponentName: player2Name || 'Dev 2'
        };

        // Save Player 2 record to leaderboard
        const p2Record: ScoreRecord = {
          id: `dual-${Date.now()}-p2`,
          date: new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          playerName: player2Name || 'Dev 2',
          gameMode: 'dual',
          categoryName: currentTrack.name,
          categoryId: selectedTrackId,
          difficulty: selectedDifficulty,
          wpm: p2Metrics.wpm,
          cpm: p2Metrics.cpm,
          accuracy: p2Metrics.accuracy,
          timeElapsed: p2Metrics.timeElapsed,
          rawTime: Math.max(0, p2Metrics.timeElapsed - p2Metrics.penaltySeconds),
          penaltySeconds: p2Metrics.penaltySeconds,
          errorsCount: p2Metrics.errorsCount,
          completedPhases: totalPhases,
          totalPhases: totalPhases,
          won: true,
          isDuelWinner: winner === 'player2',
          opponentName: player1Name || 'Dev 1'
        };

        saveScoreRecord(p1Record);
        saveScoreRecord(p2Record);
        setScoreHistory(getStoredScores());

        setDualMatchResult(matchResult);
        setGameStatus('completed');
        setIsGameWon(true);
        setIsResultOpen(true);
        soundManager.playWinFanfare(soundMode);
      }
    } else {
      // SOLO MODE COMPLETION
      setGameStatus(won ? 'completed' : 'gameover');
      setIsGameWon(won);
      setIsResultOpen(true);

      if (won) {
        soundManager.playWinFanfare(soundMode);
      } else {
        soundManager.playErrorSound(soundMode);
      }

      // Check if new personal record on this track
      const existingBest = bestTimesMap[selectedTrackId];
      const isRecord = won && (!existingBest || finalM.timeElapsed < existingBest);
      setIsNewRecord(isRecord);

      // Save solo record to leaderboard
      const newRecord: ScoreRecord = {
        id: `score-${Date.now()}`,
        date: new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        playerName: 'Solo',
        gameMode: 'solo',
        categoryName: currentTrack.name,
        categoryId: selectedTrackId,
        difficulty: selectedDifficulty,
        wpm: finalM.wpm,
        cpm: finalM.cpm,
        accuracy: finalM.accuracy,
        timeElapsed: finalM.timeElapsed,
        rawTime: Math.max(0, finalM.timeElapsed - finalM.penaltySeconds),
        penaltySeconds: finalM.penaltySeconds,
        errorsCount: finalM.errorsCount,
        completedPhases: won ? totalPhases : currentPhase,
        totalPhases: totalPhases,
        won: won
      };

      saveScoreRecord(newRecord);
      setScoreHistory(getStoredScores());
    }
  }, [stopTimer, computeFinalMetrics, gameMode, activePlayerIndex, player1SavedMetrics, player1Name, player2Name, totalPhases, soundMode, currentTrack.name, selectedTrackId, selectedDifficulty, bestTimesMap, currentPhase]);

  // Update live metrics during typing
  const updateMetrics = useCallback(() => {
    if (!startTimeRef.current) return;
    const rawElapsed = Math.max(1, (Date.now() - startTimeRef.current) / 1000);
    const totalTime = rawElapsed + penaltySecondsRef.current;
    const totalTyped = totalTypedCountRef.current;
    const errors = errorCountRef.current;
    const correct = correctTypedCountRef.current;

    const acc = totalTyped > 0 
      ? Math.max(0, Math.round(((totalTyped - errors) / totalTyped) * 100))
      : 100;

    const rawWpm = Math.round((totalTyped / 5) / (totalTime / 60));
    const wpm = Math.max(0, Math.round(((correct / 5) / (totalTime / 60)) * (acc / 100)));
    const cpm = Math.round(correct / (totalTime / 60));

    setMetrics(prev => ({
      ...prev,
      wpm,
      rawWpm,
      cpm,
      accuracy: acc,
      errorsCount: errors,
      penaltySeconds: penaltySecondsRef.current,
      correctChars: correct,
      totalChars: totalTyped,
      timeElapsed: Math.floor(totalTime)
    }));
  }, []);

  // Advance to next phase
  const nextPhase = useCallback((phaseIndex: number) => {
    if (phaseIndex < activeChallenges.length) {
      setCurrentPhase(phaseIndex);
      setUserInput('');
      setHasError(false);
      phaseStartTimeRef.current = Date.now();
      soundManager.playPhaseCompleteSound(soundMode);
    } else {
      handleGameCompletion(true);
    }
  }, [activeChallenges.length, handleGameCompletion, soundMode]);

  // Transition from Menu to Game
  const handleEnterGameScreen = () => {
    setCurrentScreen('game');
    startNewGame();
  };

  // Back to Menu Screen
  const handleBackToMenu = () => {
    stopTimer();
    setGameStatus('idle');
    setIsResultOpen(false);
    setIsDualTurnOpen(false);
    setCurrentScreen('menu');
  };

  // Real-time typing verification with +5s Penalty on ANY error
  const handleInputChange = (newInput: string) => {
    if (gameStatus !== 'playing') {
      if (gameStatus === 'idle') {
        startTurn(activePlayerIndex);
      }
      return;
    }

    const targetText = currentTargetCode;
    const prevLen = userInput.length;
    const newLen = newInput.length;

    if (newLen > prevLen) {
      // Process all newly added characters (supports fast keystrokes, dead-key accents, etc.)
      for (let i = prevLen; i < newLen; i++) {
        totalTypedCountRef.current += 1;
        const typedChar = newInput[i];
        const expectedChar = targetText[i];

        if (typedChar === expectedChar) {
          correctTypedCountRef.current += 1;
          soundManager.playKeySound(soundMode);
        } else {
          // ERROR DETECTED: Apply +5 SECONDS PENALTY!
          errorCountRef.current += 1;
          penaltySecondsRef.current += 5;
          triggerPenaltyAnimation();
          soundManager.playErrorSound(soundMode);
        }
      }
    }

    setUserInput(newInput);
    updateMetrics();

    // Check exact completion of current phase
    if (newInput === targetText) {
      if (phaseStartTimeRef.current) {
        const phaseDuration = (Date.now() - phaseStartTimeRef.current) / 1000;
        phaseTimesRef.current.push(phaseDuration);
      }
      const nextP = currentPhase + 1;
      nextPhase(nextP);
    } else if (targetText.startsWith(newInput)) {
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  // Switch Track / Language
  const handleSelectLanguage = (lang: LanguageId) => {
    setSelectedTrackId(lang);
    savePreferences({ selectedLanguage: lang });
  };

  // Switch Difficulty
  const handleSelectDifficulty = (diff: DifficultyLevel) => {
    setSelectedDifficulty(diff);
    savePreferences({ selectedDifficulty: diff });
  };

  // Toggle Sound Mode
  const handleToggleSound = () => {
    const modes: SoundMode[] = ['mechanical', 'click', 'soft', 'mute'];
    const nextIdx = (modes.indexOf(soundMode) + 1) % modes.length;
    const newMode = modes[nextIdx];
    setSoundMode(newMode);
    savePreferences({ soundMode: newMode });
    if (newMode !== 'mute') {
      soundManager.playKeySound(newMode);
    }
  };

  // Toggle Virtual Keyboard
  const handleToggleKeyboard = () => {
    const nextVal = !showKeyboard;
    setShowKeyboard(nextVal);
    savePreferences({ showKeyboard: nextVal });
  };

  // Save Custom Snippets
  const handleSaveCustomChallenges = (snippets: CodeChallenge[]) => {
    setCustomChallenges(snippets);
    saveCustomChallenges(snippets);
    setSelectedTrackId('custom');
  };

  // Delete Single Score from Leaderboard
  const handleDeleteScore = (id: string) => {
    const updated = deleteScoreRecord(id);
    setScoreHistory(updated);
  };

  // Clear Leaderboard
  const handleClearScores = () => {
    clearStoredScores();
    setScoreHistory([]);
  };

  // Global Keyboard Shortcuts (Escape to return to menu/restart, Enter on results)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (currentScreen === 'game') {
          handleBackToMenu();
        }
      }
      if (e.key === 'Enter' && isResultOpen) {
        e.preventDefault();
        startNewGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen, isResultOpen, startNewGame]);

  // Clean timer on unmount
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  return (
    <div className="min-h-screen bg-[#0d1017] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* SCREEN 1: Language Selection & Menu */}
      {currentScreen === 'menu' && (
        <MenuScreen
          selectedTrackId={selectedTrackId}
          selectedDifficulty={selectedDifficulty}
          gameMode={gameMode}
          player1Name={player1Name}
          player2Name={player2Name}
          soundMode={soundMode}
          showKeyboard={showKeyboard}
          customChallengesCount={customChallenges.length}
          bestTimesMap={bestTimesMap}
          totalScoresCount={scoreHistory.length}
          onSelectTrack={handleSelectLanguage}
          onSelectDifficulty={handleSelectDifficulty}
          onSelectGameMode={setGameMode}
          onChangePlayer1Name={setPlayer1Name}
          onChangePlayer2Name={setPlayer2Name}
          onToggleSound={handleToggleSound}
          onToggleKeyboard={handleToggleKeyboard}
          onStartGame={handleEnterGameScreen}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenCustomSnippets={() => setIsCustomSnippetsOpen(true)}
        />
      )}

      {/* SCREEN 2: Focused Game Screen (Uncluttered, High Visibility) */}
      {currentScreen === 'game' && (
        <div className="min-h-screen flex flex-col justify-between">
          {/* Streamlined Game Top Bar */}
          <GameTopBar
            currentPhase={currentPhase}
            totalPhases={totalPhases}
            phaseTitle={currentChallenge?.title || ''}
            trackName={currentTrack.name}
            metrics={metrics}
            gameStatus={gameStatus}
            soundMode={soundMode}
            penaltyAnimation={penaltyAnimation}
            gameMode={gameMode}
            activePlayerIndex={activePlayerIndex}
            player1Name={player1Name || 'Dev 1'}
            player2Name={player2Name || 'Dev 2'}
            player1TargetTime={player1SavedMetrics?.timeElapsed ?? null}
            onBackToMenu={handleBackToMenu}
            onRestart={startNewGame}
            onToggleSound={handleToggleSound}
          />

          {/* Main Focused Game Canvas */}
          <main className="max-w-5xl w-full mx-auto px-4 py-2 flex-1 flex flex-col justify-center">
            {/* Core Typing Code Editor (Spacious, Big Typography) */}
            <TypingArea
              currentChallenge={currentChallenge}
              currentPhase={currentPhase}
              totalPhases={totalPhases}
              userInput={userInput}
              gameStatus={gameStatus}
              hasError={hasError}
              penaltyAnimation={penaltyAnimation}
              onInputChange={handleInputChange}
              onStartGame={() => startTurn(activePlayerIndex)}
              onRestartGame={startNewGame}
            />

            {/* Optional Muscle Memory Virtual Keyboard */}
            <VirtualKeyboard
              nextChar={nextChar}
              showKeyboard={showKeyboard}
              onToggleShow={handleToggleKeyboard}
            />

            {/* Quick Tips */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400">
              <div className="bg-[#141720] p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-200 block mb-0.5">
                    {gameMode === 'dual' ? 'Modo Duelo 1v1' : 'Memória Muscular'}
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    {gameMode === 'dual' 
                      ? 'Desafie seu amigo no mesmo teclado! Quem fizer o menor tempo total vence.'
                      : 'Mantenha o ritmo estável. Símbolos de sintaxe aumentam sua agilidade.'}
                  </p>
                </div>
              </div>

              <div className="bg-[#141720] p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-rose-300 block mb-0.5">Penalidade de Erro</span>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    Cada erro adiciona <strong className="text-rose-400">+5s</strong> ao cronômetro. Evite erros para manter o tempo baixo!
                  </p>
                </div>
              </div>

              <div className="bg-[#141720] p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-200 block mb-0.5">Navegação Rápida</span>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    Pressione <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">Esc</kbd> para voltar ao menu a qualquer momento.
                  </p>
                </div>
              </div>
            </div>
          </main>

          {/* Minimal Footer */}
          <footer className="w-full border-t border-slate-800/80 bg-[#12141a] py-2.5 px-4 text-center text-xs text-slate-500">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <span>
                {currentTrack.name} — Fase {currentPhase + 1} de {totalPhases}
                {gameMode === 'dual' && ` (Vez de ${activePlayerIndex === 1 ? (player1Name || 'Dev 1') : (player2Name || 'Dev 2')})`}
              </span>
              <span className="text-slate-400 font-mono">DevTyping</span>
            </div>
          </footer>
        </div>
      )}

      {/* Dual Mode Turn 2 Transition Modal */}
      <DualTurnModal
        isOpen={isDualTurnOpen}
        player1Name={player1Name || 'Dev 1'}
        player2Name={player2Name || 'Dev 2'}
        player1Metrics={player1SavedMetrics || metrics}
        onStartPlayer2Turn={() => startTurn(2)}
        onBackToMenu={handleBackToMenu}
      />

      {/* Result Modal / Placar Final (Compact & Horizontal) */}
      <ResultModal
        isOpen={isResultOpen}
        isWin={isGameWon}
        isNewRecord={isNewRecord}
        gameMode={gameMode}
        metrics={metrics}
        dualResult={dualMatchResult}
        completedPhases={totalPhases}
        totalPhases={totalPhases}
        challenges={activeChallenges}
        languageName={currentTrack.name}
        difficulty={selectedDifficulty}
        onRestart={startNewGame}
        onBackToMenu={handleBackToMenu}
        onOpenLeaderboard={() => {
          setIsResultOpen(false);
          setIsLeaderboardOpen(true);
        }}
        onClose={() => setIsResultOpen(false)}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        scores={scoreHistory}
        onClearScores={handleClearScores}
        onDeleteScore={handleDeleteScore}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {/* Custom Snippets Modal */}
      <CustomSnippetModal
        isOpen={isCustomSnippetsOpen}
        customChallenges={customChallenges}
        onSaveChallenges={handleSaveCustomChallenges}
        onClose={() => setIsCustomSnippetsOpen(false)}
      />
    </div>
  );
}

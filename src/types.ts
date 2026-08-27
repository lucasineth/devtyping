export type AppScreen = 'menu' | 'game';

export type GameMode = 'solo' | 'dual';

export interface DualPlayerState {
  name: string;
  metrics: GameMetrics;
  completedPhases: number;
  totalPhases: number;
  won: boolean;
}

export interface DualMatchResult {
  player1: DualPlayerState;
  player2: DualPlayerState;
  winner: 'player1' | 'player2' | 'tie';
  timeDifference: number; // in seconds
}

export type LanguageId = 
  | 'js-classic'
  | 'general-text'
  | 'items-words'
  | 'javascript' 
  | 'typescript' 
  | 'python' 
  | 'react' 
  | 'git' 
  | 'html-css' 
  | 'sql'
  | 'custom';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface CodeChallenge {
  id: string;
  title: string;
  code: string;
  description?: string;
  language: string;
  difficulty: DifficultyLevel;
}

export interface CategoryTrack {
  id: LanguageId;
  name: string;
  icon: string;
  description: string;
  defaultTimer?: number;
  challenges: CodeChallenge[];
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'completed' | 'gameover';

export interface KeyStrokeLog {
  char: string;
  expected: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface GameMetrics {
  wpm: number;
  rawWpm: number;
  cpm: number;
  accuracy: number;
  errorsCount: number;
  penaltySeconds: number;
  correctChars: number;
  totalChars: number;
  timeElapsed: number; // in seconds (count up)
  phaseTimes: number[];
}

export interface ScoreRecord {
  id: string;
  date: string;
  playerName?: string;
  gameMode?: GameMode;
  categoryName: string;
  categoryId: LanguageId;
  difficulty: DifficultyLevel;
  wpm: number;
  cpm: number;
  accuracy: number;
  timeElapsed: number; // total time in seconds including penalties
  rawTime: number; // pure execution time without penalties
  penaltySeconds: number;
  errorsCount: number;
  completedPhases: number;
  totalPhases: number;
  won: boolean;
  isDuelWinner?: boolean;
  opponentName?: string;
}

export type SoundMode = 'mechanical' | 'soft' | 'click' | 'mute';

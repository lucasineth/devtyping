import { ScoreRecord, CodeChallenge, SoundMode, DifficultyLevel, LanguageId } from '../types';

const SCORES_STORAGE_KEY = 'devtyping_scores_v1';
const CUSTOM_CHALLENGES_KEY = 'devtyping_custom_challenges_v1';
const PREFERENCES_KEY = 'devtyping_preferences_v1';

export interface UserPreferences {
  soundMode: SoundMode;
  showKeyboard: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  selectedLanguage: LanguageId;
  selectedDifficulty: DifficultyLevel;
  customTimerSeconds: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  soundMode: 'mechanical',
  showKeyboard: true,
  fontSize: 'md',
  selectedLanguage: 'js-classic',
  selectedDifficulty: 'easy',
  customTimerSeconds: 30,
};

export function getStoredScores(): ScoreRecord[] {
  try {
    const data = localStorage.getItem(SCORES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveScoreRecord(record: ScoreRecord): void {
  try {
    const records = getStoredScores();
    records.unshift(record);
    // Keep max 100 records
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(records.slice(0, 100)));
  } catch {
    // Ignore storage errors
  }
}

export function deleteScoreRecord(id: string): ScoreRecord[] {
  try {
    const records = getStoredScores().filter(r => r.id !== id);
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(records));
    return records;
  } catch {
    return [];
  }
}

export function clearStoredScores(): void {
  try {
    localStorage.removeItem(SCORES_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export function getBestTimesMap(scores: ScoreRecord[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const s of scores) {
    if (s.won && s.timeElapsed > 0) {
      if (!map[s.categoryId] || s.timeElapsed < map[s.categoryId]) {
        map[s.categoryId] = s.timeElapsed;
      }
    }
  }
  return map;
}

export function getCustomChallenges(): CodeChallenge[] {
  try {
    const data = localStorage.getItem(CUSTOM_CHALLENGES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCustomChallenges(challenges: CodeChallenge[]): void {
  try {
    localStorage.setItem(CUSTOM_CHALLENGES_KEY, JSON.stringify(challenges));
  } catch {
    // Ignore
  }
}

export function getPreferences(): UserPreferences {
  try {
    const data = localStorage.getItem(PREFERENCES_KEY);
    return data ? { ...DEFAULT_PREFERENCES, ...JSON.parse(data) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: Partial<UserPreferences>): void {
  try {
    const current = getPreferences();
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ ...current, ...prefs }));
  } catch {
    // Ignore
  }
}

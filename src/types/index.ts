// Core TypeScript interfaces for MelodyMind

// ==================== MUSIC ====================

export interface Note {
  note: string; // 'C', 'D', 'E', 'F', 'G', 'A', 'B'
  duration: string; // '4' (quarter), '8' (eighth), '2' (half), '1' (whole)
  octave?: number;
}

export interface Melody {
  id: string;
  title: string;
  composer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  notes: Note[];
  rhythm: string[];
  timeSignature: [number, number];
  tempo: number;
}

// ==================== QUIZ ====================

export type QuestionType = 'recall' | 'definition' | 'application' | 'scenario' | 'fill-in-gap';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuizStatus = 'idle' | 'active' | 'complete';

export interface AnswerOption {
  label: string; // 'A', 'B', 'C', 'D'
  text: string;
  note: string; // Musical note mapped to this option
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  options: AnswerOption[];
  correctAnswer: string; // 'A', 'B', 'C', 'D'
  mappedNote: string; // Musical note for correct answer
}

export interface Answer {
  questionId: string;
  selectedOption: string;
  selectedNote: string;
  correctNote: string;
  isCorrect: boolean;
}

export interface Score {
  correct: number;
  total: number;
  accuracy: number;
}

export interface QuizState {
  status: QuizStatus;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answer[];
  selectedMelody: Melody | null;
  score: Score;
  xp: number;
}

export type QuizAction =
  | { type: 'START_QUIZ'; payload: { questions: Question[]; melody: Melody } }
  | { type: 'ANSWER_QUESTION'; payload: { selectedOption: string; selectedNote: string; correctNote: string; isCorrect: boolean } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESET_QUIZ' }
  | { type: 'LOAD_QUIZ'; payload: QuizState };

// ==================== GAMIFICATION ====================

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalQuizzes: number;
  perfectScores: number;
  totalXP: number;
  level: number;
  achievementsUnlocked: string[];
}

// ==================== PLAYBACK ====================

export type InstrumentMode = 'piano' | 'orchestra' | 'synth' | 'lofi';
export type PlaybackMode = 'student' | 'correct' | 'comparison';

export interface PlaybackConfig {
  instrument: InstrumentMode;
  speed: number;
  volume: number;
  loop: boolean;
}

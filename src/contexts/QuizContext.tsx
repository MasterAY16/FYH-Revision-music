'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { QuizState, QuizAction, Question, Melody, Answer, Score, QuizStatus } from '@/types';

// ==================== INITIAL STATE ====================

const initialScore: Score = { correct: 0, total: 0, accuracy: 0 };

const initialState: QuizState = {
  status: 'idle',
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  selectedMelody: null,
  score: initialScore,
  xp: 0,
};

// ==================== REDUCER ====================

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_QUIZ': {
      return {
        ...initialState,
        status: 'active',
        questions: action.payload.questions,
        selectedMelody: action.payload.melody,
      };
    }

    case 'ANSWER_QUESTION': {
      const { selectedOption, selectedNote, correctNote, isCorrect } = action.payload;
      const currentQuestion = state.questions[state.currentQuestionIndex];
      if (!currentQuestion) return state;

      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        selectedOption,
        selectedNote,
        correctNote,
        isCorrect,
      };

      const newAnswers = [...state.answers, newAnswer];
      const correctCount = newAnswers.filter((a) => a.isCorrect).length;
      const total = newAnswers.length;

      return {
        ...state,
        answers: newAnswers,
        score: {
          correct: correctCount,
          total,
          accuracy: total > 0 ? correctCount / total : 0,
        },
      };
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentQuestionIndex + 1;
      if (nextIndex >= state.questions.length) {
        return state; // Will be handled by COMPLETE_QUIZ
      }
      return {
        ...state,
        currentQuestionIndex: nextIndex,
      };
    }

    case 'COMPLETE_QUIZ': {
      const correctCount = state.answers.filter((a) => a.isCorrect).length;
      const total = state.questions.length;
      const accuracy = total > 0 ? correctCount / total : 0;
      const xp = Math.round(accuracy * 100);

      return {
        ...state,
        status: 'complete',
        score: {
          correct: correctCount,
          total,
          accuracy,
        },
        xp,
      };
    }

    case 'RESET_QUIZ': {
      return initialState;
    }

    case 'LOAD_QUIZ': {
      return action.payload;
    }

    default:
      return state;
  }
}

// ==================== CONTEXT ====================

interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  currentQuestion: Question | null;
  progress: number;
  startQuiz: (questions: Question[], melody: Melody) => void;
  answerQuestion: (selectedOption: string, selectedNote: string, correctNote: string, isCorrect: boolean) => void;
  nextQuestion: () => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  isLastQuestion: boolean;
}

const QuizContext = createContext<QuizContextType | null>(null);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('melodymind-quiz');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.status === 'active') {
          dispatch({ type: 'LOAD_QUIZ', payload: parsed });
        }
      }
    } catch {
      // Ignore corrupted state
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    if (state.status === 'active') {
      localStorage.setItem('melodymind-quiz', JSON.stringify(state));
    }
  }, [state]);

  const startQuiz = useCallback((questions: Question[], melody: Melody) => {
    dispatch({ type: 'START_QUIZ', payload: { questions, melody } });
  }, []);

  const answerQuestion = useCallback(
    (selectedOption: string, selectedNote: string, correctNote: string, isCorrect: boolean) => {
      dispatch({ type: 'ANSWER_QUESTION', payload: { selectedOption, selectedNote, correctNote, isCorrect } });
    },
    []
  );

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const completeQuiz = useCallback(() => {
    dispatch({ type: 'COMPLETE_QUIZ' });
    localStorage.removeItem('melodymind-quiz');
  }, []);

  const resetQuiz = useCallback(() => {
    dispatch({ type: 'RESET_QUIZ' });
    localStorage.removeItem('melodymind-quiz');
  }, []);

  const currentQuestion =
    state.status === 'active' && state.questions[state.currentQuestionIndex]
      ? state.questions[state.currentQuestionIndex]
      : null;

  const progress = state.questions.length > 0 ? (state.answers.length / state.questions.length) * 100 : 0;
  const isLastQuestion = state.answers.length > 0 && state.answers.length === state.questions.length;

  return (
    <QuizContext.Provider
      value={{
        state,
        dispatch,
        currentQuestion,
        progress,
        startQuiz,
        answerQuestion,
        nextQuestion,
        completeQuiz,
        resetQuiz,
        isLastQuestion,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}

export function useCurrentQuestion() {
  const { currentQuestion } = useQuiz();
  return currentQuestion;
}

export function useQuizProgress() {
  const { progress, state } = useQuiz();
  return {
    progress,
    current: state.answers.length,
    total: state.questions.length,
  };
}

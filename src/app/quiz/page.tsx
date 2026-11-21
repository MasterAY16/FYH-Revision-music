'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useQuiz, useQuizProgress } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { playbackEngine } from '@/lib/music/playbackEngine';
import { FiMusic, FiArrowRight, FiVolume2 } from 'react-icons/fi';
import Link from 'next/link';
import type { AnswerOption } from '@/types';

export default function QuizPage() {
  const router = useRouter();
  const { state, currentQuestion, answerQuestion, nextQuestion, completeQuiz, isLastQuestion } = useQuiz();
  const { current, total } = useQuizProgress();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [highlightedOption, setHighlightedOption] = useState<string | null>(null);

  // Redirect if quiz is complete (go to results) or idle (go home)
  useEffect(() => {
    if (state.status === 'complete') {
      router.push('/results');
    } else if (state.status !== 'active' || !currentQuestion) {
      router.push('/');
    }
  }, [state.status, currentQuestion, router]);

  // Reset answer state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setHighlightedOption(null);
  }, [currentQuestion?.id]);

  const handleAnswer = useCallback(
    async (option: AnswerOption) => {
      if (isAnswered) return;

      const isCorrect = option.note === currentQuestion?.mappedNote;
      setSelectedAnswer(option.label);
      setHighlightedOption(option.label);
      setIsAnswered(true);

      // Play the selected note
      await playbackEngine.init();
      playbackEngine.playNote(option.note);

      // Record the answer
      answerQuestion(option.label, option.note, currentQuestion?.mappedNote || '', isCorrect);

      // Auto-advance or complete
      setTimeout(() => {
        if (isLastQuestion || current + 1 >= total) {
          completeQuiz();
          // The useEffect will handle navigation to /results when status becomes 'complete'
        } else {
          nextQuestion();
        }
      }, 1200);
    },
    [isAnswered, currentQuestion, answerQuestion, isLastQuestion, current, total, nextQuestion, completeQuiz, router]
  );

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <nav className="w-full p-4 flex justify-between items-center border-b border-gray-800 bg-dark-900/80 backdrop-blur">
        <Link href="/" className="text-xl font-bold">
          <span className="text-gradient">MelodyMind</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400 font-mono">
            <FiMusic className="inline mr-1" />
            {state.selectedMelody?.title || 'Unknown Melody'}
          </div>
          <div className="text-sm text-cyan-400 font-mono">
            {current + 1} / {total}
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="px-6 py-2 bg-dark-900/50">
        <ProgressBar value={current + (isAnswered ? 1 : 0)} max={total} showLabel={false} />
      </div>

      <main className="flex-1 flex flex-col lg:flex-row items-start justify-center px-6 py-8 gap-8">
        {/* Question Section */}
        <div className="flex-1 w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question Type & Difficulty */}
              <div className="flex gap-2 mb-4">
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 font-mono uppercase">
                  {currentQuestion.type}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-mono uppercase ${
                    currentQuestion.difficulty === 'easy'
                      ? 'bg-success-400/10 text-success-400 border border-success-400/30'
                      : currentQuestion.difficulty === 'medium'
                      ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30'
                      : 'bg-error-400/10 text-error-400 border border-error-400/30'
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
              </div>

              {/* Question Text */}
              <Card glow className="mb-8">
                <h2 className="text-2xl font-bold leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </Card>

              {/* Answer Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = highlightedOption === option.label;
                  const isCorrectNote = option.note === currentQuestion.mappedNote;

                  return (
                    <motion.button
                      key={option.label}
                      onClick={() => handleAnswer(option)}
                      disabled={isAnswered}
                      whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                      whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                      className={`relative p-5 rounded-xl border-2 text-left transition-all duration-300 ${
                        isAnswered
                          ? isSelected
                            ? isCorrectNote
                              ? 'border-success-400 bg-success-400/10'
                              : 'border-error-400 bg-error-400/10'
                            : 'border-gray-700 bg-dark-800 opacity-50'
                          : 'border-gray-700 bg-dark-800 hover:border-cyan-400 hover:bg-cyan-400/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono text-gray-400">
                          {option.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <FiVolume2 className="text-cyan-400" />
                          <span className="text-lg font-bold text-cyan-400">
                            ♪ {option.note}
                          </span>
                        </div>
                      </div>
                      <p className="text-white">{option.text}</p>

                      {isAnswered && isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                            isCorrectNote
                              ? 'bg-success-400 text-black'
                              : 'bg-error-400 text-white'
                          }`}
                        >
                          {isCorrectNote ? '✓' : '✗'}
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Note Indicator */}
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-center"
                >
                  <p className="text-gray-400 text-sm">
                    Note{' '}
                    <span className="text-cyan-400 font-bold">
                      {currentQuestion.options.find((o) => o.label === selectedAnswer)?.note}
                    </span>{' '}
                    added to your score
                    <FiMusic className="inline ml-1 text-cyan-400" />
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Score Preview (Desktop) */}
        <div className="hidden lg:block w-80">
          <Card className="sticky top-6">
            <h3 className="text-sm font-mono text-gray-400 mb-4 uppercase tracking-wider">
              Your Score
            </h3>
            <div className="flex flex-wrap gap-2">
              {state.answers.map((answer, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                    answer.isCorrect
                      ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/40'
                      : 'bg-error-400/20 text-error-400 border border-error-400/40'
                  }`}
                >
                  {answer.selectedNote}
                </motion.div>
              ))}
              {state.answers.length === 0 && (
                <p className="text-gray-600 text-sm italic">
                  Answer questions to build your melody...
                </p>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

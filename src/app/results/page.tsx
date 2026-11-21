'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { playbackEngine } from '@/lib/music/playbackEngine';
import { updateStatsAfterQuiz, loadUserStats, achievements as allAchievements } from '@/lib/gamification/xpSystem';
import { FiMusic, FiPlay, FiRefreshCw, FiUpload, FiAward, FiShare2 } from 'react-icons/fi';
import Link from 'next/link';
import type { InstrumentMode } from '@/types';

export default function ResultsPage() {
  const router = useRouter();
  const { state, resetQuiz } = useQuiz();

  const [isPlaying, setIsPlaying] = useState<'student' | 'correct' | null>(null);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number | null>(null);
  const [instrument, setInstrument] = useState<InstrumentMode>('piano');
  const [userStats, setUserStats] = useState(() => loadUserStats());
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  // Redirect if quiz not complete
  useEffect(() => {
    if (state.status !== 'complete') {
      router.push('/');
    }
  }, [state.status, router]);

  // Update stats on mount
  useEffect(() => {
    if (state.status === 'complete') {
      const stats = updateStatsAfterQuiz(state.score.accuracy, state.score.total);
      setUserStats(stats);
      setNewAchievements(
        stats.achievementsUnlocked.filter((id) => !loadUserStats().achievementsUnlocked.includes(id))
      );
    }
  }, [state.status]);

  const accuracyPercent = Math.round(state.score.accuracy * 100);
  const studentNotes = state.answers.map((a) => ({
    note: a.selectedNote,
    duration: '4',
    isCorrect: a.isCorrect,
  }));
  const correctNotes = state.selectedMelody?.notes.map((n) => ({
    ...n,
    isCorrect: true,
  })) || [];

  const handlePlayMelody = useCallback(
    async (type: 'student' | 'correct') => {
      if (isPlaying) return;

      setIsPlaying(type);
      await playbackEngine.init();
      playbackEngine.setInstrument(instrument);

      const notes = type === 'student'
        ? studentNotes.map((n) => ({ note: n.note, duration: n.duration }))
        : correctNotes.map((n) => ({ note: n.note, duration: n.duration }));

      await playbackEngine.playMelody(notes, (index) => {
        setCurrentNoteIndex(index);
        setTimeout(() => setCurrentNoteIndex(null), 300);
      });

      setIsPlaying(null);
    },
    [isPlaying, instrument, studentNotes, correctNotes]
  );

  const handleShare = useCallback(() => {
    const text = `🎵 I just scored ${accuracyPercent}% on MelodyMind! Can you beat my melody? #MelodyMind`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  }, [accuracyPercent]);

  const handleTryAgain = useCallback(() => {
    resetQuiz();
    router.push('/upload');
  }, [resetQuiz, router]);

  const unlockedAchievements = allAchievements.filter((a) =>
    userStats.achievementsUnlocked.includes(a.id)
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full p-4 flex justify-between items-center border-b border-gray-800 bg-dark-900/80 backdrop-blur">
        <Link href="/" className="text-xl font-bold">
          <span className="text-gradient">MelodyMind</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 font-mono">
            Level {userStats.level} • {userStats.totalXP} XP
          </span>
        </div>
      </nav>

      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        {/* Header */}
        <AnimatedContainer>
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-6xl mb-4"
            >
              {accuracyPercent === 100 ? '🎉' : accuracyPercent >= 70 ? '🎵' : '🎶'}
            </motion.div>
            <h1 className="text-4xl font-bold mb-3">
              {accuracyPercent === 100
                ? 'Perfect Melody!'
                : accuracyPercent >= 70
                ? 'Great Performance!'
                : 'Keep Practicing!'}
            </h1>
            <p className="text-gray-400 text-lg">
              {state.selectedMelody?.title} by {state.selectedMelody?.composer}
            </p>
          </div>
        </AnimatedContainer>

        {/* Score Metrics */}
        <AnimatedContainer delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card glow className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">
                {accuracyPercent}%
              </div>
              <div className="text-sm text-gray-400">Knowledge Accuracy</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-magenta-400 mb-1">
                {state.score.correct}/{state.score.total}
              </div>
              <div className="text-sm text-gray-400">Correct Answers</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-success-400 mb-1">
                {state.xp}
              </div>
              <div className="text-sm text-gray-400">XP Earned</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">
                {Math.round(state.score.accuracy * 100)}%
              </div>
              <div className="text-sm text-gray-400">Revision Confidence</div>
            </Card>
          </div>
        </AnimatedContainer>

        {/* Melody Comparison */}
        <AnimatedContainer delay={0.4}>
          <Card glow className="mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FiMusic className="text-cyan-400" />
              Melody Comparison
            </h2>

            {/* Instrument Selector */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {(['piano', 'orchestra', 'synth', 'lofi'] as InstrumentMode[]).map((inst) => (
                <button
                  key={inst}
                  onClick={() => setInstrument(inst)}
                  className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                    instrument === inst
                      ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/40'
                      : 'bg-dark-700 text-gray-400 border border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {inst.charAt(0).toUpperCase() + inst.slice(1)}
                </button>
              ))}
            </div>

            {/* Student Melody */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">
                  Your Melody
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePlayMelody('student')}
                  disabled={isPlaying !== null}
                >
                  <FiPlay className="inline mr-1" />
                  Play
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {studentNotes.map((note, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                      currentNoteIndex === index && isPlaying === 'student'
                        ? 'bg-cyan-400 text-black scale-110'
                        : note.isCorrect
                        ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/40'
                        : 'bg-error-400/20 text-error-400 border border-error-400/40'
                    }`}
                  >
                    {note.note}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Correct Melody */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">
                  Perfect Melody
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePlayMelody('correct')}
                  disabled={isPlaying !== null}
                >
                  <FiPlay className="inline mr-1" />
                  Play
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {correctNotes.map((note, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                      currentNoteIndex === index && isPlaying === 'correct'
                        ? 'bg-success-400 text-black scale-110'
                        : 'bg-success-400/20 text-success-400 border border-success-400/40'
                    }`}
                  >
                    {note.note}
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </AnimatedContainer>

        {/* Achievements */}
        {unlockedAchievements.length > 0 && (
          <AnimatedContainer delay={0.6}>
            <Card className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiAward className="text-yellow-400" />
                Achievements
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {allAchievements.map((achievement) => {
                  const isUnlocked = userStats.achievementsUnlocked.includes(achievement.id);
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`text-center p-4 rounded-xl border ${
                        isUnlocked
                          ? 'bg-yellow-400/10 border-yellow-400/30'
                          : 'bg-dark-700 border-gray-700 opacity-40'
                      }`}
                    >
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <div className="text-sm font-semibold mb-1">{achievement.title}</div>
                      <div className="text-xs text-gray-500">{achievement.description}</div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </AnimatedContainer>
        )}

        {/* Actions */}
        <AnimatedContainer delay={0.8}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="primary" onClick={handleTryAgain}>
              <FiUpload className="inline mr-2" />
              Upload New Notes
            </Button>
            <Button size="lg" variant="secondary" onClick={handleShare}>
              <FiShare2 className="inline mr-2" />
              Share Results
            </Button>
            <Link href="/">
              <Button size="lg" variant="ghost">
                <FiRefreshCw className="inline mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </AnimatedContainer>
      </main>
    </div>
  );
}

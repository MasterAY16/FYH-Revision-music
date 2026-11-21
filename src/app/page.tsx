'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { FiMusic, FiUpload, FiAward, FiPlay } from 'react-icons/fi';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full p-6 flex justify-between items-center border-b border-gray-800">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold"
        >
          <span className="text-gradient">MelodyMind</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-4"
        >
          <Link href="/upload" className="text-gray-400 hover:text-cyan-400 transition-colors">
            Get Started
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <AnimatedContainer>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6">
                <span className="terminal-text text-sm tracking-wider uppercase">
                  {'> system.init("melodymind")'}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Turn Revision
                <br />
                <span className="text-gradient">Into Music</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-2xl mx-auto">
                Answer questions. Build a melody.
              </p>
              <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
                The more correct your answers, the better your song sounds.
                Knowledge literally becomes music.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href="/upload">
                  <Button size="lg" variant="primary">
                    <FiUpload className="inline mr-2" />
                    Upload Notes
                  </Button>
                </Link>
                <Link href="/upload?demo=true">
                  <Button size="lg" variant="secondary">
                    <FiPlay className="inline mr-2" />
                    Try Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatedContainer>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <AnimatedContainer delay={0.2}>
              <Card glow className="text-left h-full">
                <div className="text-cyan-400 text-4xl mb-4">
                  <FiMusic />
                </div>
                <h3 className="text-xl font-bold mb-2">Knowledge = Notes</h3>
                <p className="text-gray-400">
                  Each answer you give becomes a musical note. Correct answers build harmonious melodies; wrong answers create dissonance.
                </p>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer delay={0.4}>
              <Card glow className="text-left h-full">
                <div className="text-magenta-400 text-4xl mb-4">
                  <FiUpload />
                </div>
                <h3 className="text-xl font-bold mb-2">Progress = Score</h3>
                <p className="text-gray-400">
                  Watch your musical score fill up in real-time as you answer questions. Your learning journey becomes a visible composition.
                </p>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer delay={0.6}>
              <Card glow className="text-left h-full">
                <div className="text-success-400 text-4xl mb-4">
                  <FiAward />
                </div>
                <h3 className="text-xl font-bold mb-2">Learning = Melody</h3>
                <p className="text-gray-400">
                  Compare your melody with the perfect version. Hear how well you performed and identify areas for improvement.
                </p>
              </Card>
            </AnimatedContainer>
          </div>

          {/* Tagline */}
          <AnimatedContainer delay={0.8}>
            <motion.div
              className="mt-16 pt-8 border-t border-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-600 font-mono text-sm">
                {'// "Learn the Notes. Become the Melody."'}
              </p>
            </motion.div>
          </AnimatedContainer>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-600 text-sm border-t border-gray-800">
        <p>MelodyMind — Transforming education through music</p>
      </footer>
    </div>
  );
}

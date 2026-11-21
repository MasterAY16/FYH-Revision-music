'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { useQuiz } from '@/contexts/QuizContext';
import { processUpload } from '@/lib/ai/mockQuestionGenerator';
import { FiUpload, FiFileText, FiCheck } from 'react-icons/fi';
import Link from 'next/link';

type ProcessingStep = 'extracting' | 'generating' | 'building' | 'preparing' | 'complete';

const processingSteps: { key: ProcessingStep; label: string }[] = [
  { key: 'extracting', label: 'Extracting Concepts...' },
  { key: 'generating', label: 'Generating Questions...' },
  { key: 'building', label: 'Building Melody Framework...' },
  { key: 'preparing', label: 'Preparing Music Challenge...' },
];

function UploadContent({ isDemo }: { isDemo: boolean }) {
  const router = useRouter();
  const { startQuiz } = useQuiz();

  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('extracting');
  const [pastedText, setPastedText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (isDemo && !isProcessing) {
      handleProcess('Demo mode — using sample content');
    }
  }, [isDemo]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      handleProcess(`Uploaded: ${file.name}`);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      handleProcess(`Uploaded: ${file.name}`);
    }
  }, []);

  const handlePasteSubmit = useCallback(() => {
    if (pastedText.trim()) {
      handleProcess(pastedText.trim());
    }
  }, [pastedText]);

  const handleProcess = async (content: string) => {
    setIsProcessing(true);
    setProcessingStep('extracting');

    const stepDelay = 500;
    for (let i = 0; i < processingSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepDelay));
      setProcessingStep(processingSteps[i].key);
    }

    try {
      const { melody, questions } = await processUpload(content);
      startQuiz(questions, melody);
      router.push('/quiz');
    } catch {
      console.error('Failed to process upload');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full p-6 flex justify-between items-center border-b border-gray-800">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-gradient">MelodyMind</span>
        </Link>
        <Link href="/" className="text-gray-400 hover:text-cyan-400 transition-colors">
          Back to Home
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <ProcessingAnimation key="processing" currentStep={processingStep} />
            ) : (
              <AnimatedContainer key="upload">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold mb-3">
                    Upload Your <span className="text-gradient">Study Materials</span>
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Upload lecture notes, slides, or paste text to generate your revision quiz.
                  </p>
                </div>

                <Card glow className="mb-6">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
                      isDragOver
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <FiUpload className="text-5xl mx-auto mb-4 text-cyan-400" />
                    <p className="text-lg font-semibold mb-2">
                      {fileName || 'Drag & drop your files here'}
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      PDF, PPTX, DOCX, TXT, Markdown
                    </p>
                    <Button variant="ghost" size="sm">
                      Browse Files
                    </Button>
                    <input
                      id="file-input"
                      type="file"
                      accept=".pdf,.pptx,.docx,.txt,.md,.csv"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                </Card>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gray-800" />
                  <span className="text-gray-500 text-sm">OR</span>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>

                <Card>
                  <label className="block text-sm font-semibold mb-3 text-gray-300">
                    <FiFileText className="inline mr-2" />
                    Paste Your Notes
                  </label>
                  <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste your lecture notes, study material, or any text here..."
                    className="w-full h-40 bg-dark-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none transition-colors"
                  />
                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={handlePasteSubmit}
                      disabled={!pastedText.trim()}
                    >
                      Generate Quiz
                    </Button>
                  </div>
                </Card>

                <div className="text-center mt-6">
                  <p className="text-gray-600 text-sm">
                    No notes?{' '}
                    <Link href="/upload?demo=true" className="text-cyan-400 hover:underline">
                      Try demo mode
                    </Link>
                  </p>
                </div>
              </AnimatedContainer>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function UploadPage() {
  return <UploadContent isDemo={false} />;
}

function ProcessingAnimation({ currentStep }: { currentStep: ProcessingStep }) {
  const currentStepIndex = processingSteps.findIndex((s) => s.key === currentStep);

  return (
    <motion.div
      key="processing"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center"
    >
      <Card glow className="p-12">
        <div className="mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-6 border-4 border-cyan-400 border-t-transparent rounded-full"
          />
          <h2 className="text-2xl font-bold mb-2">Processing Your Notes</h2>
          <p className="text-gray-400">AI is generating your revision quiz...</p>
        </div>

        <div className="space-y-4">
          {processingSteps.map((step, index) => (
            <motion.div
              key={step.key}
              className="flex items-center gap-4"
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: index <= currentStepIndex ? 1 : 0.3,
              }}
              transition={{ duration: 0.3 }}
            >
              {index < currentStepIndex ? (
                <FiCheck className="text-success-400 text-xl" />
              ) : index === currentStepIndex ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-6 h-6 border-2 border-cyan-400 rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                </motion.div>
              ) : (
                <div className="w-6 h-6 border-2 border-gray-700 rounded-full" />
              )}
              <span
                className={
                  index <= currentStepIndex ? 'text-white' : 'text-gray-600'
                }
              >
                {step.label}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

import type { Melody, Question, AnswerOption, QuestionType, Difficulty } from '@/types';
import { getRandomMelody } from '@/data/melodies';
import { getCorrectNoteForQuestion, generateAnswerOptions } from '@/lib/music/melodyMapper';

// Sample question templates for mock AI
const questionTemplates: Record<QuestionType, string[]> = {
  recall: [
    'What is the primary function of {concept}?',
    'Which of the following best describes {concept}?',
    'What does {concept} refer to in this context?',
    'Recall the definition of {concept}.',
  ],
  definition: [
    'Define the term "{concept}".',
    'What is meant by "{concept}"?',
    'How would you define {concept}?',
    'Which definition best matches {concept}?',
  ],
  application: [
    'How would you apply {concept} in a real-world scenario?',
    'Which scenario best demonstrates {concept}?',
    'In which situation would {concept} be most useful?',
    'Apply {concept} to solve the following problem.',
  ],
  scenario: [
    'Given the following scenario, which concept applies?',
    'A student encounters {concept}. What should they do?',
    'In a practical setting, how does {concept} work?',
    'Which approach uses {concept} most effectively?',
  ],
  'fill-in-gap': [
    'The process of {concept} involves ___.',
    '{concept} is essential for ___.',
    'Without {concept}, the system would ___.',
    'The key characteristic of {concept} is ___.',
  ],
};

// Sample concepts for mock questions
const sampleConcepts = [
  'Data Structures',
  'Algorithms',
  'Object-Oriented Programming',
  'Recursion',
  'Binary Search',
  'Hash Tables',
  'Linked Lists',
  'Stacks and Queues',
  'Dynamic Programming',
  'Graph Theory',
  'Sorting Algorithms',
  'Time Complexity',
  'Memory Management',
  'API Design',
  'Database Normalization',
  'Network Protocols',
  'Encryption',
  'Machine Learning',
  'Neural Networks',
  'Software Testing',
  'Design Patterns',
  'Microservices',
  'Cloud Computing',
  'Version Control',
  'Agile Methodology',
];

// Sample answer options for mock questions
const sampleAnswers: Record<string, string[]> = {
  'Data Structures': ['Ways to organize and store data', 'A type of database', 'A programming language', 'A web framework'],
  'Algorithms': ['Step-by-step procedures for solving problems', 'Hardware components', 'Operating systems', 'Network protocols'],
  'Object-Oriented Programming': ['Programming paradigm based on objects', 'Functional programming style', 'Low-level assembly coding', 'Scripting language approach'],
  'Recursion': ['A function calling itself', 'A loop structure', 'A data type', 'A memory allocation method'],
  'Binary Search': ['Search algorithm for sorted arrays', 'Linear search method', 'Database query technique', 'File compression method'],
  'Hash Tables': ['Data structure using key-value pairs', 'A sorting algorithm', 'A tree structure', 'A linked list variant'],
  'Linked Lists': ['Sequential data structure with nodes', 'Array-based storage', 'Tree data structure', 'Graph representation'],
  'Stacks and Queues': ['LIFO and FIFO data structures', 'Database tables', 'Network layers', 'File systems'],
  'Dynamic Programming': ['Optimization through subproblem solutions', 'Real-time compilation', 'Memory allocation', 'Network routing'],
  'Graph Theory': ['Study of networks and connections', 'Database design', 'UI layout', 'Color theory'],
  'Sorting Algorithms': ['Methods to order data elements', 'Search techniques', 'Compression methods', 'Encryption schemes'],
  'Time Complexity': ['Measure of algorithm efficiency', 'Memory usage', 'Network speed', 'Disk I/O rate'],
  'Memory Management': ['Allocation and deallocation of memory', 'CPU scheduling', 'Disk formatting', 'Network bandwidth'],
  'API Design': ['Creating interfaces for software interaction', 'Database schema design', 'UI wireframing', 'Code documentation'],
  'Database Normalization': ['Organizing data to reduce redundancy', 'Data encryption', 'Backup procedures', 'Query optimization'],
  'Network Protocols': ['Rules for data communication', 'Hardware specifications', 'Software licenses', 'Coding standards'],
  'Encryption': ['Securing data through transformation', 'Data compression', 'File organization', 'Network routing'],
  'Machine Learning': ['AI systems that learn from data', 'Manual programming', 'Database management', 'Web development'],
  'Neural Networks': ['AI models inspired by brain structure', 'Computer networks', 'Social media platforms', 'File systems'],
  'Software Testing': ['Verifying software correctness', 'Code writing', 'System design', 'Project management'],
  'Design Patterns': ['Reusable solutions to common problems', 'UI color schemes', 'Database schemas', 'API endpoints'],
  'Microservices': ['Architecture with small independent services', 'Monolithic applications', 'Database clusters', 'Load balancers'],
  'Cloud Computing': ['Delivery of computing services over internet', 'Local server hosting', 'Offline storage', 'Peer-to-peer networks'],
  'Version Control': ['Tracking changes in source code', 'Memory management', 'Network monitoring', 'File compression'],
  'Agile Methodology': ['Iterative software development approach', 'Waterfall model', 'Database design', 'Hardware assembly'],
};

const questionTypes: QuestionType[] = ['recall', 'definition', 'application', 'scenario', 'fill-in-gap'];
const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

/**
 * Generates mock questions based on a melody
 * Each question's correct answer maps to the corresponding melody note
 */
export function generateMockQuestions(melody?: Melody): Question[] {
  const selectedMelody = melody || getRandomMelody();
  const noteSequence = selectedMelody.notes.map((n) => n.note);

  // Generate questions equal to melody length, or pad with repeated melody if needed
  const questionCount = Math.max(noteSequence.length, 20);
  const questions: Question[] = [];

  for (let i = 0; i < questionCount; i++) {
    const correctNote = noteSequence[i % noteSequence.length];
    const concept = sampleConcepts[i % sampleConcepts.length];
    const type = questionTypes[i % questionTypes.length];
    const difficulty = i < questionCount / 3 ? 'easy' : i < (2 * questionCount) / 3 ? 'medium' : 'hard';

    // Get template and fill in concept
    const templates = questionTemplates[type];
    const template = templates[i % templates.length];
    const text = template.replace('{concept}', concept);

    // Get sample answers
    const answers = sampleAnswers[concept] || ['Correct answer', 'Wrong answer 1', 'Wrong answer 2', 'Wrong answer 3'];

    // Generate answer options mapped to notes
    const options = generateAnswerOptions(correctNote);

    // Map sample answer text to options
    const finalOptions: AnswerOption[] = options.map((opt, idx) => ({
      ...opt,
      text: answers[idx] || `Option ${opt.label}`,
    }));

    // Find which label has the correct note
    const correctLabel = finalOptions.find((o) => o.note === correctNote)?.label || 'A';

    questions.push({
      id: `q-${i + 1}`,
      text,
      type,
      difficulty,
      options: finalOptions,
      correctAnswer: correctLabel,
      mappedNote: correctNote,
    });
  }

  return questions;
}

/**
 * Extracts mock concepts from uploaded text
 */
export function extractConceptsFromText(_text: string): string[] {
  // Mock extraction — returns sample concepts
  // In production, this would use NLP to extract key terms
  const count = Math.min(sampleConcepts.length, 10 + Math.floor(Math.random() * 10));
  return sampleConcepts.slice(0, count);
}

/**
 * Processes uploaded content and returns quiz-ready data
 */
export async function processUpload(content: string): Promise<{
  melody: Melody;
  questions: Question[];
  concepts: string[];
}> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const melody = getRandomMelody();
  const concepts = extractConceptsFromText(content);
  const questions = generateMockQuestions(melody);

  return { melody, questions, concepts };
}

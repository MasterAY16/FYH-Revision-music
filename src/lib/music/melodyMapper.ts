import type { Melody, Question, AnswerOption } from '@/types';

// Available notes for answer mapping
const AVAILABLE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

/**
 * Maps a melody's notes to question positions.
 * Each question's correct answer will correspond to the melody note at that position.
 */
export function mapMelodyToQuestions(melody: Melody): string[] {
  return melody.notes.map((n) => n.note);
}

/**
 * Gets the correct note for a given question index based on the melody
 */
export function getCorrectNoteForQuestion(melody: Melody, questionIndex: number): string {
  if (questionIndex >= melody.notes.length) {
    // If we have more questions than melody notes, cycle through the melody
    const cycledIndex = questionIndex % melody.notes.length;
    return melody.notes[cycledIndex].note;
  }
  return melody.notes[questionIndex].note;
}

/**
 * Generates answer options where the correct answer maps to the target note
 * The options are shuffled so the correct answer position varies
 */
export function generateAnswerOptions(correctNote: string): AnswerOption[] {
  // Get 3 wrong notes (different from correct note)
  const wrongNotes = AVAILABLE_NOTES.filter((n) => n !== correctNote);

  // Shuffle and pick 3
  const shuffled = wrongNotes.sort(() => Math.random() - 0.5).slice(0, 3);

  // Combine with correct note
  const allNotes = [correctNote, ...shuffled];

  // Shuffle the options
  const shuffledOptions = allNotes.sort(() => Math.random() - 0.5);

  const labels = ['A', 'B', 'C', 'D'];

  return shuffledOptions.map((note, index) => ({
    label: labels[index],
    text: note,
    note,
  }));
}

/**
 * Gets the note associated with a specific answer option label
 */
export function getNoteForOption(options: AnswerOption[], label: string): string {
  const option = options.find((o) => o.label === label);
  return option?.note || 'C';
}

/**
 * Checks if a selected option is correct
 */
export function isAnswerCorrect(options: AnswerOption[], selectedLabel: string, correctNote: string): boolean {
  const selectedOption = options.find((o) => o.label === selectedLabel);
  return selectedOption?.note === correctNote;
}

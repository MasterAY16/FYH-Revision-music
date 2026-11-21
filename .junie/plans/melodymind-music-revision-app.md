---
sessionId: session-261121-153433-b30c
---

# Requirements

### Overview & Goals

MelodyMind is a production-ready web application that transforms academic revision into a musical puzzle. Students upload study materials, answer AI-generated questions where each answer maps to a musical note, and build a musical score as they progress. If they answer correctly, their score forms a recognizable melody; incorrect answers create dissonance. Performance becomes audible — knowledge literally becomes music.

**Tagline:** "Learn the Notes. Become the Melody."

### Scope

**In Scope (MVP):**
- Landing page with hero section and call-to-action
- Document upload interface (PDF, PPTX, DOCX, TXT, Markdown, paste text)
- Mock AI question generation (20-50 questions from sample content)
- Musical answer system (4 options mapped to notes C/D/E/G)
- Live musical score visualization (VexFlow)
- Real-time note playback (Tone.js)
- Quiz completion with split-screen melody comparison
- Music playback engine with multiple instrument modes
- Gamification (XP, levels, achievements)
- Dark futuristic design system
- Mobile-responsive design

**Out of Scope (Future):**
- Real OpenAI API integration (mock AI for MVP)
- User authentication (Clerk)
- Multiplayer mode
- Adaptive learning / Remix Round
- PostgreSQL database with Prisma
- Supabase storage
- Server-side audio generation

### User Stories

1. As a student, I want to upload my lecture notes so that the system can generate revision questions.
2. As a student, I want to answer questions where each choice is a musical note so that I feel like I'm building a song.
3. As a student, I want to see my musical score fill up in real-time so that I can visualize my progress as music.
4. As a student, I want to hear my melody at the end so that I can tell how well I performed.
5. As a student, I want to compare my melody with the correct version so that I can see where I made mistakes.
6. As a student, I want to earn XP and achievements so that I stay motivated to revise more.

### Functional Requirements

- **Upload**: Drag-and-drop interface supporting multiple file formats and text paste
- **Processing**: Animated progress showing AI extraction, question generation, and melody building
- **Quiz**: 20-50 questions with 4 answer options, each mapped to a musical note
- **Scoring**: Live score visualization that fills as answers are given
- **Feedback**: Subtle visual feedback (harmonious vs dissonant) without revealing correct answers immediately
- **Results**: Split-screen comparison of student vs perfect melody with accuracy metrics
- **Playback**: Multiple playback modes (student, correct, comparison) with instrument selection
- **Gamification**: XP system, levels, and unlockable achievements

### Non-Functional Requirements

- **Performance**: Smooth 60fps animations for note insertion and playback
- **Accessibility**: Keyboard navigation, ARIA labels, screen reader support
- **Responsiveness**: Mobile-first design that works on phones, tablets, and desktops
- **Audio Quality**: Clear note playback with minimal latency using WebAudio API
- **Design Consistency**: Dark futuristic theme with neon accents throughout

# Technical Design

### Current Implementation

The project repository contains only a Java skeleton file (`src/Main.java`) with a Hello World template. This is a greenfield project — the entire Next.js application will be built from scratch, replacing the Java file.

### Key Decisions

- **Framework**: Next.js 14+ with App Router for server-side rendering and API routes
- **Language**: TypeScript for type safety across the codebase
- **Styling**: Tailwind CSS with custom theme (black background, cyan/magenta neon accents)
- **Animations**: Framer Motion for UI transitions and note animations
- **Music Engine**: Client-side only using Tone.js (playback) and VexFlow (notation rendering)
- **State Management**: React Context + useReducer (no external state library)
- **AI Integration**: Mock AI service for MVP — returns sample questions; real OpenAI integration deferred
- **Persistence**: localStorage for quiz state and gamification (no database for MVP)
- **Melody Database**: JSON structures with public domain melodies

### Architecture Overview

```
app/                          # Next.js App Router
├── page.tsx                  # Landing page
├── upload/page.tsx           # Upload screen
├── quiz/page.tsx             # Quiz screen
└── results/page.tsx          # Results screen

components/
├── ui/                       # Foundational UI (Button, Card, ProgressBar)
├── quiz/                     # QuestionScreen, AnswerButton
├── music/                    # ScoreDisplay, PlaybackControls
├── results/                  # ResultsScreen, MelodyComparison
└── gamification/             # AchievementBadge, XPBar

lib/
├── music/                    # MelodyMapper, NoteMapping, PlaybackEngine
├── ai/                       # MockQuestionGenerator
├── gamification/             # XPSystem, Achievements
└── utils/                    # Helpers, formatters

contexts/
└── QuizContext.tsx           # Quiz state management

types/
└── index.ts                  # TypeScript interfaces

data/
├── melodies.ts               # Melody database (JSON)
└── sampleQuestions.ts        # Mock questions for demo
```

### Data Models

**Melody Structure:**
```typescript
interface Melody {
  id: string;
  title: string;
  composer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  notes: Note[]; // e.g., [{ note: 'C', duration: '4' }, { note: 'C', duration: '4' }]
  rhythm: string[];
  timeSignature: [number, number]; // e.g., [4, 4]
  tempo: number;
}

interface Note {
  note: string; // 'C', 'D', 'E', 'F', 'G', 'A', 'B'
  duration: string; // '4' (quarter), '8' (eighth), '2' (half)
  octave?: number;
}
```

**Quiz State:**
```typescript
interface QuizState {
  status: 'idle' | 'active' | 'complete';
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answer[];
  selectedMelody: Melody;
  score: {
    correct: number;
    total: number;
    accuracy: number;
  };
  xp: number;
}

interface Question {
  id: string;
  text: string;
  type: 'recall' | 'definition' | 'application' | 'scenario' | 'fill-in-gap';
  difficulty: 'easy' | 'medium' | 'hard';
  options: AnswerOption[];
  correctAnswer: string; // 'A', 'B', 'C', 'D'
  mappedNote: string; // Musical note for correct answer
}

interface AnswerOption {
  label: string; // 'A', 'B', 'C', 'D'
  text: string;
  note: string; // Musical note mapped to this option
}

interface Answer {
  questionId: string;
  selectedOption: string;
  selectedNote: string;
  correctNote: string;
  isCorrect: boolean;
}
```

**Gamification:**
```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}

interface UserStats {
  totalQuizzes: number;
  perfectScores: number;
  totalXP: number;
  level: number;
  achievementsUnlocked: string[];
}
```

### Question-to-Note Mapping Logic

Core algorithm:
1. Select a melody from the database (e.g., "Ode to Joy": C C D C F E...)
2. For each note in the melody, create a question where the correct answer maps to that note
3. Map answer options to notes: A→C, B→D, C→E, D→G (rotated per question for variety)
4. If student selects the correct answer, the correct note is added to their score
5. If wrong, the note from their selected option is added (creating dissonance)

### Music Engine Flow

```
QuizContext (state)
    ↓
MelodyMapper (assigns notes to questions)
    ↓
NoteMapping (maps answers to notes)
    ↓
PlaybackEngine (Tone.js synthesis)
    ↓
ScoreDisplay (VexFlow rendering)
```

### AI Workflow (Mock for MVP)

1. User uploads document or pastes text
2. Mock service extracts "concepts" from sample content
3. Generates 20-50 questions based on predefined templates
4. Maps questions to selected melody notes
5. Returns structured question set to QuizContext

### Design System

- **Background**: #000000 (pure black)
- **Primary Text**: #FFFFFF (white)
- **Accent Cyan**: #00FFFF
- **Accent Magenta**: #FF00FF
- **Success Green**: #00FF88
- **Error Red**: #FF4444
- **Dot Matrix Pattern**: CSS background with radial gradients
- **Typography**: Monospace for code/terminal elements, Sans-serif for body
- **Animations**: Framer Motion for page transitions, note insertions, and UI feedback

# Testing

### Validation Approach

The application will be validated through manual testing of the end-to-end user flow, as this is an MVP with mock AI and client-side state management.

### Key Scenarios

1. **Landing → Upload → Quiz Flow**
   - Verify smooth navigation from landing page through upload to quiz
   - Test drag-and-drop and text paste upload methods
   - Confirm processing animation displays correctly

2. **Quiz Functionality**
   - Verify questions display with 4 answer options and note labels
   - Test answer selection triggers note animation and sound
   - Confirm live score visualization updates with each answer
   - Validate subtle feedback (correct = cyan glow, wrong = red tint)

3. **Music Engine**
   - Verify Tone.js plays notes correctly on answer selection
   - Test playback controls (play, pause, stop, loop)
   - Confirm instrument selector switches synthesis modes
   - Validate speed controls (0.5x, 1x, 1.5x, 2x)

4. **Results Screen**
   - Verify split-screen comparison displays correctly
   - Confirm accuracy metrics calculate properly
   - Test side-by-side melody playback
   - Validate achievement unlocks trigger correctly

5. **Melody Mapping**
   - Verify correct answers produce the target melody
   - Test that wrong answers create dissonant notes
   - Confirm multiple melodies work (Happy Birthday, Ode to Joy, etc.)

### Edge Cases

- **Empty Upload**: Handle case where user uploads without content
- **Quiz Refresh**: Verify localStorage persistence recovers quiz state
- **Audio Context**: Handle browser autoplay policy (require user interaction first)
- **Mobile Viewport**: Test score display and answer buttons on small screens
- **Keyboard Navigation**: Verify arrow keys and spacebar work for quiz interaction
- **Long Melodies**: Test performance with 50+ questions and long scores

### Test Changes

- No automated tests for MVP (mock AI, client-side only)
- Manual testing checklist for end-to-end flow
- Browser compatibility testing (Chrome, Firefox, Safari, Edge)

# Delivery Steps

### ✓ Step 1: Initialize Next.js project & design system
Set up the Next.js project foundation with TypeScript, Tailwind CSS, and the dark futuristic design system.

- Remove existing Java skeleton files.
- Initialize Next.js 14+ project with TypeScript and the App Router.
- Install dependencies: Tailwind CSS, Framer Motion, Tone.js, VexFlow, react-icons.
- Configure Tailwind with custom theme (black background, cyan/magenta neon accents, dot matrix patterns).
- Create global layout with dark theme provider.
- Build foundational UI components: Button, Card, ProgressBar, AnimatedContainer.
- Set up the project folder structure: `app/`, `components/`, `lib/`, `contexts/`, `types/`, `data/`.

### ✓ Step 2: Build landing page & upload flow
Create the hero landing page and document upload interface with drag-and-drop.

- Build LandingPage with hero headline 'Turn Revision Into Music', subheadline, and CTA buttons.
- Implement UploadScreen with drag-and-drop zone supporting PDF, PPTX, DOCX, TXT, Markdown, and paste-text.
- Add AI processing animation screen showing progress steps (Extracting Concepts → Generating Questions → Building Melody → Preparing Music).
- Create smooth page transitions using Framer Motion.
- Implement text extraction mock service that returns sample content for demo mode.
- Add routing between Landing → Upload → Processing → Quiz flow.

### ✓ Step 3: Create melody database & question-to-note mapping
Build the melody database and the core logic that maps questions to musical notes.

- Create `data/melodies.ts` with public domain melodies (Happy Birthday, Ode to Joy, Twinkle Twinkle, Jingle Bells, Mary Had a Little Lamb) as JSON structures with notes, rhythms, tempo, and difficulty.
- Implement `lib/music/melodyMapper.ts` with logic to assign melody notes to question positions.
- Build `lib/music/noteMapping.ts` to map answer options (A/B/C/D) to musical notes (C/D/E/G).
- Create `lib/ai/mockQuestionGenerator.ts` that generates 20-50 sample questions from mock document content.
- Implement question types: recall, definition, application, scenario, fill-in-gap.
- Add difficulty levels: Easy, Medium, Hard.
- Ensure correct answers map to the selected melody's notes sequence.

### ✓ Step 4: Implement quiz state management & context
Build React Context + useReducer for quiz state management across the entire quiz flow.

- Create `contexts/QuizContext.tsx` with QuizProvider component.
- Define quiz state interface: currentQuestionIndex, answers array, selected melody, questions array, score, quiz status (active/complete).
- Implement quiz reducer with actions: START_QUIZ, ANSWER_QUESTION, NEXT_QUESTION, COMPLETE_QUIZ, RESET_QUIZ.
- Create custom hooks: `useQuiz()`, `useCurrentQuestion()`, `useQuizProgress()`.
- Add state persistence to localStorage for refresh recovery.
- Build QuizConfigurator that selects a random melody and generates corresponding questions.

### ✓ Step 5: Build question screen & answer system
Create the main quiz interface with question display, answer buttons, and note visualization.

- Build `components/quiz/QuestionScreen.tsx` with question text, progress bar, and answer buttons.
- Implement `components/quiz/AnswerButton.tsx` with note labels (A ♪ C, B ♪ D, C ♪ E, D ♪ G).
- Add answer selection animation with Framer Motion (pulse, glow, note fly-to-score effect).
- Create subtle feedback system: correct notes appear harmonious (cyan glow), wrong notes appear slightly red/distorted.
- Do NOT reveal correct answers immediately — maintain game tension.
- Add 'Next Question' button with smooth transition.
- Integrate Tone.js to play the selected note sound on answer.
- Display current musical mode indicator (Piano/Jazz/Electronic/Orchestral).

### ✓ Step 6: Build live musical score visualization
Create the real-time musical score that fills as students answer questions.

- Integrate VexFlow library for proper music notation rendering.
- Build `components/music/ScoreDisplay.tsx` with treble clef, staff lines, and measure divisions.
- Implement note insertion animation as each answer is given.
- Highlight the current note position being added.
- Add zoom controls for the score display.
- Create responsive layout: score visible on the right (desktop) or bottom (mobile).
- Implement smooth transitions when new notes appear.
- Add measure auto-completion based on time signature (4/4 default).
- Display note names below staff for accessibility.

### ✓ Step 7: Implement quiz completion & results screen
Build the end-of-quiz experience with score reveal, metrics, and melody comparison.

- Create `components/results/ResultsScreen.tsx` with knowledge accuracy %, musical accuracy %, memorization score, and revision confidence.
- Build split-screen comparison: Student Melody (left) vs Perfect Melody (right).
- Highlight note differences visually (correct = green, incorrect = red).
- Display the completed musical score with all notes.
- Add 'Play My Melody' and 'Play Correct Melody' buttons.
- Implement share functionality (generate shareable result image/text).
- Add 'Try Again' and 'Upload New Notes' buttons.
- Create confetti animation for perfect scores.

### ✓ Step 8: Build music playback engine
Implement the Tone.js-based playback system with multiple modes and controls.

- Create `lib/music/playbackEngine.ts` using Tone.js Synthesizer.
- Implement playback controls: Play, Pause, Stop, Loop.
- Add speed controls: 0.5x, 1x, 1.5x, 2x.
- Add volume control slider.
- Implement instrument selector: Piano, Orchestra, Synth, Lo-Fi (using different Tone.js synthesizers).
- Build `components/music/PlaybackControls.tsx` UI component.
- Create side-by-side comparison playback mode (alternating between student and correct melody).
- Add visual waveform or note highlight during playback.
- Implement MIDI export functionality for student's melody.
- Add MusicXML generation for the completed score.

### ✓ Step 9: Add gamification layer
Implement XP, level system, and achievements to enhance engagement.

- Create `lib/gamification/xpSystem.ts` with XP calculation based on accuracy and speed.
- Implement level progression system (Level 1-20 with increasing XP thresholds).
- Build achievement system with badges: Perfect Pitch Scholar (100% melody), Quiz Virtuoso (5 quizzes), Memory Maestro (3 perfect scores), Song Builder (10 quizzes), Exam Composer (50 quizzes).
- Create `components/gamification/AchievementBadge.tsx` with unlock animations.
- Add XP gain notification popup when achievements unlock.
- Store gamification state in localStorage (no auth for MVP).
- Display current level, XP progress bar, and achievement grid in results screen.

### ✓ Step 10: Polish UI, responsiveness & final integration
Finalize the application with responsive design, animations, accessibility, and end-to-end integration.

- Implement mobile-responsive layouts for all screens (quiz, results, score display).
- Add loading states and skeleton screens for transitions.
- Implement keyboard navigation (arrow keys for answers, space for play/pause).
- Add ARIA labels and screen reader support for accessibility.
- Create dot matrix background pattern and neon accent animations.
- Add terminal-inspired typography and UI elements.
- Implement end-to-end flow testing: Landing → Upload → Processing → Quiz → Results → Playback.
- Add error boundaries and fallback UI for edge cases.
- Optimize performance: lazy load Tone.js and VexFlow, memoize components.
- Create README with setup instructions and demo mode guide.
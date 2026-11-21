# MelodyMind

**"Learn the Notes. Become the Melody."**

MelodyMind is a web application that transforms academic revision into a musical puzzle. Students upload study materials, answer AI-generated questions where each answer maps to a musical note, and build a musical score as they progress. If they answer correctly, their score forms a recognizable melody; incorrect answers create dissonance. Performance becomes audible — knowledge literally becomes music.

## Features

- **Document Upload**: Drag-and-drop interface supporting PDF, PPTX, DOCX, TXT, and Markdown files, plus text paste
- **Mock AI Questions**: 20-50 sample questions generated from study content
- **Musical Answer System**: 4 answer options mapped to musical notes (C/D/E/G)
- **Live Score Visualization**: Watch your musical score fill up in real-time
- **Real-time Audio**: Tone.js plays notes as you answer
- **Melody Comparison**: Split-screen comparison of your melody vs the perfect version
- **Multiple Instruments**: Piano, Orchestra, Synth, and Lo-Fi playback modes
- **Gamification**: XP system, levels, and unlockable achievements
- **Dark Futuristic Design**: Black background with cyan/magenta neon accents

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Music Engine**: Tone.js (playback)
- **State Management**: React Context + useReducer
- **Icons**: react-icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Demo Mode

To try the app without uploading any files:

1. Navigate to the landing page
2. Click "Try Demo" or go to `/upload?demo=true`
3. The app will automatically generate sample questions and start the quiz

## User Flow

1. **Landing Page**: Hero section with call-to-action
2. **Upload**: Upload study materials or paste text
3. **Processing**: Animated progress showing AI extraction
4. **Quiz**: Answer questions where each choice is a musical note
5. **Results**: Compare your melody with the perfect version

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Root layout with QuizProvider
│   ├── globals.css         # Global styles and Tailwind
│   ├── upload/page.tsx     # Upload screen
│   ├── quiz/page.tsx       # Quiz screen
│   └── results/page.tsx    # Results screen
├── components/
│   ├── ui/                 # Foundational UI components
│   └── ...
├── contexts/
│   └── QuizContext.tsx     # Quiz state management
├── lib/
│   ├── music/              # Music engine (playback, mapping)
│   ├── ai/                 # Mock question generator
│   └── gamification/       # XP and achievement system
├── types/
│   └── index.ts            # TypeScript interfaces
└── data/
    └── melodies.ts         # Melody database
```

## Melodies Included

- Happy Birthday (Traditional)
- Ode to Joy (Beethoven)
- Twinkle Twinkle Little Star (Traditional)
- Jingle Bells (Traditional)
- Mary Had a Little Lamb (Traditional)

## Future Roadmap

- Real OpenAI API integration for question generation
- User authentication with Clerk
- PostgreSQL database with Prisma ORM
- Multiplayer mode
- Adaptive learning / Remix Round
- VexFlow music notation rendering
- MIDI and MusicXML export

## License

MIT

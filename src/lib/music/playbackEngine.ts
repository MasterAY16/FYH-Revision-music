'use client';

import { start, now, Transport, Synth, MembraneSynth, MetalSynth, AMSynth } from 'tone';
import type { Note as MusicNote } from '@/types';
import type { InstrumentMode } from '@/types';

// Note frequency mapping for Tone.js
const NOTE_MAP: Record<string, string> = {
  C: 'C4',
  D: 'D4',
  E: 'E4',
  F: 'F4',
  G: 'G4',
  A: 'A4',
  B: 'B4',
};

class PlaybackEngine {
  private synth: Synth | MembraneSynth | MetalSynth | AMSynth | null = null;
  private currentInstrument: InstrumentMode = 'piano';
  private isInitialized = false;
  private volume: number = -10; // dB
  private speed: number = 1;

  async init() {
    if (this.isInitialized) return;

    await start();
    this.createSynth('piano');
    this.isInitialized = true;
  }

  private createSynth(instrument: InstrumentMode) {
    if (this.synth) {
      this.synth.dispose();
    }

    switch (instrument) {
      case 'piano':
        this.synth = new Synth({
          oscillator: { type: 'triangle' },
          envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.3,
            release: 1,
          },
        }).toDestination();
        break;
      case 'orchestra':
        this.synth = new Synth({
          oscillator: { type: 'sine' },
          envelope: {
            attack: 0.05,
            decay: 0.2,
            sustain: 0.6,
            release: 2,
          },
        }).toDestination();
        break;
      case 'synth':
        this.synth = new AMSynth({
          harmonicity: 2,
          oscillator: { type: 'sawtooth' },
          modulation: { type: 'square' },
          envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.4,
            release: 0.5,
          },
          modulationEnvelope: {
            attack: 0.5,
            decay: 0,
            sustain: 1,
            release: 0.5,
          },
        }).toDestination();
        break;
      case 'lofi':
        this.synth = new Synth({
          oscillator: { type: 'sine' },
          envelope: {
            attack: 0.02,
            decay: 0.3,
            sustain: 0.2,
            release: 1.5,
          },
        }).toDestination();
        break;
    }

    this.synth.volume.value = this.volume;
    this.currentInstrument = instrument;
  }

  setInstrument(instrument: InstrumentMode) {
    this.createSynth(instrument);
  }

  setVolume(db: number) {
    this.volume = db;
    if (this.synth) {
      this.synth.volume.value = db;
    }
  }

  setSpeed(speed: number) {
    this.speed = speed;
    Transport.bpm.value = 120 * speed;
  }

  playNote(note: string, duration: string = '4n') {
    if (!this.synth || !this.isInitialized) return;

    const toneNote = NOTE_MAP[note] || 'C4';
    this.synth.triggerAttackRelease(toneNote, duration);
  }

  async playMelody(notes: MusicNote[], onNotePlay?: (index: number) => void) {
    if (!this.isInitialized) {
      await this.init();
    }

    const startTime = now();
    const beatDuration = 60 / (120 * this.speed); // seconds per beat

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const toneNote = NOTE_MAP[note.note] || 'C4';
      const duration = this.getDuration(note.duration);

      if (this.synth) {
        this.synth.triggerAttackRelease(toneNote, duration, startTime + i * beatDuration);
      }

      if (onNotePlay) {
        setTimeout(() => onNotePlay(i), i * beatDuration * 1000);
      }
    }
  }

  private getDuration(duration: string): string {
    switch (duration) {
      case '1': return '1n';
      case '2': return '2n';
      case '4': return '4n';
      case '8': return '8n';
      default: return '4n';
    }
  }

  stop() {
    if (this.synth && 'releaseAll' in this.synth) {
      (this.synth as any).releaseAll();
    }
    Transport.stop();
  }

  dispose() {
    if (this.synth) {
      this.synth.dispose();
      this.synth = null;
    }
    this.isInitialized = false;
  }
}

// Singleton instance
export const playbackEngine = new PlaybackEngine();

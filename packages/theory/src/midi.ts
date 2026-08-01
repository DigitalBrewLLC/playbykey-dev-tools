import { getNoteIndex, noteAtIndex } from './engine';
import type { Note } from './types';

const FREQUENCY_A4 = 440;
const MIDI_A4 = 69;

/**
 * MIDI note number for a note at a given octave, using scientific pitch
 * notation (C4 = middle C = MIDI 60).
 *
 * @param note - Note, sharps-only chromatic spelling
 * @param octave - Octave in scientific pitch notation (4 = the octave containing middle C)
 * @returns MIDI note number, 0-127 for valid scientific-pitch-notation input
 *
 * @example
 * noteToMidi("C", 4)
 * // → 60
 * noteToMidi("A", 4)
 * // → 69
 */
const noteToMidi = (note: Note, octave: number): number =>
  12 * (octave + 1) + getNoteIndex(note);

/**
 * Note and octave for a given MIDI note number, inverse of `noteToMidi`.
 *
 * @param midiNumber - MIDI note number (0-127 is the standard range, but not enforced here)
 * @returns `{ note, octave }` in scientific pitch notation
 *
 * @example
 * midiToNote(60)
 * // → { note: "C", octave: 4 }
 * midiToNote(69)
 * // → { note: "A", octave: 4 }
 */
const midiToNote = (midiNumber: number): { note: Note; octave: number } => {
  const octave = Math.floor(midiNumber / 12) - 1;
  const chromaticIndex = ((midiNumber % 12) + 12) % 12;
  return { note: noteAtIndex(chromaticIndex), octave };
};

/**
 * Frequency in Hz for a note at a given octave, equal temperament, A4 = 440Hz.
 *
 * @param note - Note, sharps-only chromatic spelling
 * @param octave - Octave in scientific pitch notation (4 = the octave containing middle C)
 * @returns Frequency in Hz
 *
 * @example
 * noteToFrequency("A", 4)
 * // → 440
 */
const noteToFrequency = (note: Note, octave: number): number => {
  const midiNumber = noteToMidi(note, octave);
  return FREQUENCY_A4 * Math.pow(2, (midiNumber - MIDI_A4) / 12);
};

export { noteToMidi, midiToNote, noteToFrequency };

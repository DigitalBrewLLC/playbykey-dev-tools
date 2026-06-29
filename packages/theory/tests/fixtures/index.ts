import { Modes } from '../../src';
import type { Note, ModeName } from '../../src';

/** The 7 natural (white key) notes in ascending keyboard order. */
export const NATURAL_NOTES: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/** All 12 chromatic notes in ascending order from C. */
export const ALL_NOTES: Note[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

/** Alteration direction constants used in getModeAlterations return values. */
export const ALTERATION = {
  FLAT: 'flat',
  SHARP: 'sharp',
} as const;

/** All 7 modes of the major scale in brightness order (ionian = brightest). */
export const ALL_MODES: ModeName[] = [
  Modes.Ionian,
  Modes.Dorian,
  Modes.Phrygian,
  Modes.Lydian,
  Modes.Mixolydian,
  Modes.Aeolian,
  Modes.Locrian,
];

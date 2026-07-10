import { describe, it, expect } from 'vitest';
import { getSemitoneDistance } from '../src';
import type { Note } from '../src';
import { ALL_NOTES } from './fixtures';

// getSemitoneDistance always measures the *ascending* (upward) distance between two notes.
// Going from a higher note to a lower one wraps around the top of the octave.
// Example: G to C is not 7 down, it is 5 up (G → G# → A → A# → B → C).

// Distances from C upward to all 12 chromatic notes — covers the full 0-11 range
const ASCENDING_FROM_C: Array<{ to: Note; semitones: number }> = [
  { to: 'C', semitones: 0 },
  { to: 'C#', semitones: 1 },
  { to: 'D', semitones: 2 },
  { to: 'D#', semitones: 3 },
  { to: 'E', semitones: 4 },
  { to: 'F', semitones: 5 },
  { to: 'F#', semitones: 6 },
  { to: 'G', semitones: 7 },
  { to: 'G#', semitones: 8 },
  { to: 'A', semitones: 9 },
  { to: 'A#', semitones: 10 },
  { to: 'B', semitones: 11 },
];

// Ascending distance from each non-C note back to C — wraps over the top of the octave
const ASCENDING_TO_C: Array<{ from: Note; semitones: number }> = [
  { from: 'C#', semitones: 11 },
  { from: 'D', semitones: 10 },
  { from: 'D#', semitones: 9 },
  { from: 'E', semitones: 8 },
  { from: 'F', semitones: 7 },
  { from: 'F#', semitones: 6 },
  { from: 'G', semitones: 5 },
  { from: 'G#', semitones: 4 },
  { from: 'A', semitones: 3 },
  { from: 'A#', semitones: 2 },
  { from: 'B', semitones: 1 },
];

describe('getSemitoneDistance', () => {
  describe('ascending distances from C to all 12 chromatic notes', () => {
    it.each(ASCENDING_FROM_C)(
      'C to $to → $semitones semitones',
      ({ to, semitones }) => {
        expect(getSemitoneDistance('C', to)).toBe(semitones);
      }
    );
  });

  describe('same-note distance is always 0', () => {
    it.each(ALL_NOTES.map((n) => ({ note: n })))(
      '$note to $note → 0',
      ({ note }) => {
        expect(getSemitoneDistance(note, note)).toBe(0);
      }
    );
  });

  describe('from > to wraps ascending over the top of the octave', () => {
    it.each(ASCENDING_TO_C)(
      '$from to C → $semitones semitones',
      ({ from, semitones }) => {
        expect(getSemitoneDistance(from, 'C')).toBe(semitones);
      }
    );
  });
});

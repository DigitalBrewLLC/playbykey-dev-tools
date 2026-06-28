import { describe, it, expect } from 'vitest';
import { isNoteInScale, Modes } from '../src';
import type { Note, ModeName } from '../src';
import { ALL_NOTES } from './fixtures';

// Known in-scale notes for each of the 12 ionian keys
const IONIAN_IN_SCALE: Array<{ root: Note; inScale: Note[] }> = [
  { root: 'C', inScale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  { root: 'C#', inScale: ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'C'] },
  { root: 'D', inScale: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] },
  { root: 'D#', inScale: ['D#', 'F', 'G', 'G#', 'A#', 'C', 'D'] },
  { root: 'E', inScale: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'] },
  { root: 'F', inScale: ['F', 'G', 'A', 'A#', 'C', 'D', 'E'] },
  { root: 'F#', inScale: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F'] },
  { root: 'G', inScale: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'] },
  { root: 'G#', inScale: ['G#', 'A#', 'C', 'C#', 'D#', 'F', 'G'] },
  { root: 'A', inScale: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'] },
  { root: 'A#', inScale: ['A#', 'C', 'D', 'D#', 'F', 'G', 'A'] },
  { root: 'B', inScale: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'] },
];

// All 7 modes from C with their in-scale notes
const C_MODES_IN_SCALE: Array<{ mode: ModeName; inScale: Note[] }> = [
  { mode: Modes.Ionian, inScale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  { mode: Modes.Dorian, inScale: ['C', 'D', 'D#', 'F', 'G', 'A', 'A#'] },
  { mode: Modes.Phrygian, inScale: ['C', 'C#', 'D#', 'F', 'G', 'G#', 'A#'] },
  { mode: Modes.Lydian, inScale: ['C', 'D', 'E', 'F#', 'G', 'A', 'B'] },
  { mode: Modes.Mixolydian, inScale: ['C', 'D', 'E', 'F', 'G', 'A', 'A#'] },
  { mode: Modes.Aeolian, inScale: ['C', 'D', 'D#', 'F', 'G', 'G#', 'A#'] },
  { mode: Modes.Locrian, inScale: ['C', 'C#', 'D#', 'F', 'F#', 'G#', 'A#'] },
];

describe('isNoteInScale', () => {
  // Each case asserts all 12 chromatic notes:
  //   - the 7 listed in `inScale` must return true
  //   - the remaining 5 (derived by exclusion) must return false
  describe('all 12 ionian keys', () => {
    it.each(IONIAN_IN_SCALE)('$root ionian', ({ root, inScale }) => {
      const outOfScale = ALL_NOTES.filter((n) => !inScale.includes(n));
      for (const note of inScale) {
        expect(isNoteInScale(root, Modes.Ionian, note)).toBe(true);
      }
      for (const note of outOfScale) {
        expect(isNoteInScale(root, Modes.Ionian, note)).toBe(false);
      }
    });
  });

  describe('all 7 modes from C root', () => {
    it.each(C_MODES_IN_SCALE)('C $mode', ({ mode, inScale }) => {
      const outOfScale = ALL_NOTES.filter((n) => !inScale.includes(n));
      for (const note of inScale) {
        expect(isNoteInScale('C', mode, note)).toBe(true);
      }
      for (const note of outOfScale) {
        expect(isNoteInScale('C', mode, note)).toBe(false);
      }
    });
  });
});

import { describe, it, expect } from 'vitest';
import { getScaleNotes, MODE_IDS } from '../src';
import type { Note, ModeName } from '../src';
import { ALL_NOTES, ALL_MODES } from './fixtures';

// All 12 keys in ionian mode — full expected output arrays for concrete verification
const IONIAN_KEYS: Array<{ root: Note; expected: Note[] }> = [
  { root: 'C', expected: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  { root: 'C#', expected: ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'C'] },
  { root: 'D', expected: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] },
  { root: 'D#', expected: ['D#', 'F', 'G', 'G#', 'A#', 'C', 'D'] },
  { root: 'E', expected: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'] },
  { root: 'F', expected: ['F', 'G', 'A', 'A#', 'C', 'D', 'E'] },
  { root: 'F#', expected: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F'] },
  { root: 'G', expected: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'] },
  { root: 'G#', expected: ['G#', 'A#', 'C', 'C#', 'D#', 'F', 'G'] },
  { root: 'A', expected: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'] },
  { root: 'A#', expected: ['A#', 'C', 'D', 'D#', 'F', 'G', 'A'] },
  { root: 'B', expected: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'] },
];

// All 7 modes from C — full expected output arrays for concrete verification
const C_MODES: Array<{ mode: ModeName; expected: Note[] }> = [
  { mode: MODE_IDS.IONIAN, expected: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  { mode: MODE_IDS.DORIAN, expected: ['C', 'D', 'D#', 'F', 'G', 'A', 'A#'] },
  {
    mode: MODE_IDS.PHRYGIAN,
    expected: ['C', 'C#', 'D#', 'F', 'G', 'G#', 'A#'],
  },
  { mode: MODE_IDS.LYDIAN, expected: ['C', 'D', 'E', 'F#', 'G', 'A', 'B'] },
  { mode: MODE_IDS.MIXOLYDIAN, expected: ['C', 'D', 'E', 'F', 'G', 'A', 'A#'] },
  { mode: MODE_IDS.AEOLIAN, expected: ['C', 'D', 'D#', 'F', 'G', 'G#', 'A#'] },
  {
    mode: MODE_IDS.LOCRIAN,
    expected: ['C', 'C#', 'D#', 'F', 'F#', 'G#', 'A#'],
  },
];

describe('getScaleNotes', () => {
  describe('all 12 keys in ionian mode — full output verified', () => {
    it.each(IONIAN_KEYS)('$root ionian', ({ root, expected }) => {
      expect(getScaleNotes(root, MODE_IDS.IONIAN)).toEqual(expected);
    });
  });

  describe('all 7 modes from C root — full output verified', () => {
    it.each(C_MODES)('C $mode', ({ mode, expected }) => {
      expect(getScaleNotes('C', mode)).toEqual(expected);
    });
  });

  // Structural invariant: regardless of root or mode, the output is always 7 notes
  // and the first note is always the root. Verified for all 84 key/mode combinations.
  describe('structural invariants hold across all 84 key/mode combinations', () => {
    it.each(
      ALL_NOTES.flatMap((root) => ALL_MODES.map((mode) => ({ root, mode })))
    )('$root $mode returns 7 notes with root first', ({ root, mode }) => {
      const notes = getScaleNotes(root, mode);
      expect(notes).toHaveLength(7);
      expect(notes[0]).toBe(root);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { getParentScaleModes, Modes } from '../src';
import type { Note, ModeName } from '../src';

// getParentScaleModes takes any (key, mode) pair, walks back to the parent Ionian (major) key,
// and returns all 7 rotation pairs ordered from ionian to locrian.
// Example: ('D', 'dorian') → parent is C major → [{C,ionian},{D,dorian},{E,phrygian},...]

const MODE_ORDER: ModeName[] = [
  Modes.Ionian,
  Modes.Dorian,
  Modes.Phrygian,
  Modes.Lydian,
  Modes.Mixolydian,
  Modes.Aeolian,
  Modes.Locrian,
];

// The 7 (key, mode) combinations that all share C as their parent Ionian key.
// degreeIndex is the 0-based position of the input pair in the returned array
// (e.g. dorian is always at index 1 because it is the 2nd mode of its parent scale).
const C_PARENT_INPUTS: Array<{
  key: Note;
  mode: ModeName;
  degreeIndex: number;
}> = [
  { key: 'C', mode: Modes.Ionian, degreeIndex: 0 },
  { key: 'D', mode: Modes.Dorian, degreeIndex: 1 },
  { key: 'E', mode: Modes.Phrygian, degreeIndex: 2 },
  { key: 'F', mode: Modes.Lydian, degreeIndex: 3 },
  { key: 'G', mode: Modes.Mixolydian, degreeIndex: 4 },
  { key: 'A', mode: Modes.Aeolian, degreeIndex: 5 },
  { key: 'B', mode: Modes.Locrian, degreeIndex: 6 },
];

// All 12 keys with dorian mode — exercises the parent-resolution logic across every transposition.
// Dorian is always scale degree 2, so the parent root is always 2 semitones below the input key.
const DORIAN_ALL_KEYS: Array<{ key: Note; parentIonian: Note }> = [
  { key: 'C', parentIonian: 'A#' },
  { key: 'C#', parentIonian: 'B' },
  { key: 'D', parentIonian: 'C' },
  { key: 'D#', parentIonian: 'C#' },
  { key: 'E', parentIonian: 'D' },
  { key: 'F', parentIonian: 'D#' },
  { key: 'F#', parentIonian: 'E' },
  { key: 'G', parentIonian: 'F' },
  { key: 'G#', parentIonian: 'F#' },
  { key: 'A', parentIonian: 'G' },
  { key: 'A#', parentIonian: 'G#' },
  { key: 'B', parentIonian: 'A' },
];

describe('getParentScaleModes', () => {
  describe('always returns exactly 7 mode pairs', () => {
    it('D dorian returns 7 pairs', () => {
      expect(getParentScaleModes('D', Modes.Dorian)).toHaveLength(7);
    });

    it('B locrian returns 7 pairs', () => {
      expect(getParentScaleModes('B', Modes.Locrian)).toHaveLength(7);
    });
  });

  describe('pairs are always ordered ionian → dorian → ... → locrian', () => {
    it('G mixolydian pairs have correct mode order', () => {
      const pairs = getParentScaleModes('G', Modes.Mixolydian);
      pairs.forEach((pair, i) => {
        expect(pair.mode).toBe(MODE_ORDER[i]);
      });
    });
  });

  describe('all 7 modes of the C major parent key resolve correctly', () => {
    it.each(C_PARENT_INPUTS)(
      '$key $mode → pairs[0] is {C, ionian} and input pair is at index $degreeIndex',
      ({ key, mode, degreeIndex }) => {
        const pairs = getParentScaleModes(key, mode);
        expect(pairs[0]).toEqual({ root: 'C', mode: Modes.Ionian });
        expect(pairs[degreeIndex]).toEqual({ root: key, mode });
      }
    );
  });

  describe('all 12 keys in dorian — correct parent Ionian root resolved for every transposition', () => {
    it.each(DORIAN_ALL_KEYS)(
      '$key dorian → parent is $parentIonian ionian',
      ({ key, parentIonian }) => {
        const pairs = getParentScaleModes(key, Modes.Dorian);
        expect(pairs[0]?.root).toBe(parentIonian);
        expect(pairs[0]?.mode).toBe(Modes.Ionian);
        expect(pairs[1]?.root).toBe(key);
        expect(pairs[1]?.mode).toBe(Modes.Dorian);
      }
    );
  });
});

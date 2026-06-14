import { describe, it, expect } from 'vitest';
import { noteAtIndex } from '../src';
import type { Note } from '../src';

// noteAtIndex accepts any integer and wraps it into the 0-11 range via ((index % 12) + 12) % 12,
// which handles both positive overflow and negative values correctly.

const STANDARD_CASES: Array<{ index: number; expected: Note }> = [
  { index: 0, expected: 'C' },
  { index: 1, expected: 'C#' },
  { index: 2, expected: 'D' },
  { index: 3, expected: 'D#' },
  { index: 4, expected: 'E' },
  { index: 5, expected: 'F' },
  { index: 6, expected: 'F#' },
  { index: 7, expected: 'G' },
  { index: 8, expected: 'G#' },
  { index: 9, expected: 'A' },
  { index: 10, expected: 'A#' },
  { index: 11, expected: 'B' },
];

// Indices >= 12 wrap back to the same note as index % 12
const UPPER_WRAP_CASES: Array<{ index: number; expected: Note }> = [
  { index: 12, expected: 'C' },
  { index: 13, expected: 'C#' },
  { index: 19, expected: 'G' },
  { index: 23, expected: 'B' },
  { index: 24, expected: 'C' },
];

// Negative indices count backwards from B: -1 = B, -2 = A#, etc.
const NEGATIVE_WRAP_CASES: Array<{ index: number; expected: Note }> = [
  { index: -1, expected: 'B' },
  { index: -2, expected: 'A#' },
  { index: -6, expected: 'F#' },
  { index: -11, expected: 'C#' },
  { index: -12, expected: 'C' },
];

describe('noteAtIndex', () => {
  describe('standard indices 0-11', () => {
    it.each(STANDARD_CASES)(
      'index $index → $expected',
      ({ index, expected }) => {
        expect(noteAtIndex(index)).toBe(expected);
      }
    );
  });

  describe('wraps indices >= 12 back into range', () => {
    it.each(UPPER_WRAP_CASES)(
      'index $index → $expected',
      ({ index, expected }) => {
        expect(noteAtIndex(index)).toBe(expected);
      }
    );
  });

  describe('wraps negative indices into range', () => {
    it.each(NEGATIVE_WRAP_CASES)(
      'index $index → $expected',
      ({ index, expected }) => {
        expect(noteAtIndex(index)).toBe(expected);
      }
    );
  });
});

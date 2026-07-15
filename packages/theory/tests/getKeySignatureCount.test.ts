import { describe, it, expect } from 'vitest';
import { getKeySignatureCount, KeyQualities } from '../src';
import type { Note } from '../src';

// Keys are ordered around the circle of fifths.
// Moving clockwise (up a fifth) adds one sharp; moving counter-clockwise (up a fourth) adds one flat.
// C sits at position 0 with no accidentals. F# has the maximum sharp count (6); C# has the most flats (5).

// All 12 keys ordered by circle of fifths position, covering every accidental count
const ALL_CASES: Array<{
  key: Note;
  expected: { sharps: number } | { flats: number };
}> = [
  { key: 'C', expected: { sharps: 0 } },
  { key: 'G', expected: { sharps: 1 } },
  { key: 'D', expected: { sharps: 2 } },
  { key: 'A', expected: { sharps: 3 } },
  { key: 'E', expected: { sharps: 4 } },
  { key: 'B', expected: { sharps: 5 } },
  { key: 'F#', expected: { sharps: 6 } },
  { key: 'C#', expected: { flats: 5 } },
  { key: 'G#', expected: { flats: 4 } },
  { key: 'D#', expected: { flats: 3 } },
  { key: 'A#', expected: { flats: 2 } },
  { key: 'F', expected: { flats: 1 } },
];

describe('getKeySignatureCount', () => {
  describe('all 12 keys ordered by circle of fifths position', () => {
    it.each(ALL_CASES)('$key', ({ key, expected }) => {
      expect(getKeySignatureCount(key)).toEqual(expected);
    });
  });

  it('sharp count increments by 1 for each clockwise step on the circle (C through F#)', () => {
    const sharpKeys: Note[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#'];
    sharpKeys.forEach((key, i) => {
      expect(getKeySignatureCount(key)).toEqual({ sharps: i });
    });
  });

  it('flat count increments by 1 for each counter-clockwise step on the circle (F through C#)', () => {
    const flatKeys: Note[] = ['F', 'A#', 'D#', 'G#', 'C#'];
    flatKeys.forEach((key, i) => {
      expect(getKeySignatureCount(key)).toEqual({ flats: i + 1 });
    });
  });

  describe('quality parameter', () => {
    it('defaults to major and matches explicit major', () => {
      expect(getKeySignatureCount('C#')).toEqual({ flats: 5 });
      expect(getKeySignatureCount('C#', KeyQualities.Major)).toEqual({
        flats: 5,
      });
    });

    it('resolves minor keys via their relative major', () => {
      expect(getKeySignatureCount('A', KeyQualities.Minor)).toEqual({
        sharps: 0,
      });
      expect(getKeySignatureCount('E', KeyQualities.Minor)).toEqual({
        sharps: 1,
      });
      expect(getKeySignatureCount('C#', KeyQualities.Minor)).toEqual({
        sharps: 4,
      });
      expect(getKeySignatureCount('D', KeyQualities.Minor)).toEqual({
        flats: 1,
      });
    });
  });
});

import { describe, it, expect } from 'vitest';
import { buildNoteMap, ScaleTypes } from '../src';
import { ALL_NOTES } from './fixtures';

// buildNoteMap returns one NoteDisplayInfo per in-scale note, in scale-degree order.
// Every entry is guaranteed to be in the scale.
// Key fields: note (Note), scaleDegree (number, 1-based), semitoneOffset (0-11 from root).

const ALL_SCALE_TYPES = [
  ScaleTypes.Major,
  ScaleTypes.Blues,
  ScaleTypes.PentatonicMajor,
  ScaleTypes.PentatonicMinor,
  ScaleTypes.HarmonicMinor,
  ScaleTypes.Chromatic,
];

const ALL_COMBINATIONS = ALL_NOTES.flatMap((root) =>
  ALL_SCALE_TYPES.map((scaleType) => ({ root, scaleType }))
);

describe('buildNoteMap', () => {
  describe('returns only in-scale notes with correct count', () => {
    it('major: 7 notes', () => {
      expect(buildNoteMap('C', ScaleTypes.Major)).toHaveLength(7);
    });
    it('pentatonic major: 5 notes', () => {
      expect(buildNoteMap('C', ScaleTypes.PentatonicMajor)).toHaveLength(5);
    });
    it('pentatonic minor: 5 notes', () => {
      expect(buildNoteMap('C', ScaleTypes.PentatonicMinor)).toHaveLength(5);
    });
    it('blues: 6 notes', () => {
      expect(buildNoteMap('C', ScaleTypes.Blues)).toHaveLength(6);
    });
    it('harmonic minor: 7 notes', () => {
      expect(buildNoteMap('C', ScaleTypes.HarmonicMinor)).toHaveLength(7);
    });
    it('chromatic: 12 notes', () => {
      expect(buildNoteMap('C', ScaleTypes.Chromatic)).toHaveLength(12);
    });
  });

  describe('scaleDegree is always a number (1-based, no nulls)', () => {
    it.each(ALL_COMBINATIONS)('$root $scaleType', ({ root, scaleType }) => {
      const map = buildNoteMap(root, scaleType);
      for (const entry of map) {
        expect(typeof entry.scaleDegree).toBe('number');
        expect(entry.scaleDegree).toBeGreaterThan(0);
      }
    });
  });

  describe('scaleDegrees are sequential starting at 1', () => {
    it('C major degrees are 1-7', () => {
      const map = buildNoteMap('C', ScaleTypes.Major);
      expect(map.map((e) => e.scaleDegree)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('C blues degrees are 1-6', () => {
      const map = buildNoteMap('C', ScaleTypes.Blues);
      expect(map.map((e) => e.scaleDegree)).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('root is always the first entry with scaleDegree=1 and semitoneOffset=0', () => {
    it.each(ALL_COMBINATIONS)('$root $scaleType', ({ root, scaleType }) => {
      const map = buildNoteMap(root, scaleType);
      const first = map[0];
      expect(first?.note).toBe(root);
      expect(first?.scaleDegree).toBe(1);
      expect(first?.semitoneOffset).toBe(0);
    });
  });

  describe('semitoneOffset is always in range 0-11', () => {
    it.each(ALL_COMBINATIONS)('$root $scaleType', ({ root, scaleType }) => {
      const map = buildNoteMap(root, scaleType);
      for (const entry of map) {
        expect(entry.semitoneOffset).toBeGreaterThanOrEqual(0);
        expect(entry.semitoneOffset).toBeLessThanOrEqual(11);
      }
    });
  });

  describe('C major spot-check', () => {
    it('returns correct notes in order', () => {
      const map = buildNoteMap('C', ScaleTypes.Major);
      expect(map.map((e) => e.note)).toEqual([
        'C',
        'D',
        'E',
        'F',
        'G',
        'A',
        'B',
      ]);
    });

    it('semitoneOffsets match ionian pattern', () => {
      const map = buildNoteMap('C', ScaleTypes.Major);
      expect(map.map((e) => e.semitoneOffset)).toEqual([0, 2, 4, 5, 7, 9, 11]);
    });

    it('no chromatic note appears that is not in C major', () => {
      const map = buildNoteMap('C', ScaleTypes.Major);
      const notes = map.map((e) => e.note);
      expect(notes).not.toContain('C#');
      expect(notes).not.toContain('F#');
    });
  });
});

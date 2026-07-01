import { describe, it, expect } from 'vitest';
import { buildNoteMap, ScaleTypes, Notations } from '../src';
import { ALL_NOTES } from './fixtures';

// buildNoteMap returns one NoteDisplayInfo entry for each of the 12 chromatic notes (C through B),
// describing how to render that note for the given root, scale type, and notation type.
// Key fields: note, inScale, scaleDegree (1-7 or null), label (string), isRoot (boolean).

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
  describe('always returns exactly 12 entries (one per chromatic note)', () => {
    it.each(ALL_COMBINATIONS)('$root $scaleType', ({ root, scaleType }) => {
      expect(buildNoteMap(root, scaleType, Notations.Letter)).toHaveLength(12);
    });
  });

  describe('exactly one entry has isRoot=true, and it matches the root note', () => {
    it.each(ALL_COMBINATIONS)('$root $scaleType', ({ root, scaleType }) => {
      const map = buildNoteMap(root, scaleType, Notations.Letter);
      const rootEntries = map.filter((e) => e.isRoot);
      expect(rootEntries).toHaveLength(1);
      expect(rootEntries[0]?.note).toBe(root);
    });
  });

  describe('root entry is always inScale with scaleDegree=1', () => {
    it.each(ALL_NOTES.map((r) => ({ root: r })))('$root major', ({ root }) => {
      const map = buildNoteMap(root, ScaleTypes.Major, Notations.Letter);
      const rootEntry = map.find((e) => e.note === root);
      expect(rootEntry?.isRoot).toBe(true);
      expect(rootEntry?.inScale).toBe(true);
      expect(rootEntry?.scaleDegree).toBe(1);
    });
  });

  describe('correct in-scale note counts by scale type', () => {
    it('major: 7 notes in scale', () => {
      const map = buildNoteMap('C', ScaleTypes.Major, Notations.Letter);
      expect(map.filter((e) => e.inScale)).toHaveLength(7);
    });

    it('pentatonic major: 5 notes in scale', () => {
      const map = buildNoteMap(
        'C',
        ScaleTypes.PentatonicMajor,
        Notations.Letter
      );
      expect(map.filter((e) => e.inScale)).toHaveLength(5);
    });

    it('blues: 6 notes in scale', () => {
      const map = buildNoteMap('C', ScaleTypes.Blues, Notations.Letter);
      expect(map.filter((e) => e.inScale)).toHaveLength(6);
    });

    it('harmonic minor: 7 notes in scale', () => {
      const map = buildNoteMap('C', ScaleTypes.HarmonicMinor, Notations.Letter);
      expect(map.filter((e) => e.inScale)).toHaveLength(7);
    });

    it('chromatic: 12 notes in scale', () => {
      const map = buildNoteMap('C', ScaleTypes.Chromatic, Notations.Letter);
      expect(map.filter((e) => e.inScale)).toHaveLength(12);
    });
  });

  describe('out-of-scale entries have inScale=false, scaleDegree=null', () => {
    it('F# is out-of-scale in C major (number notation → empty label)', () => {
      const map = buildNoteMap('C', ScaleTypes.Major, Notations.Number);
      const fSharp = map.find((e) => e.note === 'F#');
      expect(fSharp?.inScale).toBe(false);
      expect(fSharp?.isRoot).toBe(false);
      expect(fSharp?.scaleDegree).toBeNull();
      expect(fSharp?.label).toBe('');
    });

    it('D is out-of-scale in B major', () => {
      const map = buildNoteMap('B', ScaleTypes.Major, Notations.Letter);
      const d = map.find((e) => e.note === 'D');
      expect(d?.inScale).toBe(false);
      expect(d?.scaleDegree).toBeNull();
    });
  });

  describe('letter notation: every entry label equals its note name', () => {
    it('C major letter notation', () => {
      const map = buildNoteMap('C', ScaleTypes.Major, Notations.Letter);
      for (const entry of map) {
        expect(entry.label).toBe(entry.note);
      }
    });
  });

  describe('number notation: in-scale labels are degree strings, out-of-scale are empty', () => {
    it('C major number notation spot-check', () => {
      const map = buildNoteMap('C', ScaleTypes.Major, Notations.Number);
      expect(map.find((e) => e.note === 'C')?.label).toBe('1');
      expect(map.find((e) => e.note === 'E')?.label).toBe('3');
      expect(map.find((e) => e.note === 'G')?.label).toBe('5');
      expect(map.find((e) => e.note === 'C#')?.label).toBe('');
    });
  });
});

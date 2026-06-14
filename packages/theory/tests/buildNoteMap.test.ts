import { describe, it, expect } from 'vitest';
import { buildNoteMap, MODE_IDS, NOTATION_IDS } from '../src';
import { ALL_NOTES, ALL_MODES } from './fixtures';

// buildNoteMap returns one NoteDisplayInfo entry for each of the 12 chromatic notes (C through B),
// describing how to render that note for the given root, mode, and notation type.
// Key fields: note, inScale, scaleDegree (1-7 or null), label (string), isRoot (boolean).

// Pre-expanded list of all 84 root/mode combinations, shared across multiple describe blocks
const ALL_COMBINATIONS = ALL_NOTES.flatMap((root) =>
  ALL_MODES.map((mode) => ({ root, mode }))
);

describe('buildNoteMap', () => {
  describe('always returns exactly 12 entries (one per chromatic note)', () => {
    it.each(ALL_COMBINATIONS)('$root $mode', ({ root, mode }) => {
      expect(buildNoteMap(root, mode, NOTATION_IDS.LETTER)).toHaveLength(12);
    });
  });

  describe('exactly one entry has isRoot=true, and it matches the root note', () => {
    it.each(ALL_COMBINATIONS)('$root $mode', ({ root, mode }) => {
      const map = buildNoteMap(root, mode, NOTATION_IDS.LETTER);
      const rootEntries = map.filter((e) => e.isRoot);
      expect(rootEntries).toHaveLength(1);
      expect(rootEntries[0]?.note).toBe(root);
    });
  });

  describe('root entry is always inScale with scaleDegree=1', () => {
    it.each(ALL_NOTES.map((r) => ({ root: r })))('$root ionian', ({ root }) => {
      const map = buildNoteMap(root, MODE_IDS.IONIAN, NOTATION_IDS.LETTER);
      const rootEntry = map.find((e) => e.note === root);
      expect(rootEntry?.isRoot).toBe(true);
      expect(rootEntry?.inScale).toBe(true);
      expect(rootEntry?.scaleDegree).toBe(1);
    });
  });

  describe('exactly 7 notes are in-scale for all ionian keys', () => {
    it.each(ALL_NOTES.map((r) => ({ root: r })))('$root ionian', ({ root }) => {
      const map = buildNoteMap(root, MODE_IDS.IONIAN, NOTATION_IDS.LETTER);
      expect(map.filter((e) => e.inScale)).toHaveLength(7);
    });
  });

  describe('out-of-scale entries have inScale=false, scaleDegree=null', () => {
    it('F# is out-of-scale in C ionian (number notation → empty label)', () => {
      const map = buildNoteMap('C', MODE_IDS.IONIAN, NOTATION_IDS.NUMBER);
      const fSharp = map.find((e) => e.note === 'F#');
      expect(fSharp?.inScale).toBe(false);
      expect(fSharp?.isRoot).toBe(false);
      expect(fSharp?.scaleDegree).toBeNull();
      expect(fSharp?.label).toBe('');
    });

    it('D is out-of-scale in B ionian', () => {
      const map = buildNoteMap('B', MODE_IDS.IONIAN, NOTATION_IDS.LETTER);
      const d = map.find((e) => e.note === 'D');
      expect(d?.inScale).toBe(false);
      expect(d?.scaleDegree).toBeNull();
    });
  });

  describe('letter notation: every entry label equals its note name', () => {
    it('C ionian letter notation', () => {
      const map = buildNoteMap('C', MODE_IDS.IONIAN, NOTATION_IDS.LETTER);
      for (const entry of map) {
        expect(entry.label).toBe(entry.note);
      }
    });
  });

  describe('number notation: in-scale labels are degree strings, out-of-scale are empty', () => {
    it('C ionian number notation spot-check', () => {
      const map = buildNoteMap('C', MODE_IDS.IONIAN, NOTATION_IDS.NUMBER);
      expect(map.find((e) => e.note === 'C')?.label).toBe('1');
      expect(map.find((e) => e.note === 'E')?.label).toBe('3');
      expect(map.find((e) => e.note === 'G')?.label).toBe('5');
      expect(map.find((e) => e.note === 'C#')?.label).toBe('');
    });
  });
});

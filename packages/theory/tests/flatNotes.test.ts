import { describe, expect, it } from 'vitest';
import {
  CHROMATIC_NOTES,
  ENHARMONIC_LABELS,
  FlatNotes,
  FLAT_TO_SHARP,
  SHARP_TO_FLAT_MAP,
} from '../src/constants';
import type { FlatNote, Note } from '../src/types';

describe('FLAT_TO_SHARP', () => {
  it('has exactly the 5 FlatNote keys', () => {
    const expectedKeys = Object.values(FlatNotes).sort();
    const actualKeys = (Object.keys(FLAT_TO_SHARP) as FlatNote[]).sort();
    expect(actualKeys).toEqual(expectedKeys);
  });

  it('is consistent with ENHARMONIC_LABELS', () => {
    for (const [sharp, label] of Object.entries(ENHARMONIC_LABELS) as Array<
      [Note, string | null]
    >) {
      if (label === null) continue;
      const flatName = label.split('/')[0] as FlatNote;
      expect(FLAT_TO_SHARP[flatName]).toBe(sharp);
    }
  });
});

describe('SHARP_TO_FLAT_MAP', () => {
  it('maps naturals to themselves', () => {
    const naturals: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    for (const note of naturals) {
      expect(SHARP_TO_FLAT_MAP[note]).toBe(note);
    }
  });

  it('is the inverse of FLAT_TO_SHARP for every altered note', () => {
    for (const [flat, sharp] of Object.entries(FLAT_TO_SHARP)) {
      expect(SHARP_TO_FLAT_MAP[sharp]).toBe(flat);
    }
  });

  it('has an entry for every chromatic note', () => {
    for (const note of CHROMATIC_NOTES) {
      expect(SHARP_TO_FLAT_MAP[note]).toBeDefined();
    }
  });
});

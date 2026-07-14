import { describe, expect, it } from 'vitest';
import { ENHARMONIC_LABELS, FlatNotes, FLAT_TO_SHARP } from '../src/constants';
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

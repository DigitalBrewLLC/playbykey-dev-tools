import { describe, expect, it } from 'vitest';
import { MODE_IDS, SCALE_KIND_IDS } from '../src/constants';
import { getScaleNotes } from '../src/engine';
import {
  BLUES_SEMITONE_OFFSETS,
  getBluesNotes,
  getDerivedScaleNotes,
  getHarmonicMinorNotes,
  getKeyboardContextNotes,
  getPentatonicDegrees,
  getScaleEmphasisDegrees,
  PENTATONIC_DEGREES,
  SCALE_DEFINITIONS,
} from '../src/scales';

describe('SCALE_DEFINITIONS', () => {
  it('defines every theory scale kind', () => {
    expect(Object.keys(SCALE_DEFINITIONS)).toEqual(
      Object.values(SCALE_KIND_IDS)
    );
  });
});

describe('getDerivedScaleNotes', () => {
  it('returns diatonic mode notes for mode kind', () => {
    expect(getDerivedScaleNotes('C', MODE_IDS.IONIAN, 'mode')).toEqual(
      getScaleNotes('C', MODE_IDS.IONIAN)
    );
  });

  it('returns all 12 chromatic pitches for chromatic kind', () => {
    expect(
      getDerivedScaleNotes('C', MODE_IDS.IONIAN, 'chromatic')
    ).toHaveLength(12);
  });

  it('returns pentatonic subset degrees from parent mode', () => {
    expect(
      getDerivedScaleNotes('C', MODE_IDS.IONIAN, 'pentatonic').map((n) => n)
    ).toEqual(['C', 'D', 'E', 'G', 'A']);
  });

  it('returns blues scale with blue note for blues kind', () => {
    expect(getDerivedScaleNotes('A', MODE_IDS.AEOLIAN, 'blues')).toEqual(
      getBluesNotes('A')
    );
    expect(getBluesNotes('A')).toContain('D#');
  });

  it('raises aeolian degree 7 for harmonic minor', () => {
    expect(getHarmonicMinorNotes('A')).toEqual([
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G#',
    ]);
  });
});

describe('getScaleEmphasisDegrees', () => {
  it('returns catalog emphasis for each scale kind', () => {
    expect(getScaleEmphasisDegrees('pentatonic')).toEqual(PENTATONIC_DEGREES);
    expect(getScaleEmphasisDegrees('blues')).toHaveLength(
      BLUES_SEMITONE_OFFSETS.length
    );
    expect(getScaleEmphasisDegrees('mode')).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});

describe('getKeyboardContextNotes', () => {
  it('uses aeolian parent for blues keyboard context', () => {
    expect(getKeyboardContextNotes('A', MODE_IDS.AEOLIAN, 'blues')).toEqual(
      getScaleNotes('A', MODE_IDS.AEOLIAN)
    );
  });

  it('uses parent mode for pentatonic keyboard context', () => {
    expect(getKeyboardContextNotes('C', MODE_IDS.IONIAN, 'pentatonic')).toEqual(
      getScaleNotes('C', MODE_IDS.IONIAN)
    );
  });
});

describe('getPentatonicDegrees', () => {
  it('returns degrees 1, 2, 3, 5, and 6', () => {
    expect(getPentatonicDegrees()).toEqual([1, 2, 3, 5, 6]);
  });
});

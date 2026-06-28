import { describe, expect, it } from 'vitest';
import { Modes, ScaleKinds } from '../src/constants';
import { getScaleNotes } from '../src/engine';
import {
  BLUES_SEMITONE_OFFSETS,
  getBluesNotes,
  getDerivedScaleNotes,
  getHarmonicMinorNotes,
  getPentatonicDegrees,
  getScaleContextNotes,
  getScaleEmphasisDegrees,
  PENTATONIC_DEGREES,
  SCALE_DEFINITIONS,
} from '../src/scales';

describe('SCALE_DEFINITIONS', () => {
  it('defines every theory scale kind', () => {
    expect(Object.keys(SCALE_DEFINITIONS)).toEqual(Object.values(ScaleKinds));
  });
});

describe('getDerivedScaleNotes', () => {
  it('returns diatonic mode notes for mode kind', () => {
    expect(getDerivedScaleNotes('C', Modes.Ionian, 'mode')).toEqual(
      getScaleNotes('C', Modes.Ionian)
    );
  });

  it('returns all 12 chromatic pitches for chromatic kind', () => {
    expect(getDerivedScaleNotes('C', Modes.Ionian, 'chromatic')).toHaveLength(
      12
    );
  });

  it('returns pentatonic subset degrees from parent mode', () => {
    expect(
      getDerivedScaleNotes('C', Modes.Ionian, 'pentatonic').map((n) => n)
    ).toEqual(['C', 'D', 'E', 'G', 'A']);
  });

  it('returns blues scale with blue note for blues kind', () => {
    expect(getDerivedScaleNotes('A', Modes.Aeolian, 'blues')).toEqual(
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

describe('getScaleContextNotes', () => {
  it('uses aeolian parent for blues harmonic context', () => {
    expect(getScaleContextNotes('A', Modes.Aeolian, 'blues')).toEqual(
      getScaleNotes('A', Modes.Aeolian)
    );
  });

  it('uses parent mode for pentatonic harmonic context', () => {
    expect(getScaleContextNotes('C', Modes.Ionian, 'pentatonic')).toEqual(
      getScaleNotes('C', Modes.Ionian)
    );
  });
});

describe('getPentatonicDegrees', () => {
  it('returns degrees 1, 2, 3, 5, and 6', () => {
    expect(getPentatonicDegrees()).toEqual([1, 2, 3, 5, 6]);
  });
});

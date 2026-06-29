import { describe, expect, it } from 'vitest';
import { Modes, ScaleTypes } from '../src/constants';
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
  it('defines every theory scale type', () => {
    expect(Object.keys(SCALE_DEFINITIONS)).toEqual(Object.values(ScaleTypes));
  });
});

describe('getDerivedScaleNotes', () => {
  it('returns diatonic mode notes for mode type', () => {
    expect(getDerivedScaleNotes('C', Modes.Ionian, ScaleTypes.Mode)).toEqual(
      getScaleNotes('C', Modes.Ionian)
    );
  });

  it('returns all 12 chromatic pitches for chromatic type', () => {
    expect(
      getDerivedScaleNotes('C', Modes.Ionian, ScaleTypes.Chromatic)
    ).toHaveLength(12);
  });

  it('returns pentatonic subset degrees from parent mode', () => {
    expect(
      getDerivedScaleNotes('C', Modes.Ionian, ScaleTypes.Pentatonic).map(
        (n) => n
      )
    ).toEqual(['C', 'D', 'E', 'G', 'A']);
  });

  it('returns blues scale with blue note for blues type', () => {
    expect(getDerivedScaleNotes('A', Modes.Aeolian, ScaleTypes.Blues)).toEqual(
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
  it('returns catalog emphasis for each scale type', () => {
    expect(getScaleEmphasisDegrees(ScaleTypes.Pentatonic)).toEqual(
      PENTATONIC_DEGREES
    );
    expect(getScaleEmphasisDegrees(ScaleTypes.Blues)).toHaveLength(
      BLUES_SEMITONE_OFFSETS.length
    );
    expect(getScaleEmphasisDegrees(ScaleTypes.Mode)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });
});

describe('getScaleContextNotes', () => {
  it('uses aeolian parent for blues harmonic context', () => {
    expect(getScaleContextNotes('A', Modes.Aeolian, ScaleTypes.Blues)).toEqual(
      getScaleNotes('A', Modes.Aeolian)
    );
  });

  it('uses parent mode for pentatonic harmonic context', () => {
    expect(
      getScaleContextNotes('C', Modes.Ionian, ScaleTypes.Pentatonic)
    ).toEqual(getScaleNotes('C', Modes.Ionian));
  });
});

describe('getPentatonicDegrees', () => {
  it('returns degrees 1, 2, 3, 5, and 6', () => {
    expect(getPentatonicDegrees()).toEqual([1, 2, 3, 5, 6]);
  });
});

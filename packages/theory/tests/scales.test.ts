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
  PENTATONIC_MAJOR_DEGREES,
  PENTATONIC_MINOR_DEGREES,
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

  it('returns major pentatonic from ionian regardless of mode arg', () => {
    expect(
      getDerivedScaleNotes('C', Modes.Dorian, ScaleTypes.PentatonicMajor)
    ).toEqual(['C', 'D', 'E', 'G', 'A']);
  });

  it('returns minor pentatonic from aeolian regardless of mode arg', () => {
    expect(
      getDerivedScaleNotes('C', Modes.Ionian, ScaleTypes.PentatonicMinor)
    ).toEqual(['C', 'D#', 'F', 'G', 'A#']);
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
  it('returns major pentatonic emphasis degrees', () => {
    expect(getScaleEmphasisDegrees(ScaleTypes.PentatonicMajor)).toEqual(
      PENTATONIC_MAJOR_DEGREES
    );
  });

  it('returns minor pentatonic emphasis degrees', () => {
    expect(getScaleEmphasisDegrees(ScaleTypes.PentatonicMinor)).toEqual(
      PENTATONIC_MINOR_DEGREES
    );
  });

  it('returns blues scale degrees', () => {
    expect(getScaleEmphasisDegrees(ScaleTypes.Blues)).toHaveLength(
      BLUES_SEMITONE_OFFSETS.length
    );
  });

  it('returns all 7 degrees for mode type', () => {
    expect(getScaleEmphasisDegrees(ScaleTypes.Mode)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });

  it('returns all 12 degrees for chromatic type', () => {
    expect(getScaleEmphasisDegrees(ScaleTypes.Chromatic)).toHaveLength(12);
  });
});

describe('getScaleContextNotes', () => {
  it('uses aeolian parent for blues harmonic context', () => {
    expect(getScaleContextNotes('A', Modes.Aeolian, ScaleTypes.Blues)).toEqual(
      getScaleNotes('A', Modes.Aeolian)
    );
  });

  it('returns ionian scale as context for major pentatonic', () => {
    expect(
      getScaleContextNotes('C', Modes.Dorian, ScaleTypes.PentatonicMajor)
    ).toEqual(getScaleNotes('C', Modes.Ionian));
  });

  it('returns aeolian scale as context for minor pentatonic', () => {
    expect(
      getScaleContextNotes('C', Modes.Ionian, ScaleTypes.PentatonicMinor)
    ).toEqual(getScaleNotes('C', Modes.Aeolian));
  });
});

describe('getPentatonicDegrees', () => {
  it('returns 5 major pentatonic notes for given root', () => {
    expect(getPentatonicDegrees('C', 'major')).toEqual([
      'C',
      'D',
      'E',
      'G',
      'A',
    ]);
  });

  it('returns 5 minor pentatonic notes for given root', () => {
    expect(getPentatonicDegrees('C', 'minor')).toEqual([
      'C',
      'D#',
      'F',
      'G',
      'A#',
    ]);
  });

  it('relative relationship: A minor pentatonic shares notes with C major pentatonic', () => {
    const cMajor = new Set(getPentatonicDegrees('C', 'major'));
    const aMinor = new Set(getPentatonicDegrees('A', 'minor'));
    expect([...cMajor].sort()).toEqual([...aMinor].sort());
  });

  it('returns 5 notes for all roots', () => {
    const roots = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ] as const;
    for (const root of roots) {
      expect(getPentatonicDegrees(root, 'major')).toHaveLength(5);
      expect(getPentatonicDegrees(root, 'minor')).toHaveLength(5);
    }
  });
});

describe('PENTATONIC_MAJOR_DEGREES', () => {
  it('is degrees 1, 2, 3, 5, 6', () => {
    expect(PENTATONIC_MAJOR_DEGREES).toEqual([1, 2, 3, 5, 6]);
  });
});

describe('PENTATONIC_MINOR_DEGREES', () => {
  it('is degrees 1, 3, 4, 5, 7', () => {
    expect(PENTATONIC_MINOR_DEGREES).toEqual([1, 3, 4, 5, 7]);
  });
});

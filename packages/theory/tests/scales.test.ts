import { describe, expect, it } from 'vitest';
import { Modes, PentatonicTypes, ScaleTypes } from '../src/constants';
import { getModeNotes } from '../src/engine';
import {
  BLUES_SEMITONE_OFFSETS,
  getBluesNotes,
  getHarmonicMinorNotes,
  getPentatonicNotes,
  getScaleDegrees,
  getScaleNotes,
  PENTATONIC_MAJOR_DEGREES,
  PENTATONIC_MINOR_DEGREES,
  SCALE_DEFINITIONS,
} from '../src/scales';

describe('SCALE_DEFINITIONS', () => {
  it('defines every theory scale type', () => {
    expect(Object.keys(SCALE_DEFINITIONS)).toEqual(Object.values(ScaleTypes));
  });
});

describe('getScaleNotes', () => {
  it('returns ionian notes for major type', () => {
    expect(getScaleNotes('C', ScaleTypes.Major)).toEqual(
      getModeNotes('C', Modes.Ionian)
    );
  });

  it('returns all 12 chromatic pitches for chromatic type', () => {
    expect(getScaleNotes('C', ScaleTypes.Chromatic)).toHaveLength(12);
  });

  it('returns major pentatonic from ionian', () => {
    expect(getScaleNotes('C', ScaleTypes.PentatonicMajor)).toEqual([
      'C',
      'D',
      'E',
      'G',
      'A',
    ]);
  });

  it('returns minor pentatonic from aeolian', () => {
    expect(getScaleNotes('C', ScaleTypes.PentatonicMinor)).toEqual([
      'C',
      'D#',
      'F',
      'G',
      'A#',
    ]);
  });

  it('returns blues scale with blue note for blues type', () => {
    expect(getScaleNotes('A', ScaleTypes.Blues)).toEqual(getBluesNotes('A'));
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

describe('getScaleDegrees', () => {
  it('returns major pentatonic emphasis degrees', () => {
    expect(getScaleDegrees(ScaleTypes.PentatonicMajor)).toEqual(
      PENTATONIC_MAJOR_DEGREES
    );
  });

  it('returns minor pentatonic emphasis degrees', () => {
    expect(getScaleDegrees(ScaleTypes.PentatonicMinor)).toEqual(
      PENTATONIC_MINOR_DEGREES
    );
  });

  it('returns blues scale degrees', () => {
    expect(getScaleDegrees(ScaleTypes.Blues)).toHaveLength(
      BLUES_SEMITONE_OFFSETS.length
    );
  });

  it('returns all 7 degrees for major type', () => {
    expect(getScaleDegrees(ScaleTypes.Major)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('returns all 12 degrees for chromatic type', () => {
    expect(getScaleDegrees(ScaleTypes.Chromatic)).toHaveLength(12);
  });
});

describe('getPentatonicNotes', () => {
  it('returns 5 major pentatonic notes for given root', () => {
    expect(getPentatonicNotes('C', PentatonicTypes.Major)).toEqual([
      'C',
      'D',
      'E',
      'G',
      'A',
    ]);
  });

  it('returns 5 minor pentatonic notes for given root', () => {
    expect(getPentatonicNotes('C', PentatonicTypes.Minor)).toEqual([
      'C',
      'D#',
      'F',
      'G',
      'A#',
    ]);
  });

  it('relative relationship: A minor pentatonic shares notes with C major pentatonic', () => {
    const cMajor = new Set(getPentatonicNotes('C', PentatonicTypes.Major));
    const aMinor = new Set(getPentatonicNotes('A', PentatonicTypes.Minor));
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
      expect(getPentatonicNotes(root, PentatonicTypes.Major)).toHaveLength(5);
      expect(getPentatonicNotes(root, PentatonicTypes.Minor)).toHaveLength(5);
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

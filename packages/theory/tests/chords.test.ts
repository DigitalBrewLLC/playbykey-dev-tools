import { describe, expect, it } from 'vitest';
import { ChordTypes, Modes } from '../src/constants';
import {
  CHORD_DEFINITIONS,
  detectChord,
  getAvailableInversions,
  getChordByDegree,
  getChordInversion,
  getChordNotes,
  getDiatonicChords,
} from '../src/chords';

describe('CHORD_DEFINITIONS', () => {
  it('defines all 22 chord types', () => {
    expect(Object.keys(CHORD_DEFINITIONS)).toHaveLength(22);
  });
});

describe('getChordNotes', () => {
  it('returns a major triad', () => {
    expect(getChordNotes('C', 'major-triad')).toEqual(['C', 'E', 'G']);
  });

  it('returns a minor 7th chord', () => {
    expect(getChordNotes('C', 'minor-7th')).toEqual(['C', 'D#', 'G', 'A#']);
  });

  it('returns a major 9th chord', () => {
    expect(getChordNotes('C', 'major-9th')).toEqual(['C', 'E', 'G', 'B', 'D']);
  });

  it('returns a sus4 chord', () => {
    expect(getChordNotes('C', 'sus4')).toEqual(['C', 'F', 'G']);
  });

  it('returns a major 13th chord (all 7 notes of the parent major scale)', () => {
    expect(getChordNotes('C', 'major-13th')).toEqual([
      'C',
      'E',
      'G',
      'B',
      'D',
      'F',
      'A',
    ]);
  });
});

describe('getDiatonicChords', () => {
  it('returns the 7 correct diatonic triads for C ionian', () => {
    const chords = getDiatonicChords('C', Modes.Ionian);
    expect(chords).toEqual([
      { root: 'C', type: 'major-triad' },
      { root: 'D', type: 'minor-triad' },
      { root: 'E', type: 'minor-triad' },
      { root: 'F', type: 'major-triad' },
      { root: 'G', type: 'major-triad' },
      { root: 'A', type: 'minor-triad' },
      { root: 'B', type: 'diminished-triad' },
    ]);
  });

  it('defaults to Ionian when mode is omitted', () => {
    expect(getDiatonicChords('C')).toEqual(
      getDiatonicChords('C', Modes.Ionian)
    );
  });
});

describe('getChordByDegree', () => {
  it('returns the same result as indexing into getDiatonicChords', () => {
    const diatonicChords = getDiatonicChords('C', Modes.Ionian);
    for (let degree = 1; degree <= 7; degree++) {
      expect(getChordByDegree(degree, 'C', Modes.Ionian)).toEqual(
        diatonicChords[degree - 1]
      );
    }
  });

  it('throws for an out-of-range degree', () => {
    expect(() => getChordByDegree(8, 'C', Modes.Ionian)).toThrow(RangeError);
  });
});

describe('getAvailableInversions', () => {
  it('returns [0,1,2] for a triad type', () => {
    expect(getAvailableInversions('major-triad')).toEqual([0, 1, 2]);
  });

  it('returns [0,1,2,3,4] for a 9th chord type', () => {
    expect(getAvailableInversions('major-9th')).toEqual([0, 1, 2, 3, 4]);
  });

  it('returns [0,1,2,3,4,5,6] for a 13th chord type', () => {
    expect(getAvailableInversions('major-13th')).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
});

describe('getChordInversion', () => {
  it('rotates a C major triad through all 3 inversions', () => {
    const chord = { root: 'C', type: 'major-triad' } as const;
    expect(getChordInversion(chord, 0)).toEqual(['C', 'E', 'G']);
    expect(getChordInversion(chord, 1)).toEqual(['E', 'G', 'C']);
    expect(getChordInversion(chord, 2)).toEqual(['G', 'C', 'E']);
  });

  it('throws when the inversion is out of range for the chord type', () => {
    const chord = { root: 'C', type: 'major-triad' } as const;
    expect(() => getChordInversion(chord, 3)).toThrow(RangeError);
  });

  it('rotates a C dominant 7th chord (4 notes) through all 4 inversions', () => {
    const chord = { root: 'C', type: 'dominant-7th' } as const;
    expect(getChordInversion(chord, 0)).toEqual(['C', 'E', 'G', 'A#']);
    expect(getChordInversion(chord, 1)).toEqual(['E', 'G', 'A#', 'C']);
    expect(getChordInversion(chord, 2)).toEqual(['G', 'A#', 'C', 'E']);
    expect(getChordInversion(chord, 3)).toEqual(['A#', 'C', 'E', 'G']);
  });

  it('rotates a C major 9th chord (5 notes) through all 5 inversions', () => {
    const chord = { root: 'C', type: 'major-9th' } as const;
    expect(getChordInversion(chord, 0)).toEqual(['C', 'E', 'G', 'B', 'D']);
    expect(getChordInversion(chord, 1)).toEqual(['E', 'G', 'B', 'D', 'C']);
    expect(getChordInversion(chord, 2)).toEqual(['G', 'B', 'D', 'C', 'E']);
    expect(getChordInversion(chord, 3)).toEqual(['B', 'D', 'C', 'E', 'G']);
    expect(getChordInversion(chord, 4)).toEqual(['D', 'C', 'E', 'G', 'B']);
  });
});

describe('detectChord', () => {
  it('identifies a major triad regardless of note order', () => {
    expect(detectChord(['E', 'C', 'G'])).toEqual({
      root: 'C',
      type: 'major-triad',
    });
  });

  it('ignores duplicate notes', () => {
    expect(detectChord(['C', 'C', 'E', 'G'])).toEqual({
      root: 'C',
      type: 'major-triad',
    });
  });

  it('returns null for an incomplete note set', () => {
    expect(detectChord(['C', 'E'])).toBeNull();
  });

  it('returns null for an empty note set', () => {
    expect(detectChord([])).toBeNull();
  });

  it('round-trips every chord type via getChordNotes', () => {
    for (const type of Object.values(ChordTypes)) {
      expect(detectChord(getChordNotes('C', type))).toEqual({
        root: 'C',
        type,
      });
    }
  });
});

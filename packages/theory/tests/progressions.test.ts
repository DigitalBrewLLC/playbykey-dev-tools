import { describe, expect, it } from 'vitest';
import { ChordTypes, ProgressionIds } from '../src/constants';
import {
  PROGRESSION_DEFINITIONS,
  getProgressionInKey,
  getRomanNumeral,
} from '../src/progressions';

describe('PROGRESSION_DEFINITIONS', () => {
  it('has exactly the 7 catalog entries with the correct degree sequences', () => {
    expect(
      PROGRESSION_DEFINITIONS[ProgressionIds.OneFiveSixFour].degrees
    ).toEqual([1, 5, 6, 4]);
    expect(PROGRESSION_DEFINITIONS[ProgressionIds.TwoFiveOne].degrees).toEqual([
      2, 5, 1,
    ]);
    expect(PROGRESSION_DEFINITIONS[ProgressionIds.OneFourFive].degrees).toEqual(
      [1, 4, 5]
    );
    expect(
      PROGRESSION_DEFINITIONS[ProgressionIds.SixFourOneFive].degrees
    ).toEqual([6, 4, 1, 5]);
    expect(
      PROGRESSION_DEFINITIONS[ProgressionIds.TwelveBarBlues].degrees
    ).toEqual([1, 1, 1, 1, 4, 4, 1, 1, 5, 4, 1, 1]);
    expect(
      PROGRESSION_DEFINITIONS[ProgressionIds.OneSixFourFive].degrees
    ).toEqual([1, 6, 4, 5]);
    expect(
      PROGRESSION_DEFINITIONS[ProgressionIds.OneSixTwoFive].degrees
    ).toEqual([1, 6, 2, 5]);
    expect(Object.keys(PROGRESSION_DEFINITIONS)).toEqual(
      Object.values(ProgressionIds)
    );
  });
});

describe('getProgressionInKey', () => {
  it('renders I-V-vi-IV in C', () => {
    const chords = getProgressionInKey(ProgressionIds.OneFiveSixFour, 'C');
    expect(chords).toEqual([
      { root: 'C', type: ChordTypes.MajorTriad },
      { root: 'G', type: ChordTypes.MajorTriad },
      { root: 'A', type: ChordTypes.MinorTriad },
      { root: 'F', type: ChordTypes.MajorTriad },
    ]);
  });

  it('transposes to a different root', () => {
    const chords = getProgressionInKey(ProgressionIds.OneFiveSixFour, 'D');
    expect(chords).toEqual([
      { root: 'D', type: ChordTypes.MajorTriad },
      { root: 'A', type: ChordTypes.MajorTriad },
      { root: 'B', type: ChordTypes.MinorTriad },
      { root: 'G', type: ChordTypes.MajorTriad },
    ]);
  });

  it('renders 12-bar-blues in C with the correct repeated-degree sequence', () => {
    const chords = getProgressionInKey(ProgressionIds.TwelveBarBlues, 'C');
    expect(chords).toHaveLength(12);
    expect(chords.map((c) => c.root)).toEqual([
      'C',
      'C',
      'C',
      'C',
      'F',
      'F',
      'C',
      'C',
      'G',
      'F',
      'C',
      'C',
    ]);
    expect(chords.every((c) => c.type === ChordTypes.MajorTriad)).toBe(true);
  });

  it('renders I-vi-IV-V in C', () => {
    const chords = getProgressionInKey(ProgressionIds.OneSixFourFive, 'C');
    expect(chords).toEqual([
      { root: 'C', type: ChordTypes.MajorTriad },
      { root: 'A', type: ChordTypes.MinorTriad },
      { root: 'F', type: ChordTypes.MajorTriad },
      { root: 'G', type: ChordTypes.MajorTriad },
    ]);
  });

  it('renders I-vi-ii-V in C', () => {
    const chords = getProgressionInKey(ProgressionIds.OneSixTwoFive, 'C');
    expect(chords).toEqual([
      { root: 'C', type: ChordTypes.MajorTriad },
      { root: 'A', type: ChordTypes.MinorTriad },
      { root: 'D', type: ChordTypes.MinorTriad },
      { root: 'G', type: ChordTypes.MajorTriad },
    ]);
  });
});

describe('getRomanNumeral', () => {
  it('returns the correct numeral for each ionian degree', () => {
    expect(getRomanNumeral(1, 'ionian')).toBe('I');
    expect(getRomanNumeral(2, 'ionian')).toBe('ii');
    expect(getRomanNumeral(5, 'ionian')).toBe('V');
    expect(getRomanNumeral(7, 'ionian')).toBe('vii°');
  });

  it('defaults to Ionian when mode is omitted', () => {
    expect(getRomanNumeral(2)).toBe(getRomanNumeral(2, 'ionian'));
  });

  it('throws a RangeError for an out-of-range degree', () => {
    expect(() => getRomanNumeral(0, 'ionian')).toThrow(RangeError);
    expect(() => getRomanNumeral(8, 'ionian')).toThrow(RangeError);
  });

  it("reflects a non-Ionian mode's own diatonic quality", () => {
    // Dorian's 6th degree is diminished (unlike Ionian's minor), confirming
    // getRomanNumeral's mode flexibility still works even though
    // getProgressionInKey no longer exposes a mode parameter.
    expect(getRomanNumeral(6, 'dorian')).toBe('vi°');
  });
});

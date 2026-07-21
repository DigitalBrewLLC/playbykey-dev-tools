import { describe, expect, it } from 'vitest';
import { ProgressionIds } from '../src/constants';
import {
  PROGRESSION_DEFINITIONS,
  getProgressionInKey,
  getRomanNumeral,
} from '../src/progressions';

describe('PROGRESSION_DEFINITIONS', () => {
  it('has exactly the 5 catalog entries with the correct degree sequences', () => {
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
    expect(Object.keys(PROGRESSION_DEFINITIONS)).toEqual(
      Object.values(ProgressionIds)
    );
  });
});

describe('getProgressionInKey', () => {
  it('renders I-V-vi-IV in C', () => {
    const chords = getProgressionInKey('I-V-vi-IV', 'C');
    expect(chords).toEqual([
      { root: 'C', type: 'major-triad' },
      { root: 'G', type: 'major-triad' },
      { root: 'A', type: 'minor-triad' },
      { root: 'F', type: 'major-triad' },
    ]);
  });

  it('transposes to a different root', () => {
    const chords = getProgressionInKey('I-V-vi-IV', 'D');
    expect(chords).toEqual([
      { root: 'D', type: 'major-triad' },
      { root: 'A', type: 'major-triad' },
      { root: 'B', type: 'minor-triad' },
      { root: 'G', type: 'major-triad' },
    ]);
  });

  it('renders 12-bar-blues in C with the correct repeated-degree sequence', () => {
    const chords = getProgressionInKey('12-bar-blues', 'C');
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
    expect(chords.every((c) => c.type === 'major-triad')).toBe(true);
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

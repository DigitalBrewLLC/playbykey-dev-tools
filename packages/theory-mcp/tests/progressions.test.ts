import { describe, it, expect } from 'vitest';
import { ChordTypes, ProgressionIds } from '@playbykey/theory';
import {
  handleGetProgressionInKey,
  handleGetRomanNumeral,
} from '../src/tools/progressions.js';

describe('handleGetProgressionInKey', () => {
  it('returns 4 chords for I-V-vi-IV in C', () => {
    const result = handleGetProgressionInKey({
      progression_id: ProgressionIds.OneFiveSixFour,
      root: 'C',
    });
    const text = result.content[0]?.text ?? '';
    const parsed = JSON.parse(text.slice(text.indexOf('{'))) as {
      chords: Array<{ root: string; type: string }>;
    };
    expect(parsed.chords).toEqual([
      { root: 'C', type: ChordTypes.MajorTriad },
      { root: 'G', type: ChordTypes.MajorTriad },
      { root: 'A', type: ChordTypes.MinorTriad },
      { root: 'F', type: ChordTypes.MajorTriad },
    ]);
  });

  it('returns error for invalid progression ID', () => {
    const result = handleGetProgressionInKey({
      progression_id: 'bogus',
      root: 'C',
    });
    expect(result.content[0]?.text).toContain('Invalid progression ID');
  });

  it('returns error for invalid root', () => {
    const result = handleGetProgressionInKey({
      progression_id: ProgressionIds.OneFiveSixFour,
      root: 'X',
    });
    expect(result.content[0]?.text).toContain('Invalid note');
  });

  it('accepts flat-spelled notes, normalizing to the same result as sharps', () => {
    const flat = handleGetProgressionInKey({
      progression_id: ProgressionIds.OneFiveSixFour,
      root: 'Db',
    });
    const sharp = handleGetProgressionInKey({
      progression_id: ProgressionIds.OneFiveSixFour,
      root: 'C#',
    });
    expect(flat.content[0]?.text).toEqual(sharp.content[0]?.text);
  });
});

describe('handleGetRomanNumeral', () => {
  it('returns the numeral for degree 7 in ionian', () => {
    const result = handleGetRomanNumeral({ degree: 7, mode: 'ionian' });
    expect(result.content[0]?.text).toContain('vii°');
  });

  it('returns error for invalid degree', () => {
    const result = handleGetRomanNumeral({ degree: 8, mode: 'ionian' });
    expect(result.content[0]?.text).toContain('Invalid degree');
  });

  it('returns error for invalid mode', () => {
    const result = handleGetRomanNumeral({ degree: 1, mode: 'bogus' });
    expect(result.content[0]?.text).toContain('Invalid mode');
  });

  it('defaults to ionian when mode is omitted', () => {
    const withMode = handleGetRomanNumeral({ degree: 7, mode: 'ionian' });
    const omitted = handleGetRomanNumeral({ degree: 7 });
    expect(omitted.content[0]?.text).toEqual(withMode.content[0]?.text);
  });
});

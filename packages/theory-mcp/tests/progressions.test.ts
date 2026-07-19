import { describe, it, expect } from 'vitest';
import {
  handleGetProgressionInKey,
  handleGetRomanNumeral,
} from '../src/tools/progressions.js';

describe('handleGetProgressionInKey', () => {
  it('returns 4 chords for I-V-vi-IV in C', () => {
    const result = handleGetProgressionInKey({
      progression_id: 'I-V-vi-IV',
      root: 'C',
    });
    const text = result.content[0]?.text ?? '';
    expect(text).toContain('C major-triad');
    expect(text).toContain('G major-triad');
    expect(text).toContain('A minor-triad');
    expect(text).toContain('F major-triad');
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
      progression_id: 'I-V-vi-IV',
      root: 'X',
    });
    expect(result.content[0]?.text).toContain('Invalid note');
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
});

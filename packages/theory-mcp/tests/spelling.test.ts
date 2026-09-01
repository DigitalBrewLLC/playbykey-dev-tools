import { describe, it, expect } from 'vitest';
import {
  handleGetSharps,
  handleGetFlats,
  handleGetEnharmonicLabels,
  handleGetRootLetter,
  handleSpellDiatonicScale,
} from '../src/tools/spelling.js';

describe('handleGetSharps', () => {
  it('normalizes flat and sharp input to canonical sharps', () => {
    const result = handleGetSharps({ notes: ['Db', 'C#', 'D'] });
    const text = result.content[0]?.text ?? '';
    const parsed = JSON.parse(text.slice(text.indexOf('{'))) as {
      notes: string[];
    };
    expect(parsed.notes).toEqual(['C#', 'C#', 'D']);
  });

  it('returns error for invalid note', () => {
    const result = handleGetSharps({ notes: ['H'] });
    expect(result.content[0]?.text).toContain('Invalid note');
  });
});

describe('handleGetFlats', () => {
  it('respells sharp notes as flats', () => {
    const result = handleGetFlats({ notes: ['C#', 'D'] });
    const text = result.content[0]?.text ?? '';
    const parsed = JSON.parse(text.slice(text.indexOf('{'))) as {
      notes: string[];
    };
    expect(parsed.notes).toEqual(['Db', 'D']);
  });

  it('returns error for invalid note', () => {
    const result = handleGetFlats({ notes: ['H'] });
    expect(result.content[0]?.text).toContain('Invalid note');
  });
});

describe('handleGetEnharmonicLabels', () => {
  it('returns combined sharp/flat labels', () => {
    const result = handleGetEnharmonicLabels({ notes: ['C#', 'D'] });
    const text = result.content[0]?.text ?? '';
    const parsed = JSON.parse(text.slice(text.indexOf('{'))) as {
      notes: string[];
    };
    expect(parsed.notes).toEqual(['Db/C#', 'D']);
  });

  it('returns error for invalid note', () => {
    const result = handleGetEnharmonicLabels({ notes: ['H'] });
    expect(result.content[0]?.text).toContain('Invalid note');
  });
});

describe('handleGetRootLetter', () => {
  it('resolves the sharp-side letter under sharp preference', () => {
    const result = handleGetRootLetter({ root: 'F#', preference: 'sharp' });
    const text = result.content[0]?.text ?? '';
    const parsed = JSON.parse(text.slice(text.indexOf('{'))) as {
      letter: string;
    };
    expect(parsed.letter).toBe('F');
  });

  it('resolves the flat-side letter under flat preference', () => {
    const result = handleGetRootLetter({ root: 'F#', preference: 'flat' });
    const text = result.content[0]?.text ?? '';
    const parsed = JSON.parse(text.slice(text.indexOf('{'))) as {
      letter: string;
    };
    expect(parsed.letter).toBe('G');
  });

  it('returns error for invalid note', () => {
    const result = handleGetRootLetter({ root: 'H', preference: 'sharp' });
    expect(result.content[0]?.text).toContain('Invalid note');
  });

  it('returns error for invalid preference', () => {
    const result = handleGetRootLetter({ root: 'F#', preference: 'both' });
    expect(result.content[0]?.text).toContain('Invalid spelling preference');
  });
});

describe('handleSpellDiatonicScale', () => {
  it('respells a scale requiring a sharp a Note cannot express alone', () => {
    const result = handleSpellDiatonicScale({
      notes: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F'],
      root_letter: 'F',
    });
    const text = result.content[0]?.text ?? '';
    const parsed = JSON.parse(text.slice(text.indexOf('{'))) as {
      notes: string[];
    };
    expect(parsed.notes).toEqual(['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#']);
  });

  it('returns error for invalid note', () => {
    const result = handleSpellDiatonicScale({
      notes: ['H'],
      root_letter: 'F',
    });
    expect(result.content[0]?.text).toContain('Invalid note');
  });

  it('returns error for invalid root letter', () => {
    const result = handleSpellDiatonicScale({
      notes: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F'],
      root_letter: 'H',
    });
    expect(result.content[0]?.text).toContain('Invalid note letter');
  });

  it('returns error for a scale that is not exactly 7 notes', () => {
    const result = handleSpellDiatonicScale({
      notes: ['C', 'D', 'E'],
      root_letter: 'C',
    });
    expect(result.content[0]?.text).toContain('expects exactly 7 notes');
  });
});

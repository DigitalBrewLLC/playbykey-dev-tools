import { describe, it, expect } from 'vitest';
import {
  handleGetSharps,
  handleGetFlats,
  handleGetEnharmonicLabels,
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

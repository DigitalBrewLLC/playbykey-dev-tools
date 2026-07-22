import { describe, it, expect } from 'vitest';
import { handleTranspose } from '../src/tools/transpose.js';

describe('handleTranspose', () => {
  it('transposes a C major triad to D', () => {
    const result = handleTranspose({
      notes: ['C', 'E', 'G'],
      from_root: 'C',
      to_root: 'D',
    });
    expect(result.content[0]?.text).toContain('["D","F#","A"]');
  });

  it('returns error for invalid notes', () => {
    const result = handleTranspose({
      notes: ['X'],
      from_root: 'C',
      to_root: 'D',
    });
    expect(result.content[0]?.text).toContain('Invalid note');
  });

  it('returns error for invalid from_root', () => {
    const result = handleTranspose({
      notes: ['C'],
      from_root: 'X',
      to_root: 'D',
    });
    expect(result.content[0]?.text).toContain('Invalid note');
  });

  it('returns error for invalid to_root', () => {
    const result = handleTranspose({
      notes: ['C'],
      from_root: 'C',
      to_root: 'X',
    });
    expect(result.content[0]?.text).toContain('Invalid note');
  });

  it('accepts flat-spelled notes, normalizing to the same result as sharps', () => {
    const flat = handleTranspose({
      notes: ['Db'],
      from_root: 'Db',
      to_root: 'D',
    });
    const sharp = handleTranspose({
      notes: ['C#'],
      from_root: 'C#',
      to_root: 'D',
    });
    expect(flat.content[0]?.text).toEqual(sharp.content[0]?.text);
  });
});

import { describe, it, expect } from 'vitest';
import {
  handleGetCircleOfFifths,
  handleGetKeySignature,
} from '../src/tools/circle.js';

describe('handleGetCircleOfFifths', () => {
  it('returns 12 notes starting from C', () => {
    const result = handleGetCircleOfFifths();
    const text = result.content[0]?.text ?? '';
    const parsed = JSON.parse(text.slice(text.indexOf('{'))) as {
      notes: string[];
    };
    expect(parsed.notes).toHaveLength(12);
    expect(parsed.notes[0]).toBe('C');
  });
});

describe('handleGetKeySignature', () => {
  it('returns no sharps or flats for C major', () => {
    const result = handleGetKeySignature({ key: 'C' });
    expect(result.content[0]?.text).toContain('no sharps or flats');
  });

  it('returns 2 sharps for D major', () => {
    const result = handleGetKeySignature({ key: 'D' });
    expect(result.content[0]?.text).toContain('2 sharp');
  });

  it('returns error for invalid key', () => {
    const result = handleGetKeySignature({ key: 'H' });
    expect(result.content[0]?.text).toContain('Invalid note');
  });
});

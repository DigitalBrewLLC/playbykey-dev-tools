import { describe, it, expect } from 'vitest';
import {
  handleGetModeNotes,
  handleGetParentScaleModes,
  handleGetModalRoot,
  handleGetRelativeMinor,
  handleGetRelativeMajor,
  handleGetModeInfo,
} from '../src/tools/modes.js';

describe('handleGetModeNotes', () => {
  it('returns notes for C ionian', () => {
    const result = handleGetModeNotes({ root: 'C', mode: 'ionian' });
    expect(result.content[0]?.text).toContain('C');
    expect(result.content[0]?.text).toContain('["C","D","E","F","G","A","B"]');
  });

  it('returns error for invalid root', () => {
    const result = handleGetModeNotes({ root: 'X', mode: 'ionian' });
    expect(result.content[0]?.text).toContain('Invalid note');
  });

  it('returns error for invalid mode', () => {
    const result = handleGetModeNotes({ root: 'C', mode: 'major' });
    expect(result.content[0]?.text).toContain('Invalid mode');
  });
});

describe('handleGetParentScaleModes', () => {
  it('returns 7 modes for D dorian', () => {
    const result = handleGetParentScaleModes({ root: 'D', mode: 'dorian' });
    const text = result.content[0]?.text ?? '';
    const parsed = JSON.parse(text.slice(text.indexOf('{'))) as {
      modes: unknown[];
    };
    expect(parsed.modes).toHaveLength(7);
  });
});

describe('handleGetModalRoot', () => {
  it('returns D for C major dorian', () => {
    const result = handleGetModalRoot({ parent_key: 'C', mode: 'dorian' });
    expect(result.content[0]?.text).toContain('D');
  });
});

describe('handleGetRelativeMinor', () => {
  it('returns A for C major', () => {
    const result = handleGetRelativeMinor({ major_key: 'C' });
    expect(result.content[0]?.text).toContain('A');
  });
});

describe('handleGetRelativeMajor', () => {
  it('returns C for A minor', () => {
    const result = handleGetRelativeMajor({ minor_key: 'A' });
    expect(result.content[0]?.text).toContain('C');
  });
});

describe('handleGetModeInfo', () => {
  it('returns info for dorian', () => {
    const result = handleGetModeInfo({ mode: 'dorian' });
    expect(result.content[0]?.text).toContain('Dorian');
    expect(result.content[0]?.text).toContain('"scaleDegree":2');
  });

  it('returns error for invalid mode', () => {
    const result = handleGetModeInfo({ mode: 'invalid' });
    expect(result.content[0]?.text).toContain('Invalid mode');
  });
});

import { describe, it, expect } from 'vitest';
import {
  handleGetScaleNotes,
  handleBuildNoteMap,
  handleGetScaleDegree,
  handleIsNoteInScale,
} from '../src/tools/scales.js';

describe('handleGetScaleNotes', () => {
  it('returns notes for C major', () => {
    const result = handleGetScaleNotes({ root: 'C', scale_type: 'major' });
    expect(result.content[0]?.text).toContain('["C","D","E","F","G","A","B"]');
  });

  it('returns notes for A blues', () => {
    const result = handleGetScaleNotes({ root: 'A', scale_type: 'blues' });
    expect(result.content[0]?.text).toContain('A');
    expect(result.content[0]?.text).toContain('"blues"');
  });

  it('returns error for invalid scale type', () => {
    const result = handleGetScaleNotes({ root: 'C', scale_type: 'ionian' });
    expect(result.content[0]?.text).toContain('Invalid scale type');
  });

  it('returns error for invalid root', () => {
    const result = handleGetScaleNotes({ root: 'X', scale_type: 'major' });
    expect(result.content[0]?.text).toContain('Invalid note');
  });
});

describe('handleBuildNoteMap', () => {
  it('returns note map with scaleDegree and semitoneOffset', () => {
    const result = handleBuildNoteMap({ root: 'C', scale_type: 'major' });
    const text = result.content[0]?.text ?? '';
    const parsed = JSON.parse(text.slice(text.indexOf('{'))) as {
      noteMap: Array<{
        note: string;
        scaleDegree: number;
        semitoneOffset: number;
      }>;
    };
    expect(parsed.noteMap[0]).toMatchObject({
      note: 'C',
      scaleDegree: 1,
      semitoneOffset: 0,
    });
  });

  it('returns error for invalid scale type', () => {
    const result = handleBuildNoteMap({ root: 'C', scale_type: 'dorian' });
    expect(result.content[0]?.text).toContain('Invalid scale type');
  });
});

describe('handleGetScaleDegree', () => {
  it('returns degree 3 for E in C major', () => {
    const result = handleGetScaleDegree({
      root: 'C',
      scale_type: 'major',
      note: 'E',
    });
    const text = result.content[0]?.text ?? '';
    expect(text).toContain('degree 3');
    const parsed = JSON.parse(text.slice(text.indexOf('{'))) as {
      degree: number;
      inScale: boolean;
    };
    expect(parsed.degree).toBe(3);
    expect(parsed.inScale).toBe(true);
  });

  it('returns null degree for F# in C major', () => {
    const result = handleGetScaleDegree({
      root: 'C',
      scale_type: 'major',
      note: 'F#',
    });
    const text = result.content[0]?.text ?? '';
    expect(text).toContain('not in');
    const parsed = JSON.parse(text.slice(text.indexOf('{'))) as {
      degree: null;
      inScale: boolean;
    };
    expect(parsed.degree).toBeNull();
    expect(parsed.inScale).toBe(false);
  });

  it('returns error for invalid note', () => {
    const result = handleGetScaleDegree({
      root: 'C',
      scale_type: 'major',
      note: 'X',
    });
    expect(result.content[0]?.text).toContain('Invalid note');
  });
});

describe('handleIsNoteInScale', () => {
  it('returns true for G in C major', () => {
    const result = handleIsNoteInScale({
      root: 'C',
      scale_type: 'major',
      note: 'G',
    });
    const text = result.content[0]?.text ?? '';
    expect(text).not.toContain('not in');
    const parsed = JSON.parse(text.slice(text.indexOf('{'))) as {
      inScale: boolean;
    };
    expect(parsed.inScale).toBe(true);
  });

  it('returns false for F# in C major', () => {
    const result = handleIsNoteInScale({
      root: 'C',
      scale_type: 'major',
      note: 'F#',
    });
    const text = result.content[0]?.text ?? '';
    expect(text).toContain('not in');
    const parsed = JSON.parse(text.slice(text.indexOf('{'))) as {
      inScale: boolean;
    };
    expect(parsed.inScale).toBe(false);
  });

  it('returns error for invalid scale type', () => {
    const result = handleIsNoteInScale({
      root: 'C',
      scale_type: 'ionian',
      note: 'G',
    });
    expect(result.content[0]?.text).toContain('Invalid scale type');
  });
});

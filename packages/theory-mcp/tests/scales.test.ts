import { describe, it, expect } from 'vitest';
import {
  handleGetScaleNotes,
  handleBuildNoteMap,
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

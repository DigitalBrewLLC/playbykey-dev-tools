import { describe, it, expect } from 'vitest';
import {
  handleGetScaleNotes,
  handleBuildNoteMap,
  handleGetScaleDegree,
  handleIsNoteInScale,
  handleGetMelodicMinorNotes,
  handleGetMelodicMinorModeNotes,
  handleGetHarmonicMinorModeNotes,
  handleGetBebopScaleNotes,
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

describe('handleGetMelodicMinorNotes', () => {
  it('returns the ascending melodic minor scale for C', () => {
    const result = handleGetMelodicMinorNotes({ root: 'C' });
    expect(result.content[0]?.text).toContain('["C","D","D#","F","G","A","B"]');
  });

  it('returns error for invalid root', () => {
    const result = handleGetMelodicMinorNotes({ root: 'X' });
    expect(result.content[0]?.text).toContain('Invalid note');
  });

  it('accepts flat-spelled notes, normalizing to the same result as sharps', () => {
    const flat = handleGetMelodicMinorNotes({ root: 'Db' });
    const sharp = handleGetMelodicMinorNotes({ root: 'C#' });
    expect(flat.content[0]?.text).toEqual(sharp.content[0]?.text);
  });
});

describe('handleGetMelodicMinorModeNotes', () => {
  it('returns the altered mode for C', () => {
    const result = handleGetMelodicMinorModeNotes({
      root: 'C',
      mode: 'altered',
    });
    expect(result.content[0]?.text).toContain(
      '["C","C#","D#","E","F#","G#","A#"]'
    );
  });

  it('returns error for invalid mode', () => {
    const result = handleGetMelodicMinorModeNotes({
      root: 'C',
      mode: 'bogus',
    });
    expect(result.content[0]?.text).toContain('Invalid melodic minor mode');
  });

  it('accepts flat-spelled notes, normalizing to the same result as sharps', () => {
    const flat = handleGetMelodicMinorModeNotes({
      root: 'Db',
      mode: 'altered',
    });
    const sharp = handleGetMelodicMinorModeNotes({
      root: 'C#',
      mode: 'altered',
    });
    expect(flat.content[0]?.text).toEqual(sharp.content[0]?.text);
  });
});

describe('handleGetHarmonicMinorModeNotes', () => {
  it('returns the phrygian dominant mode for C', () => {
    const result = handleGetHarmonicMinorModeNotes({
      root: 'C',
      mode: 'phrygian-dominant',
    });
    expect(result.content[0]?.text).toContain(
      '["C","C#","E","F","G","G#","A#"]'
    );
  });

  it('returns error for invalid mode', () => {
    const result = handleGetHarmonicMinorModeNotes({
      root: 'C',
      mode: 'bogus',
    });
    expect(result.content[0]?.text).toContain('Invalid harmonic minor mode');
  });

  it('accepts flat-spelled notes, normalizing to the same result as sharps', () => {
    const flat = handleGetHarmonicMinorModeNotes({
      root: 'Db',
      mode: 'phrygian-dominant',
    });
    const sharp = handleGetHarmonicMinorModeNotes({
      root: 'C#',
      mode: 'phrygian-dominant',
    });
    expect(flat.content[0]?.text).toEqual(sharp.content[0]?.text);
  });
});

describe('handleGetBebopScaleNotes', () => {
  it('returns the 8-note bebop dominant scale for C', () => {
    const result = handleGetBebopScaleNotes({
      root: 'C',
      type: 'bebop-dominant',
    });
    expect(result.content[0]?.text).toContain(
      '["C","D","E","F","G","A","A#","B"]'
    );
  });

  it('returns error for invalid type', () => {
    const result = handleGetBebopScaleNotes({ root: 'C', type: 'bogus' });
    expect(result.content[0]?.text).toContain('Invalid bebop scale type');
  });

  it('accepts flat-spelled notes, normalizing to the same result as sharps', () => {
    const flat = handleGetBebopScaleNotes({
      root: 'Db',
      type: 'bebop-dominant',
    });
    const sharp = handleGetBebopScaleNotes({
      root: 'C#',
      type: 'bebop-dominant',
    });
    expect(flat.content[0]?.text).toEqual(sharp.content[0]?.text);
  });
});

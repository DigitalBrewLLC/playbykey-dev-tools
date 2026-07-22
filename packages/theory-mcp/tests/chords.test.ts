import { describe, it, expect } from 'vitest';
import {
  handleGetChordNotes,
  handleGetDiatonicChords,
  handleGetChordByDegree,
  handleGetAvailableInversions,
  handleGetChordInversion,
} from '../src/tools/chords.js';

describe('handleGetChordNotes', () => {
  it('returns notes for a C major triad', () => {
    const result = handleGetChordNotes({
      root: 'C',
      chord_type: 'major-triad',
    });
    expect(result.content[0]?.text).toContain('["C","E","G"]');
  });

  it('returns error for invalid chord type', () => {
    const result = handleGetChordNotes({ root: 'C', chord_type: 'bogus' });
    expect(result.content[0]?.text).toContain('Invalid chord type');
  });

  it('returns error for invalid root', () => {
    const result = handleGetChordNotes({
      root: 'X',
      chord_type: 'major-triad',
    });
    expect(result.content[0]?.text).toContain('Invalid note');
  });

  it('accepts flat-spelled notes, normalizing to the same result as sharps', () => {
    const flat = handleGetChordNotes({ root: 'Db', chord_type: 'major-triad' });
    const sharp = handleGetChordNotes({
      root: 'C#',
      chord_type: 'major-triad',
    });
    expect(flat.content[0]?.text).toEqual(sharp.content[0]?.text);
  });
});

describe('handleGetDiatonicChords', () => {
  it('returns the 7 diatonic chords for C ionian', () => {
    const result = handleGetDiatonicChords({ root: 'C', mode: 'ionian' });
    const text = result.content[0]?.text ?? '';
    const parsed = JSON.parse(text.slice(text.indexOf('{'))) as {
      chords: Array<{ root: string; type: string }>;
    };
    expect(parsed.chords[0]).toEqual({ root: 'C', type: 'major-triad' });
    expect(parsed.chords[6]).toEqual({ root: 'B', type: 'diminished-triad' });
  });

  it('returns error for invalid mode', () => {
    const result = handleGetDiatonicChords({ root: 'C', mode: 'bogus' });
    expect(result.content[0]?.text).toContain('Invalid mode');
  });

  it('defaults to ionian when mode is omitted', () => {
    const withMode = handleGetDiatonicChords({ root: 'C', mode: 'ionian' });
    const omitted = handleGetDiatonicChords({ root: 'C' });
    expect(omitted.content[0]?.text).toEqual(withMode.content[0]?.text);
  });

  it('accepts flat-spelled notes, normalizing to the same result as sharps', () => {
    const flat = handleGetDiatonicChords({ root: 'Db', mode: 'ionian' });
    const sharp = handleGetDiatonicChords({ root: 'C#', mode: 'ionian' });
    expect(flat.content[0]?.text).toEqual(sharp.content[0]?.text);
  });
});

describe('handleGetChordByDegree', () => {
  it('returns the chord at degree 5 of C ionian', () => {
    const result = handleGetChordByDegree({
      degree: 5,
      root: 'C',
      mode: 'ionian',
    });
    const text = result.content[0]?.text ?? '';
    expect(text).toContain('G major-triad');
  });

  it('returns error for invalid degree', () => {
    const result = handleGetChordByDegree({
      degree: 8,
      root: 'C',
      mode: 'ionian',
    });
    expect(result.content[0]?.text).toContain('Invalid degree');
  });

  it('defaults to ionian when mode is omitted', () => {
    const withMode = handleGetChordByDegree({
      degree: 5,
      root: 'C',
      mode: 'ionian',
    });
    const omitted = handleGetChordByDegree({ degree: 5, root: 'C' });
    expect(omitted.content[0]?.text).toEqual(withMode.content[0]?.text);
  });

  it('accepts flat-spelled notes, normalizing to the same result as sharps', () => {
    const flat = handleGetChordByDegree({
      degree: 5,
      root: 'Db',
      mode: 'ionian',
    });
    const sharp = handleGetChordByDegree({
      degree: 5,
      root: 'C#',
      mode: 'ionian',
    });
    expect(flat.content[0]?.text).toEqual(sharp.content[0]?.text);
  });
});

describe('handleGetAvailableInversions', () => {
  it('returns [0,1,2,3,4] for a 9th chord', () => {
    const result = handleGetAvailableInversions({ chord_type: 'major-9th' });
    expect(result.content[0]?.text).toContain('[0,1,2,3,4]');
  });

  it('returns error for invalid chord type', () => {
    const result = handleGetAvailableInversions({ chord_type: 'bogus' });
    expect(result.content[0]?.text).toContain('Invalid chord type');
  });
});

describe('handleGetChordInversion', () => {
  it('returns inverted notes for a C major triad', () => {
    const result = handleGetChordInversion({
      root: 'C',
      chord_type: 'major-triad',
      inversion: 1,
    });
    expect(result.content[0]?.text).toContain('["E","G","C"]');
  });

  it('returns error-content, not an unhandled exception, for an out-of-range inversion', () => {
    const result = handleGetChordInversion({
      root: 'C',
      chord_type: 'major-triad',
      inversion: 3,
    });
    expect(result.content[0]?.text).toContain('out of range');
  });

  it('returns error for invalid inversion type', () => {
    const result = handleGetChordInversion({
      root: 'C',
      chord_type: 'major-triad',
      inversion: 'bogus',
    });
    expect(result.content[0]?.text).toContain('Invalid inversion');
  });

  it('accepts flat-spelled notes, normalizing to the same result as sharps', () => {
    const flat = handleGetChordInversion({
      root: 'Db',
      chord_type: 'major-triad',
      inversion: 1,
    });
    const sharp = handleGetChordInversion({
      root: 'C#',
      chord_type: 'major-triad',
      inversion: 1,
    });
    expect(flat.content[0]?.text).toEqual(sharp.content[0]?.text);
  });
});

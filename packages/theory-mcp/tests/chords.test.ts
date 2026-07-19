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
});

describe('handleGetDiatonicChords', () => {
  it('returns the 7 diatonic chords for C ionian', () => {
    const result = handleGetDiatonicChords({ root: 'C', mode: 'ionian' });
    const text = result.content[0]?.text ?? '';
    expect(text).toContain('C major-triad');
    expect(text).toContain('B diminished-triad');
  });

  it('returns error for invalid mode', () => {
    const result = handleGetDiatonicChords({ root: 'C', mode: 'bogus' });
    expect(result.content[0]?.text).toContain('Invalid mode');
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
});

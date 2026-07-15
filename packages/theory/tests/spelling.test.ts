import { describe, expect, it } from 'vitest';
import { getEnharmonicLabels, getFlats, getSharps } from '../src';
import type { Note } from '../src';

const ALL_NOTES: Note[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

describe('getFlats', () => {
  it('respells the 5 altered notes as flats and leaves naturals unchanged', () => {
    expect(getFlats(ALL_NOTES)).toEqual([
      'C',
      'Db',
      'D',
      'Eb',
      'E',
      'F',
      'Gb',
      'G',
      'Ab',
      'A',
      'Bb',
      'B',
    ]);
  });

  it('returns an empty array for an empty input', () => {
    expect(getFlats([])).toEqual([]);
  });
});

describe('getEnharmonicLabels', () => {
  it('returns combined sharp/flat labels for altered notes and leaves naturals unchanged', () => {
    expect(getEnharmonicLabels(ALL_NOTES)).toEqual([
      'C',
      'Db/C#',
      'D',
      'Eb/D#',
      'E',
      'F',
      'Gb/F#',
      'G',
      'Ab/G#',
      'A',
      'Bb/A#',
      'B',
    ]);
  });

  it('returns an empty array for an empty input', () => {
    expect(getEnharmonicLabels([])).toEqual([]);
  });
});

describe('getSharps', () => {
  it('normalizes flat-spelled notes to sharps and passes sharps/naturals through unchanged', () => {
    expect(getSharps(['Db', 'C#', 'D'])).toEqual(['C#', 'C#', 'D']);
  });

  it('returns an empty array for an empty input', () => {
    expect(getSharps([])).toEqual([]);
  });
});

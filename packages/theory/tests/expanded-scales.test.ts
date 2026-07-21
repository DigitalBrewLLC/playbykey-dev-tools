import { describe, expect, it } from 'vitest';
import {
  BebopScaleTypes,
  HarmonicMinorModes,
  MelodicMinorModes,
  ScaleTypes,
} from '../src/constants';
import {
  getBebopScaleNotes,
  getHarmonicMinorModeNotes,
  getHarmonicMinorNotes,
  getMelodicMinorModeNotes,
  getMelodicMinorNotes,
  getScaleNotes,
} from '../src/scales';

describe('getMelodicMinorNotes', () => {
  it('returns the ascending melodic minor scale for C', () => {
    expect(getMelodicMinorNotes('C')).toEqual([
      'C',
      'D',
      'D#',
      'F',
      'G',
      'A',
      'B',
    ]);
  });

  it('matches the generic getScaleNotes dispatcher', () => {
    expect(getScaleNotes('C', ScaleTypes.MelodicMinor)).toEqual(
      getMelodicMinorNotes('C')
    );
  });
});

describe('getMelodicMinorModeNotes', () => {
  it('returns the altered (7th mode) rotation for C', () => {
    expect(getMelodicMinorModeNotes('C', MelodicMinorModes.Altered)).toEqual([
      'C',
      'C#',
      'D#',
      'E',
      'F#',
      'G#',
      'A#',
    ]);
  });
});

describe('getHarmonicMinorModeNotes', () => {
  it('returns the phrygian dominant mode for C', () => {
    expect(
      getHarmonicMinorModeNotes('C', HarmonicMinorModes.PhrygianDominant)
    ).toEqual(['C', 'C#', 'E', 'F', 'G', 'G#', 'A#']);
  });

  it('matches getHarmonicMinorNotes when mode is harmonic-minor', () => {
    expect(
      getHarmonicMinorModeNotes('C', HarmonicMinorModes.HarmonicMinor)
    ).toEqual(getHarmonicMinorNotes('C'));
  });
});

describe('getBebopScaleNotes', () => {
  it('returns the 8-note bebop dominant scale for C', () => {
    expect(getBebopScaleNotes('C', BebopScaleTypes.BebopDominant)).toEqual([
      'C',
      'D',
      'E',
      'F',
      'G',
      'A',
      'A#',
      'B',
    ]);
  });
});

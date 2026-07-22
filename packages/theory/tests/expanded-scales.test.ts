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
  it('returns melodic minor itself for the melodic-minor mode', () => {
    expect(
      getMelodicMinorModeNotes('C', MelodicMinorModes.MelodicMinor)
    ).toEqual(getMelodicMinorNotes('C'));
  });

  it('returns the dorian b2 (2nd mode) rotation for C', () => {
    expect(getMelodicMinorModeNotes('C', MelodicMinorModes.DorianB2)).toEqual([
      'C',
      'C#',
      'D#',
      'F',
      'G',
      'A',
      'A#',
    ]);
  });

  it('returns the lydian augmented (3rd mode) rotation for C', () => {
    expect(
      getMelodicMinorModeNotes('C', MelodicMinorModes.LydianAugmented)
    ).toEqual(['C', 'D', 'E', 'F#', 'G#', 'A', 'B']);
  });

  it('returns the lydian dominant (4th mode) rotation for C', () => {
    expect(
      getMelodicMinorModeNotes('C', MelodicMinorModes.LydianDominant)
    ).toEqual(['C', 'D', 'E', 'F#', 'G', 'A', 'A#']);
  });

  it('returns the mixolydian b6 (5th mode) rotation for C', () => {
    expect(
      getMelodicMinorModeNotes('C', MelodicMinorModes.MixolydianB6)
    ).toEqual(['C', 'D', 'E', 'F', 'G', 'G#', 'A#']);
  });

  it('returns the locrian nat2 (6th mode) rotation for C', () => {
    expect(
      getMelodicMinorModeNotes('C', MelodicMinorModes.LocrianNat2)
    ).toEqual(['C', 'D', 'D#', 'F', 'F#', 'G#', 'A#']);
  });

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

  it('returns the 8-note bebop major scale for C', () => {
    expect(getBebopScaleNotes('C', BebopScaleTypes.BebopMajor)).toEqual([
      'C',
      'D',
      'E',
      'F',
      'G',
      'G#',
      'A',
      'B',
    ]);
  });

  it('returns the 8-note bebop dorian scale for C', () => {
    expect(getBebopScaleNotes('C', BebopScaleTypes.BebopDorian)).toEqual([
      'C',
      'D',
      'D#',
      'E',
      'F',
      'G',
      'A',
      'A#',
    ]);
  });
});

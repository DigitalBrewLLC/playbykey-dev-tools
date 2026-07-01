import { describe, it, expect } from 'vitest';
import { getModeAccidentals, Modes } from '../src';
import { ALTERATION } from './fixtures';

// getModeAccidentals compares a mode's semitone offsets against ionian [0,2,4,5,7,9,11]
// and returns only the degrees that differ. A degree is FLAT if the mode's offset is
// lower than ionian's, and SHARP if higher. Unchanged degrees are omitted from the result.
//
// Each test shows two example scales: C major (no accidentals) and A major (3 sharps: F# C# G#).
// Comment format: [mode offsets] → changed degrees with direction (ionian→mode)

describe('getModeAccidentals', () => {
  describe('no alterations — modes identical to ionian', () => {
    it('ionian [0,2,4,5,7,9,11] returns an empty object', () => {
      // C ionian: C  D  E  F  G  A  B
      // A ionian: A  B  C# D  E  F# G#
      expect(getModeAccidentals(Modes.Ionian)).toEqual({});
    });
  });

  describe('flat alterations — modes with one or more lowered degrees', () => {
    it('dorian [0,2,3,5,7,9,10] — degree 3: 4→3, degree 7: 11→10', () => {
      // C dorian: C  D  Eb F  G  A  Bb
      // B dorian: B  C# D  E  F# G# A
      expect(getModeAccidentals(Modes.Dorian)).toEqual({
        3: ALTERATION.FLAT,
        7: ALTERATION.FLAT,
      });
    });

    it('phrygian [0,1,3,5,7,8,10] — degrees 2, 3, 6, 7 all lowered', () => {
      // C phrygian: C  Db Eb F  G  Ab Bb
      // C# phrygian: C# D  E  F# G# A  B
      expect(getModeAccidentals(Modes.Phrygian)).toEqual({
        2: ALTERATION.FLAT,
        3: ALTERATION.FLAT,
        6: ALTERATION.FLAT,
        7: ALTERATION.FLAT,
      });
    });

    it('mixolydian [0,2,4,5,7,9,10] — degree 7: 11→10, the defining lowered 7th', () => {
      // C mixolydian: C  D  E  F  G  A  Bb
      // E mixolydian: E  F# G# A  B  C# D
      expect(getModeAccidentals(Modes.Mixolydian)).toEqual({
        7: ALTERATION.FLAT,
      });
    });

    it('aeolian [0,2,3,5,7,8,10] — degrees 3, 6, 7 all lowered', () => {
      // C aeolian: C  D  Eb F  G  Ab Bb
      // F# aeolian: F# G# A  B  C# D  E
      expect(getModeAccidentals(Modes.Aeolian)).toEqual({
        3: ALTERATION.FLAT,
        6: ALTERATION.FLAT,
        7: ALTERATION.FLAT,
      });
    });

    it('locrian [0,1,3,5,6,8,10] — degrees 2, 3, 5, 6, 7 all lowered', () => {
      // C locrian:  C  Db Eb F  Gb Ab Bb
      // G# locrian: G# A  B  C# D  E  F#
      expect(getModeAccidentals(Modes.Locrian)).toEqual({
        2: ALTERATION.FLAT,
        3: ALTERATION.FLAT,
        5: ALTERATION.FLAT,
        6: ALTERATION.FLAT,
        7: ALTERATION.FLAT,
      });
    });
  });

  describe('sharp alterations — modes with one or more raised degrees', () => {
    it('lydian [0,2,4,6,7,9,11] — degree 4: 5→6, the defining raised 4th', () => {
      // C lydian: C  D  E  F# G  A  B
      // D lydian: D  E  F# G# A  B  C#
      expect(getModeAccidentals(Modes.Lydian)).toEqual({
        4: ALTERATION.SHARP,
      });
    });
  });
});

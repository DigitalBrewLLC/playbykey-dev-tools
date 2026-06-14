import { describe, it, expect } from 'vitest';
import { getScaleDegree, MODE_IDS } from '../src';
import type { Note, ModeName } from '../src';

// Strategy:
//   - Sweep all 12 keys using ionian (the unaltered reference mode) to verify degree
//     assignment across every transposition. 84 cases: 12 keys × 7 degrees each.
//   - Sweep all 7 modes using C as the fixed root to verify that mode alterations
//     shift degrees correctly. 49 cases: 6 remaining modes × 7 degrees each.
//     (C ionian is already fully covered in the key sweep above.)
//   - Verify out-of-scale notes return null in C ionian.

// All 12 keys in ionian — every in-scale note mapped to its degree (84 cases)
const IONIAN_DEGREES: Array<{ root: Note; note: Note; degree: number }> = [
  { root: 'C', note: 'C', degree: 1 },
  { root: 'C', note: 'D', degree: 2 },
  { root: 'C', note: 'E', degree: 3 },
  { root: 'C', note: 'F', degree: 4 },
  { root: 'C', note: 'G', degree: 5 },
  { root: 'C', note: 'A', degree: 6 },
  { root: 'C', note: 'B', degree: 7 },

  { root: 'C#', note: 'C#', degree: 1 },
  { root: 'C#', note: 'D#', degree: 2 },
  { root: 'C#', note: 'F', degree: 3 },
  { root: 'C#', note: 'F#', degree: 4 },
  { root: 'C#', note: 'G#', degree: 5 },
  { root: 'C#', note: 'A#', degree: 6 },
  { root: 'C#', note: 'C', degree: 7 },

  { root: 'D', note: 'D', degree: 1 },
  { root: 'D', note: 'E', degree: 2 },
  { root: 'D', note: 'F#', degree: 3 },
  { root: 'D', note: 'G', degree: 4 },
  { root: 'D', note: 'A', degree: 5 },
  { root: 'D', note: 'B', degree: 6 },
  { root: 'D', note: 'C#', degree: 7 },

  { root: 'D#', note: 'D#', degree: 1 },
  { root: 'D#', note: 'F', degree: 2 },
  { root: 'D#', note: 'G', degree: 3 },
  { root: 'D#', note: 'G#', degree: 4 },
  { root: 'D#', note: 'A#', degree: 5 },
  { root: 'D#', note: 'C', degree: 6 },
  { root: 'D#', note: 'D', degree: 7 },

  { root: 'E', note: 'E', degree: 1 },
  { root: 'E', note: 'F#', degree: 2 },
  { root: 'E', note: 'G#', degree: 3 },
  { root: 'E', note: 'A', degree: 4 },
  { root: 'E', note: 'B', degree: 5 },
  { root: 'E', note: 'C#', degree: 6 },
  { root: 'E', note: 'D#', degree: 7 },

  { root: 'F', note: 'F', degree: 1 },
  { root: 'F', note: 'G', degree: 2 },
  { root: 'F', note: 'A', degree: 3 },
  { root: 'F', note: 'A#', degree: 4 },
  { root: 'F', note: 'C', degree: 5 },
  { root: 'F', note: 'D', degree: 6 },
  { root: 'F', note: 'E', degree: 7 },

  { root: 'F#', note: 'F#', degree: 1 },
  { root: 'F#', note: 'G#', degree: 2 },
  { root: 'F#', note: 'A#', degree: 3 },
  { root: 'F#', note: 'B', degree: 4 },
  { root: 'F#', note: 'C#', degree: 5 },
  { root: 'F#', note: 'D#', degree: 6 },
  { root: 'F#', note: 'F', degree: 7 },

  { root: 'G', note: 'G', degree: 1 },
  { root: 'G', note: 'A', degree: 2 },
  { root: 'G', note: 'B', degree: 3 },
  { root: 'G', note: 'C', degree: 4 },
  { root: 'G', note: 'D', degree: 5 },
  { root: 'G', note: 'E', degree: 6 },
  { root: 'G', note: 'F#', degree: 7 },

  { root: 'G#', note: 'G#', degree: 1 },
  { root: 'G#', note: 'A#', degree: 2 },
  { root: 'G#', note: 'C', degree: 3 },
  { root: 'G#', note: 'C#', degree: 4 },
  { root: 'G#', note: 'D#', degree: 5 },
  { root: 'G#', note: 'F', degree: 6 },
  { root: 'G#', note: 'G', degree: 7 },

  { root: 'A', note: 'A', degree: 1 },
  { root: 'A', note: 'B', degree: 2 },
  { root: 'A', note: 'C#', degree: 3 },
  { root: 'A', note: 'D', degree: 4 },
  { root: 'A', note: 'E', degree: 5 },
  { root: 'A', note: 'F#', degree: 6 },
  { root: 'A', note: 'G#', degree: 7 },

  { root: 'A#', note: 'A#', degree: 1 },
  { root: 'A#', note: 'C', degree: 2 },
  { root: 'A#', note: 'D', degree: 3 },
  { root: 'A#', note: 'D#', degree: 4 },
  { root: 'A#', note: 'F', degree: 5 },
  { root: 'A#', note: 'G', degree: 6 },
  { root: 'A#', note: 'A', degree: 7 },

  { root: 'B', note: 'B', degree: 1 },
  { root: 'B', note: 'C#', degree: 2 },
  { root: 'B', note: 'D#', degree: 3 },
  { root: 'B', note: 'E', degree: 4 },
  { root: 'B', note: 'F#', degree: 5 },
  { root: 'B', note: 'G#', degree: 6 },
  { root: 'B', note: 'A#', degree: 7 },
];

// All 7 modes from C — every in-scale note mapped to its degree (49 cases)
// Ionian is intentionally excluded: it is already fully exercised in IONIAN_DEGREES above.
const C_MODE_DEGREES: Array<{ mode: ModeName; note: Note; degree: number }> = [
  { mode: MODE_IDS.DORIAN, note: 'C', degree: 1 },
  { mode: MODE_IDS.DORIAN, note: 'D', degree: 2 },
  { mode: MODE_IDS.DORIAN, note: 'D#', degree: 3 },
  { mode: MODE_IDS.DORIAN, note: 'F', degree: 4 },
  { mode: MODE_IDS.DORIAN, note: 'G', degree: 5 },
  { mode: MODE_IDS.DORIAN, note: 'A', degree: 6 },
  { mode: MODE_IDS.DORIAN, note: 'A#', degree: 7 },

  { mode: MODE_IDS.PHRYGIAN, note: 'C', degree: 1 },
  { mode: MODE_IDS.PHRYGIAN, note: 'C#', degree: 2 },
  { mode: MODE_IDS.PHRYGIAN, note: 'D#', degree: 3 },
  { mode: MODE_IDS.PHRYGIAN, note: 'F', degree: 4 },
  { mode: MODE_IDS.PHRYGIAN, note: 'G', degree: 5 },
  { mode: MODE_IDS.PHRYGIAN, note: 'G#', degree: 6 },
  { mode: MODE_IDS.PHRYGIAN, note: 'A#', degree: 7 },

  { mode: MODE_IDS.LYDIAN, note: 'C', degree: 1 },
  { mode: MODE_IDS.LYDIAN, note: 'D', degree: 2 },
  { mode: MODE_IDS.LYDIAN, note: 'E', degree: 3 },
  { mode: MODE_IDS.LYDIAN, note: 'F#', degree: 4 },
  { mode: MODE_IDS.LYDIAN, note: 'G', degree: 5 },
  { mode: MODE_IDS.LYDIAN, note: 'A', degree: 6 },
  { mode: MODE_IDS.LYDIAN, note: 'B', degree: 7 },

  { mode: MODE_IDS.MIXOLYDIAN, note: 'C', degree: 1 },
  { mode: MODE_IDS.MIXOLYDIAN, note: 'D', degree: 2 },
  { mode: MODE_IDS.MIXOLYDIAN, note: 'E', degree: 3 },
  { mode: MODE_IDS.MIXOLYDIAN, note: 'F', degree: 4 },
  { mode: MODE_IDS.MIXOLYDIAN, note: 'G', degree: 5 },
  { mode: MODE_IDS.MIXOLYDIAN, note: 'A', degree: 6 },
  { mode: MODE_IDS.MIXOLYDIAN, note: 'A#', degree: 7 },

  { mode: MODE_IDS.AEOLIAN, note: 'C', degree: 1 },
  { mode: MODE_IDS.AEOLIAN, note: 'D', degree: 2 },
  { mode: MODE_IDS.AEOLIAN, note: 'D#', degree: 3 },
  { mode: MODE_IDS.AEOLIAN, note: 'F', degree: 4 },
  { mode: MODE_IDS.AEOLIAN, note: 'G', degree: 5 },
  { mode: MODE_IDS.AEOLIAN, note: 'G#', degree: 6 },
  { mode: MODE_IDS.AEOLIAN, note: 'A#', degree: 7 },

  { mode: MODE_IDS.LOCRIAN, note: 'C', degree: 1 },
  { mode: MODE_IDS.LOCRIAN, note: 'C#', degree: 2 },
  { mode: MODE_IDS.LOCRIAN, note: 'D#', degree: 3 },
  { mode: MODE_IDS.LOCRIAN, note: 'F', degree: 4 },
  { mode: MODE_IDS.LOCRIAN, note: 'F#', degree: 5 },
  { mode: MODE_IDS.LOCRIAN, note: 'G#', degree: 6 },
  { mode: MODE_IDS.LOCRIAN, note: 'A#', degree: 7 },
];

// The 5 chromatic notes absent from C ionian (W W H W W W H pattern leaves these out)
const C_IONIAN_OUT_OF_SCALE: Note[] = ['C#', 'D#', 'F#', 'G#', 'A#'];

describe('getScaleDegree', () => {
  describe('all 12 keys in ionian — every scale degree (84 cases)', () => {
    it.each(IONIAN_DEGREES)(
      '$root ionian: $note → degree $degree',
      ({ root, note, degree }) => {
        expect(getScaleDegree(root, MODE_IDS.IONIAN, note)).toBe(degree);
      }
    );
  });

  describe('all 7 modes from C root — every scale degree (49 cases)', () => {
    it.each(C_MODE_DEGREES)(
      'C $mode: $note → degree $degree',
      ({ mode, note, degree }) => {
        expect(getScaleDegree('C', mode, note)).toBe(degree);
      }
    );
  });

  describe('out-of-scale notes return null', () => {
    it.each(C_IONIAN_OUT_OF_SCALE.map((n) => ({ note: n })))(
      '$note is not in C ionian → null',
      ({ note }) => {
        expect(getScaleDegree('C', MODE_IDS.IONIAN, note)).toBeNull();
      }
    );
  });
});

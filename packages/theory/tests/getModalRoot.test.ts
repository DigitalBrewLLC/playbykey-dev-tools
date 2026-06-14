import { describe, it, expect } from 'vitest';
import { getModalRoot, MODE_IDS } from '../src';
import type { Note, ModeName } from '../src';

// getModalRoot(parentKey, mode) returns the note at position [mode.scaleDegree - 1]
// in the ionian scale built from parentKey. The parentKey is always treated as the
// Ionian (major) root — not the modal root.
//
// Example: getModalRoot('C', MODE_IDS.DORIAN) → 'D'
//   C ionian = [C, D, E, F, G, A, B]; dorian is scale degree 2 → index 1 → D
//
// All 84 cases below are derived from: getScaleNotes(parentKey, 'ionian')[scaleDegree - 1]

const ALL_MODAL_ROOTS: Array<{
  parentKey: Note;
  mode: ModeName;
  expected: Note;
}> = [
  { parentKey: 'C', mode: MODE_IDS.IONIAN, expected: 'C' },
  { parentKey: 'C', mode: MODE_IDS.DORIAN, expected: 'D' },
  { parentKey: 'C', mode: MODE_IDS.PHRYGIAN, expected: 'E' },
  { parentKey: 'C', mode: MODE_IDS.LYDIAN, expected: 'F' },
  { parentKey: 'C', mode: MODE_IDS.MIXOLYDIAN, expected: 'G' },
  { parentKey: 'C', mode: MODE_IDS.AEOLIAN, expected: 'A' },
  { parentKey: 'C', mode: MODE_IDS.LOCRIAN, expected: 'B' },

  { parentKey: 'C#', mode: MODE_IDS.IONIAN, expected: 'C#' },
  { parentKey: 'C#', mode: MODE_IDS.DORIAN, expected: 'D#' },
  { parentKey: 'C#', mode: MODE_IDS.PHRYGIAN, expected: 'F' },
  { parentKey: 'C#', mode: MODE_IDS.LYDIAN, expected: 'F#' },
  { parentKey: 'C#', mode: MODE_IDS.MIXOLYDIAN, expected: 'G#' },
  { parentKey: 'C#', mode: MODE_IDS.AEOLIAN, expected: 'A#' },
  { parentKey: 'C#', mode: MODE_IDS.LOCRIAN, expected: 'C' },

  { parentKey: 'D', mode: MODE_IDS.IONIAN, expected: 'D' },
  { parentKey: 'D', mode: MODE_IDS.DORIAN, expected: 'E' },
  { parentKey: 'D', mode: MODE_IDS.PHRYGIAN, expected: 'F#' },
  { parentKey: 'D', mode: MODE_IDS.LYDIAN, expected: 'G' },
  { parentKey: 'D', mode: MODE_IDS.MIXOLYDIAN, expected: 'A' },
  { parentKey: 'D', mode: MODE_IDS.AEOLIAN, expected: 'B' },
  { parentKey: 'D', mode: MODE_IDS.LOCRIAN, expected: 'C#' },

  { parentKey: 'D#', mode: MODE_IDS.IONIAN, expected: 'D#' },
  { parentKey: 'D#', mode: MODE_IDS.DORIAN, expected: 'F' },
  { parentKey: 'D#', mode: MODE_IDS.PHRYGIAN, expected: 'G' },
  { parentKey: 'D#', mode: MODE_IDS.LYDIAN, expected: 'G#' },
  { parentKey: 'D#', mode: MODE_IDS.MIXOLYDIAN, expected: 'A#' },
  { parentKey: 'D#', mode: MODE_IDS.AEOLIAN, expected: 'C' },
  { parentKey: 'D#', mode: MODE_IDS.LOCRIAN, expected: 'D' },

  { parentKey: 'E', mode: MODE_IDS.IONIAN, expected: 'E' },
  { parentKey: 'E', mode: MODE_IDS.DORIAN, expected: 'F#' },
  { parentKey: 'E', mode: MODE_IDS.PHRYGIAN, expected: 'G#' },
  { parentKey: 'E', mode: MODE_IDS.LYDIAN, expected: 'A' },
  { parentKey: 'E', mode: MODE_IDS.MIXOLYDIAN, expected: 'B' },
  { parentKey: 'E', mode: MODE_IDS.AEOLIAN, expected: 'C#' },
  { parentKey: 'E', mode: MODE_IDS.LOCRIAN, expected: 'D#' },

  { parentKey: 'F', mode: MODE_IDS.IONIAN, expected: 'F' },
  { parentKey: 'F', mode: MODE_IDS.DORIAN, expected: 'G' },
  { parentKey: 'F', mode: MODE_IDS.PHRYGIAN, expected: 'A' },
  { parentKey: 'F', mode: MODE_IDS.LYDIAN, expected: 'A#' },
  { parentKey: 'F', mode: MODE_IDS.MIXOLYDIAN, expected: 'C' },
  { parentKey: 'F', mode: MODE_IDS.AEOLIAN, expected: 'D' },
  { parentKey: 'F', mode: MODE_IDS.LOCRIAN, expected: 'E' },

  { parentKey: 'F#', mode: MODE_IDS.IONIAN, expected: 'F#' },
  { parentKey: 'F#', mode: MODE_IDS.DORIAN, expected: 'G#' },
  { parentKey: 'F#', mode: MODE_IDS.PHRYGIAN, expected: 'A#' },
  { parentKey: 'F#', mode: MODE_IDS.LYDIAN, expected: 'B' },
  { parentKey: 'F#', mode: MODE_IDS.MIXOLYDIAN, expected: 'C#' },
  { parentKey: 'F#', mode: MODE_IDS.AEOLIAN, expected: 'D#' },
  { parentKey: 'F#', mode: MODE_IDS.LOCRIAN, expected: 'F' },

  { parentKey: 'G', mode: MODE_IDS.IONIAN, expected: 'G' },
  { parentKey: 'G', mode: MODE_IDS.DORIAN, expected: 'A' },
  { parentKey: 'G', mode: MODE_IDS.PHRYGIAN, expected: 'B' },
  { parentKey: 'G', mode: MODE_IDS.LYDIAN, expected: 'C' },
  { parentKey: 'G', mode: MODE_IDS.MIXOLYDIAN, expected: 'D' },
  { parentKey: 'G', mode: MODE_IDS.AEOLIAN, expected: 'E' },
  { parentKey: 'G', mode: MODE_IDS.LOCRIAN, expected: 'F#' },

  { parentKey: 'G#', mode: MODE_IDS.IONIAN, expected: 'G#' },
  { parentKey: 'G#', mode: MODE_IDS.DORIAN, expected: 'A#' },
  { parentKey: 'G#', mode: MODE_IDS.PHRYGIAN, expected: 'C' },
  { parentKey: 'G#', mode: MODE_IDS.LYDIAN, expected: 'C#' },
  { parentKey: 'G#', mode: MODE_IDS.MIXOLYDIAN, expected: 'D#' },
  { parentKey: 'G#', mode: MODE_IDS.AEOLIAN, expected: 'F' },
  { parentKey: 'G#', mode: MODE_IDS.LOCRIAN, expected: 'G' },

  { parentKey: 'A', mode: MODE_IDS.IONIAN, expected: 'A' },
  { parentKey: 'A', mode: MODE_IDS.DORIAN, expected: 'B' },
  { parentKey: 'A', mode: MODE_IDS.PHRYGIAN, expected: 'C#' },
  { parentKey: 'A', mode: MODE_IDS.LYDIAN, expected: 'D' },
  { parentKey: 'A', mode: MODE_IDS.MIXOLYDIAN, expected: 'E' },
  { parentKey: 'A', mode: MODE_IDS.AEOLIAN, expected: 'F#' },
  { parentKey: 'A', mode: MODE_IDS.LOCRIAN, expected: 'G#' },

  { parentKey: 'A#', mode: MODE_IDS.IONIAN, expected: 'A#' },
  { parentKey: 'A#', mode: MODE_IDS.DORIAN, expected: 'C' },
  { parentKey: 'A#', mode: MODE_IDS.PHRYGIAN, expected: 'D' },
  { parentKey: 'A#', mode: MODE_IDS.LYDIAN, expected: 'D#' },
  { parentKey: 'A#', mode: MODE_IDS.MIXOLYDIAN, expected: 'F' },
  { parentKey: 'A#', mode: MODE_IDS.AEOLIAN, expected: 'G' },
  { parentKey: 'A#', mode: MODE_IDS.LOCRIAN, expected: 'A' },

  { parentKey: 'B', mode: MODE_IDS.IONIAN, expected: 'B' },
  { parentKey: 'B', mode: MODE_IDS.DORIAN, expected: 'C#' },
  { parentKey: 'B', mode: MODE_IDS.PHRYGIAN, expected: 'D#' },
  { parentKey: 'B', mode: MODE_IDS.LYDIAN, expected: 'E' },
  { parentKey: 'B', mode: MODE_IDS.MIXOLYDIAN, expected: 'F#' },
  { parentKey: 'B', mode: MODE_IDS.AEOLIAN, expected: 'G#' },
  { parentKey: 'B', mode: MODE_IDS.LOCRIAN, expected: 'A#' },
];

describe('getModalRoot', () => {
  describe('all 12 parent keys × 7 modes (84 cases)', () => {
    it.each(ALL_MODAL_ROOTS)(
      '$parentKey + $mode → $expected',
      ({ parentKey, mode, expected }) => {
        expect(getModalRoot(parentKey, mode)).toBe(expected);
      }
    );
  });
});

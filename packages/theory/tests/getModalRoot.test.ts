import { describe, it, expect } from 'vitest';
import { getModalRoot, Modes } from '../src';
import type { Note, ModeName } from '../src';

// getModalRoot(parentKey, mode) returns the note at position [mode.scaleDegree - 1]
// in the ionian scale built from parentKey. The parentKey is always treated as the
// Ionian (major) root - not the modal root.
//
// Example: getModalRoot('C', Modes.Dorian) → 'D'
//   C ionian = [C, D, E, F, G, A, B]; dorian is scale degree 2 → index 1 → D
//
// All 84 cases below are derived from: getModeNotes(parentKey, 'ionian')[scaleDegree - 1]

const ALL_MODAL_ROOTS: Array<{
  parentKey: Note;
  mode: ModeName;
  expected: Note;
}> = [
  { parentKey: 'C', mode: Modes.Ionian, expected: 'C' },
  { parentKey: 'C', mode: Modes.Dorian, expected: 'D' },
  { parentKey: 'C', mode: Modes.Phrygian, expected: 'E' },
  { parentKey: 'C', mode: Modes.Lydian, expected: 'F' },
  { parentKey: 'C', mode: Modes.Mixolydian, expected: 'G' },
  { parentKey: 'C', mode: Modes.Aeolian, expected: 'A' },
  { parentKey: 'C', mode: Modes.Locrian, expected: 'B' },

  { parentKey: 'C#', mode: Modes.Ionian, expected: 'C#' },
  { parentKey: 'C#', mode: Modes.Dorian, expected: 'D#' },
  { parentKey: 'C#', mode: Modes.Phrygian, expected: 'F' },
  { parentKey: 'C#', mode: Modes.Lydian, expected: 'F#' },
  { parentKey: 'C#', mode: Modes.Mixolydian, expected: 'G#' },
  { parentKey: 'C#', mode: Modes.Aeolian, expected: 'A#' },
  { parentKey: 'C#', mode: Modes.Locrian, expected: 'C' },

  { parentKey: 'D', mode: Modes.Ionian, expected: 'D' },
  { parentKey: 'D', mode: Modes.Dorian, expected: 'E' },
  { parentKey: 'D', mode: Modes.Phrygian, expected: 'F#' },
  { parentKey: 'D', mode: Modes.Lydian, expected: 'G' },
  { parentKey: 'D', mode: Modes.Mixolydian, expected: 'A' },
  { parentKey: 'D', mode: Modes.Aeolian, expected: 'B' },
  { parentKey: 'D', mode: Modes.Locrian, expected: 'C#' },

  { parentKey: 'D#', mode: Modes.Ionian, expected: 'D#' },
  { parentKey: 'D#', mode: Modes.Dorian, expected: 'F' },
  { parentKey: 'D#', mode: Modes.Phrygian, expected: 'G' },
  { parentKey: 'D#', mode: Modes.Lydian, expected: 'G#' },
  { parentKey: 'D#', mode: Modes.Mixolydian, expected: 'A#' },
  { parentKey: 'D#', mode: Modes.Aeolian, expected: 'C' },
  { parentKey: 'D#', mode: Modes.Locrian, expected: 'D' },

  { parentKey: 'E', mode: Modes.Ionian, expected: 'E' },
  { parentKey: 'E', mode: Modes.Dorian, expected: 'F#' },
  { parentKey: 'E', mode: Modes.Phrygian, expected: 'G#' },
  { parentKey: 'E', mode: Modes.Lydian, expected: 'A' },
  { parentKey: 'E', mode: Modes.Mixolydian, expected: 'B' },
  { parentKey: 'E', mode: Modes.Aeolian, expected: 'C#' },
  { parentKey: 'E', mode: Modes.Locrian, expected: 'D#' },

  { parentKey: 'F', mode: Modes.Ionian, expected: 'F' },
  { parentKey: 'F', mode: Modes.Dorian, expected: 'G' },
  { parentKey: 'F', mode: Modes.Phrygian, expected: 'A' },
  { parentKey: 'F', mode: Modes.Lydian, expected: 'A#' },
  { parentKey: 'F', mode: Modes.Mixolydian, expected: 'C' },
  { parentKey: 'F', mode: Modes.Aeolian, expected: 'D' },
  { parentKey: 'F', mode: Modes.Locrian, expected: 'E' },

  { parentKey: 'F#', mode: Modes.Ionian, expected: 'F#' },
  { parentKey: 'F#', mode: Modes.Dorian, expected: 'G#' },
  { parentKey: 'F#', mode: Modes.Phrygian, expected: 'A#' },
  { parentKey: 'F#', mode: Modes.Lydian, expected: 'B' },
  { parentKey: 'F#', mode: Modes.Mixolydian, expected: 'C#' },
  { parentKey: 'F#', mode: Modes.Aeolian, expected: 'D#' },
  { parentKey: 'F#', mode: Modes.Locrian, expected: 'F' },

  { parentKey: 'G', mode: Modes.Ionian, expected: 'G' },
  { parentKey: 'G', mode: Modes.Dorian, expected: 'A' },
  { parentKey: 'G', mode: Modes.Phrygian, expected: 'B' },
  { parentKey: 'G', mode: Modes.Lydian, expected: 'C' },
  { parentKey: 'G', mode: Modes.Mixolydian, expected: 'D' },
  { parentKey: 'G', mode: Modes.Aeolian, expected: 'E' },
  { parentKey: 'G', mode: Modes.Locrian, expected: 'F#' },

  { parentKey: 'G#', mode: Modes.Ionian, expected: 'G#' },
  { parentKey: 'G#', mode: Modes.Dorian, expected: 'A#' },
  { parentKey: 'G#', mode: Modes.Phrygian, expected: 'C' },
  { parentKey: 'G#', mode: Modes.Lydian, expected: 'C#' },
  { parentKey: 'G#', mode: Modes.Mixolydian, expected: 'D#' },
  { parentKey: 'G#', mode: Modes.Aeolian, expected: 'F' },
  { parentKey: 'G#', mode: Modes.Locrian, expected: 'G' },

  { parentKey: 'A', mode: Modes.Ionian, expected: 'A' },
  { parentKey: 'A', mode: Modes.Dorian, expected: 'B' },
  { parentKey: 'A', mode: Modes.Phrygian, expected: 'C#' },
  { parentKey: 'A', mode: Modes.Lydian, expected: 'D' },
  { parentKey: 'A', mode: Modes.Mixolydian, expected: 'E' },
  { parentKey: 'A', mode: Modes.Aeolian, expected: 'F#' },
  { parentKey: 'A', mode: Modes.Locrian, expected: 'G#' },

  { parentKey: 'A#', mode: Modes.Ionian, expected: 'A#' },
  { parentKey: 'A#', mode: Modes.Dorian, expected: 'C' },
  { parentKey: 'A#', mode: Modes.Phrygian, expected: 'D' },
  { parentKey: 'A#', mode: Modes.Lydian, expected: 'D#' },
  { parentKey: 'A#', mode: Modes.Mixolydian, expected: 'F' },
  { parentKey: 'A#', mode: Modes.Aeolian, expected: 'G' },
  { parentKey: 'A#', mode: Modes.Locrian, expected: 'A' },

  { parentKey: 'B', mode: Modes.Ionian, expected: 'B' },
  { parentKey: 'B', mode: Modes.Dorian, expected: 'C#' },
  { parentKey: 'B', mode: Modes.Phrygian, expected: 'D#' },
  { parentKey: 'B', mode: Modes.Lydian, expected: 'E' },
  { parentKey: 'B', mode: Modes.Mixolydian, expected: 'F#' },
  { parentKey: 'B', mode: Modes.Aeolian, expected: 'G#' },
  { parentKey: 'B', mode: Modes.Locrian, expected: 'A#' },
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

import { describe, it, expect } from 'vitest';
import { getRelativeMajorKey } from '../src';
import type { Note } from '../src';

// The relative major of a minor key is 3 semitones above the minor root.
// Both keys share the same 7 notes - only the tonal center differs.
// Example: A minor and C major share C D E F G A B.
//
// This is the inverse of getRelativeMinorKey: minor + 3 = major, major + 9 = minor,
// and 3 + 9 = 12 = one full octave (identity).

// All 12 minor keys mapped to their relative major (minor root + 3 semitones)
const ALL_CASES: Array<{ minorKey: Note; relativeMajor: Note }> = [
  { minorKey: 'C', relativeMajor: 'D#' },
  { minorKey: 'C#', relativeMajor: 'E' },
  { minorKey: 'D', relativeMajor: 'F' },
  { minorKey: 'D#', relativeMajor: 'F#' },
  { minorKey: 'E', relativeMajor: 'G' },
  { minorKey: 'F', relativeMajor: 'G#' },
  { minorKey: 'F#', relativeMajor: 'A' },
  { minorKey: 'G', relativeMajor: 'A#' },
  { minorKey: 'G#', relativeMajor: 'B' },
  { minorKey: 'A', relativeMajor: 'C' },
  { minorKey: 'A#', relativeMajor: 'C#' },
  { minorKey: 'B', relativeMajor: 'D' },
];

describe('getRelativeMajorKey', () => {
  describe('all 12 minor keys', () => {
    it.each(ALL_CASES)(
      '$minorKey minor → $relativeMajor major',
      ({ minorKey, relativeMajor }) => {
        expect(getRelativeMajorKey(minorKey)).toBe(relativeMajor);
      }
    );
  });

  // getRelativeMajorKey (+3) and getRelativeMinorKey (+9) are inverses.
  // Applying getRelativeMajorKey to the output of getRelativeMinorKey returns the original key.
  it('applying getRelativeMinorKey to the result returns the original minor key', () => {
    expect(getRelativeMajorKey('A')).toBe('C'); // C-9=A (i.e. getRelativeMinorKey('C')='A')
    expect(getRelativeMajorKey('E')).toBe('G'); // G-9=E (i.e. getRelativeMinorKey('G')='E')
    expect(getRelativeMajorKey('D#')).toBe('F#'); // F#-9=D# (i.e. getRelativeMinorKey('F#')='D#')
  });
});

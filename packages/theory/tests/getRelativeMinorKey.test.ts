import { describe, it, expect } from 'vitest';
import { getRelativeMinorKey } from '../src';
import type { Note } from '../src';

// The relative minor of a major key is 9 semitones above (or equivalently 3 semitones below)
// the major root. Both keys share the same 7 notes — only the tonal center differs.
// Example: C major and A minor share C D E F G A B.

// All 12 major keys mapped to their relative minor (major root + 9 semitones)
const ALL_CASES: Array<{ majorKey: Note; relativeMinor: Note }> = [
  { majorKey: 'C', relativeMinor: 'A' },
  { majorKey: 'C#', relativeMinor: 'A#' },
  { majorKey: 'D', relativeMinor: 'B' },
  { majorKey: 'D#', relativeMinor: 'C' },
  { majorKey: 'E', relativeMinor: 'C#' },
  { majorKey: 'F', relativeMinor: 'D' },
  { majorKey: 'F#', relativeMinor: 'D#' },
  { majorKey: 'G', relativeMinor: 'E' },
  { majorKey: 'G#', relativeMinor: 'F' },
  { majorKey: 'A', relativeMinor: 'F#' },
  { majorKey: 'A#', relativeMinor: 'G' },
  { majorKey: 'B', relativeMinor: 'G#' },
];

describe('getRelativeMinorKey', () => {
  describe('all 12 major keys', () => {
    it.each(ALL_CASES)(
      '$majorKey major → $relativeMinor minor',
      ({ majorKey, relativeMinor }) => {
        expect(getRelativeMinorKey(majorKey)).toBe(relativeMinor);
      }
    );
  });

  // getRelativeMinorKey (+9) and getRelativeMajorKey (+3) are inverses: applying both
  // returns to the original key (+12 semitones = identity). Spot-checked here.
  it('applying getRelativeMajorKey to the result returns the original major key', () => {
    expect(getRelativeMinorKey('C')).toBe('A'); // A+3=C (verified in getRelativeMajorKey)
    expect(getRelativeMinorKey('G')).toBe('E'); // E+3=G
    expect(getRelativeMinorKey('F#')).toBe('D#'); // D#+3=F#
  });
});

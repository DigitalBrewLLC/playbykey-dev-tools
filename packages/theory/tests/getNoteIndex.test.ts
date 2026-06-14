import { describe, it, expect } from 'vitest';
import { getNoteIndex } from '../src';
import type { Note } from '../src';

// Maps every chromatic note to its position in the 0-11 index space (C=0 ... B=11)
const CHROMATIC_INDEX_MAP: Array<{ note: Note; index: number }> = [
  { note: 'C', index: 0 },
  { note: 'C#', index: 1 },
  { note: 'D', index: 2 },
  { note: 'D#', index: 3 },
  { note: 'E', index: 4 },
  { note: 'F', index: 5 },
  { note: 'F#', index: 6 },
  { note: 'G', index: 7 },
  { note: 'G#', index: 8 },
  { note: 'A', index: 9 },
  { note: 'A#', index: 10 },
  { note: 'B', index: 11 },
];

describe('getNoteIndex', () => {
  it.each(CHROMATIC_INDEX_MAP)(
    '$note has chromatic index $index',
    ({ note, index }) => {
      expect(getNoteIndex(note)).toBe(index);
    }
  );
});

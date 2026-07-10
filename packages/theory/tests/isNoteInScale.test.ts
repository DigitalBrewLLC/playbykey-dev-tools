import { describe, it, expect } from 'vitest';
import { isNoteInScale, ScaleTypes } from '../src';
import type { Note } from '../src';
import { ALL_NOTES } from './fixtures';

// Known in-scale notes for each of the 12 major keys
const MAJOR_IN_SCALE: Array<{ root: Note; inScale: Note[] }> = [
  { root: 'C', inScale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  { root: 'C#', inScale: ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'C'] },
  { root: 'D', inScale: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] },
  { root: 'D#', inScale: ['D#', 'F', 'G', 'G#', 'A#', 'C', 'D'] },
  { root: 'E', inScale: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'] },
  { root: 'F', inScale: ['F', 'G', 'A', 'A#', 'C', 'D', 'E'] },
  { root: 'F#', inScale: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F'] },
  { root: 'G', inScale: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'] },
  { root: 'G#', inScale: ['G#', 'A#', 'C', 'C#', 'D#', 'F', 'G'] },
  { root: 'A', inScale: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'] },
  { root: 'A#', inScale: ['A#', 'C', 'D', 'D#', 'F', 'G', 'A'] },
  { root: 'B', inScale: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'] },
];

describe('isNoteInScale - all 12 major keys', () => {
  it.each(MAJOR_IN_SCALE)('$root major', ({ root, inScale }) => {
    const outOfScale = ALL_NOTES.filter((n) => !inScale.includes(n));
    for (const note of inScale) {
      expect(isNoteInScale(root, ScaleTypes.Major, note)).toBe(true);
    }
    for (const note of outOfScale) {
      expect(isNoteInScale(root, ScaleTypes.Major, note)).toBe(false);
    }
  });
});

describe('isNoteInScale - pentatonic major (C D E G A)', () => {
  const inScale: Note[] = ['C', 'D', 'E', 'G', 'A'];
  const outOfScale = ALL_NOTES.filter((n) => !inScale.includes(n));

  it.each(inScale.map((n) => ({ note: n })))(
    '$note in C pentatonic-major → true',
    ({ note }) => {
      expect(isNoteInScale('C', ScaleTypes.PentatonicMajor, note)).toBe(true);
    }
  );

  it.each(outOfScale.map((n) => ({ note: n })))(
    '$note not in C pentatonic-major → false',
    ({ note }) => {
      expect(isNoteInScale('C', ScaleTypes.PentatonicMajor, note)).toBe(false);
    }
  );
});

describe('isNoteInScale - pentatonic minor (C D# F G A#)', () => {
  const inScale: Note[] = ['C', 'D#', 'F', 'G', 'A#'];
  const outOfScale = ALL_NOTES.filter((n) => !inScale.includes(n));

  it.each(inScale.map((n) => ({ note: n })))(
    '$note in C pentatonic-minor → true',
    ({ note }) => {
      expect(isNoteInScale('C', ScaleTypes.PentatonicMinor, note)).toBe(true);
    }
  );

  it.each(outOfScale.map((n) => ({ note: n })))(
    '$note not in C pentatonic-minor → false',
    ({ note }) => {
      expect(isNoteInScale('C', ScaleTypes.PentatonicMinor, note)).toBe(false);
    }
  );
});

describe('isNoteInScale - blues (C D# F F# G A#)', () => {
  const inScale: Note[] = ['C', 'D#', 'F', 'F#', 'G', 'A#'];
  const outOfScale = ALL_NOTES.filter((n) => !inScale.includes(n));

  it.each(inScale.map((n) => ({ note: n })))(
    '$note in C blues → true',
    ({ note }) => {
      expect(isNoteInScale('C', ScaleTypes.Blues, note)).toBe(true);
    }
  );

  it.each(outOfScale.map((n) => ({ note: n })))(
    '$note not in C blues → false',
    ({ note }) => {
      expect(isNoteInScale('C', ScaleTypes.Blues, note)).toBe(false);
    }
  );
});

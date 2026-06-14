import { describe, it, expect } from 'vitest';
import { getCircleOfFifthsOrder } from '../src';
import type { Note } from '../src';

// The circle of fifths orders all 12 keys by ascending perfect fifths (+7 semitones each step).
// Starting from C, each move clockwise adds one sharp to the key signature.
// The sequence wraps back to C after 12 steps (7×12 = 84 semitones = 7 octaves = identity mod 12).

const EXPECTED_ORDER: Note[] = [
  'C',
  'G',
  'D',
  'A',
  'E',
  'B',
  'F#',
  'C#',
  'G#',
  'D#',
  'A#',
  'F',
];

const CHROMATIC_NOTES: Note[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

describe('getCircleOfFifthsOrder', () => {
  it('returns the full circle of fifths in correct order', () => {
    expect(getCircleOfFifthsOrder()).toEqual(EXPECTED_ORDER);
  });

  it('contains exactly 12 notes with no duplicates', () => {
    const order = getCircleOfFifthsOrder();
    expect(order).toHaveLength(12);
    expect(new Set<Note>(order as Note[]).size).toBe(12);
  });

  it('each consecutive step is exactly 7 semitones (a perfect fifth)', () => {
    const order = getCircleOfFifthsOrder() as Note[];
    for (let i = 0; i < order.length - 1; i++) {
      const current = order[i];
      const next = order[i + 1];
      if (current !== undefined && next !== undefined) {
        const from = CHROMATIC_NOTES.indexOf(current);
        const to = CHROMATIC_NOTES.indexOf(next);
        expect((to - from + 12) % 12).toBe(7);
      }
    }
  });
});

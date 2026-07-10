import { describe, it, expect } from 'vitest';
import { getScaleDegree, ScaleTypes } from '../src';
import type { Note } from '../src';

// Degree is the 1-based position of a note in the ordered note array returned
// by getScaleNotes for the given root + scaleType. Absent notes return null.

describe('getScaleDegree - major scale (12 roots, 7 degrees each = 84 cases)', () => {
  const MAJOR_DEGREES: Array<{ root: Note; note: Note; degree: number }> = [
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

  it.each(MAJOR_DEGREES)(
    '$root major: $note → degree $degree',
    ({ root, note, degree }) => {
      expect(getScaleDegree(root, ScaleTypes.Major, note)).toBe(degree);
    }
  );
});

describe('getScaleDegree - out-of-scale returns null', () => {
  it.each(['C#', 'D#', 'F#', 'G#', 'A#'].map((n) => ({ note: n as Note })))(
    '$note is not in C major → null',
    ({ note }) => {
      expect(getScaleDegree('C', ScaleTypes.Major, note)).toBeNull();
    }
  );
});

describe('getScaleDegree - pentatonic major (C D E G A)', () => {
  it('C → 1', () =>
    expect(getScaleDegree('C', ScaleTypes.PentatonicMajor, 'C')).toBe(1));
  it('D → 2', () =>
    expect(getScaleDegree('C', ScaleTypes.PentatonicMajor, 'D')).toBe(2));
  it('E → 3', () =>
    expect(getScaleDegree('C', ScaleTypes.PentatonicMajor, 'E')).toBe(3));
  it('G → 4', () =>
    expect(getScaleDegree('C', ScaleTypes.PentatonicMajor, 'G')).toBe(4));
  it('A → 5', () =>
    expect(getScaleDegree('C', ScaleTypes.PentatonicMajor, 'A')).toBe(5));
  it('F is absent → null', () =>
    expect(getScaleDegree('C', ScaleTypes.PentatonicMajor, 'F')).toBeNull());
  it('B is absent → null', () =>
    expect(getScaleDegree('C', ScaleTypes.PentatonicMajor, 'B')).toBeNull());
});

describe('getScaleDegree - pentatonic minor (C D# F G A#)', () => {
  it('C → 1', () =>
    expect(getScaleDegree('C', ScaleTypes.PentatonicMinor, 'C')).toBe(1));
  it('D# → 2', () =>
    expect(getScaleDegree('C', ScaleTypes.PentatonicMinor, 'D#')).toBe(2));
  it('F → 3', () =>
    expect(getScaleDegree('C', ScaleTypes.PentatonicMinor, 'F')).toBe(3));
  it('G → 4', () =>
    expect(getScaleDegree('C', ScaleTypes.PentatonicMinor, 'G')).toBe(4));
  it('A# → 5', () =>
    expect(getScaleDegree('C', ScaleTypes.PentatonicMinor, 'A#')).toBe(5));
  it('D is absent → null', () =>
    expect(getScaleDegree('C', ScaleTypes.PentatonicMinor, 'D')).toBeNull());
});

describe('getScaleDegree - blues (C D# F F# G A#)', () => {
  it('C → 1', () => expect(getScaleDegree('C', ScaleTypes.Blues, 'C')).toBe(1));
  it('D# → 2', () =>
    expect(getScaleDegree('C', ScaleTypes.Blues, 'D#')).toBe(2));
  it('F → 3', () => expect(getScaleDegree('C', ScaleTypes.Blues, 'F')).toBe(3));
  it('F# → 4', () =>
    expect(getScaleDegree('C', ScaleTypes.Blues, 'F#')).toBe(4));
  it('G → 5', () => expect(getScaleDegree('C', ScaleTypes.Blues, 'G')).toBe(5));
  it('A# → 6', () =>
    expect(getScaleDegree('C', ScaleTypes.Blues, 'A#')).toBe(6));
  it('D is absent → null', () =>
    expect(getScaleDegree('C', ScaleTypes.Blues, 'D')).toBeNull());
});

describe('getScaleDegree - harmonic minor (C D D# F G G# B)', () => {
  it('C → 1', () =>
    expect(getScaleDegree('C', ScaleTypes.HarmonicMinor, 'C')).toBe(1));
  it('D → 2', () =>
    expect(getScaleDegree('C', ScaleTypes.HarmonicMinor, 'D')).toBe(2));
  it('D# → 3', () =>
    expect(getScaleDegree('C', ScaleTypes.HarmonicMinor, 'D#')).toBe(3));
  it('F → 4', () =>
    expect(getScaleDegree('C', ScaleTypes.HarmonicMinor, 'F')).toBe(4));
  it('G → 5', () =>
    expect(getScaleDegree('C', ScaleTypes.HarmonicMinor, 'G')).toBe(5));
  it('G# → 6', () =>
    expect(getScaleDegree('C', ScaleTypes.HarmonicMinor, 'G#')).toBe(6));
  it('B → 7', () =>
    expect(getScaleDegree('C', ScaleTypes.HarmonicMinor, 'B')).toBe(7));
  it('A is absent → null', () =>
    expect(getScaleDegree('C', ScaleTypes.HarmonicMinor, 'A')).toBeNull());
});

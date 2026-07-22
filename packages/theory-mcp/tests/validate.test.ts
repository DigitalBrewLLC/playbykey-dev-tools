import { describe, it, expect } from 'vitest';
import { validateNote, validateNoteArray } from '../src/validate.js';

describe('validateNote - flat/sharp normalization', () => {
  const FLAT_TO_SHARP_PAIRS: ReadonlyArray<readonly [string, string]> = [
    ['Db', 'C#'],
    ['Eb', 'D#'],
    ['Gb', 'F#'],
    ['Ab', 'G#'],
    ['Bb', 'A#'],
  ];

  it.each(FLAT_TO_SHARP_PAIRS)(
    'normalizes %s to its canonical sharp equivalent %s',
    (flat, sharp) => {
      const result = validateNote(flat);
      expect(result).toEqual({ ok: true, value: sharp });
    }
  );

  it('leaves natural and sharp notes unchanged', () => {
    expect(validateNote('C')).toEqual({ ok: true, value: 'C' });
    expect(validateNote('F#')).toEqual({ ok: true, value: 'F#' });
  });

  it('normalizes flats case-insensitively', () => {
    expect(validateNote('db')).toEqual({ ok: true, value: 'C#' });
  });

  it('rejects an unrecognized note', () => {
    const result = validateNote('H');
    expect(result.ok).toBe(false);
  });
});

describe('validateNoteArray - flat/sharp normalization', () => {
  it('normalizes every flat-spelled note in an array', () => {
    const result = validateNoteArray(['Db', 'Eb', 'Gb', 'Ab', 'Bb']);
    expect(result).toEqual({
      ok: true,
      value: ['C#', 'D#', 'F#', 'G#', 'A#'],
    });
  });

  it('rejects the array if any single note is invalid', () => {
    const result = validateNoteArray(['C', 'H']);
    expect(result.ok).toBe(false);
  });
});

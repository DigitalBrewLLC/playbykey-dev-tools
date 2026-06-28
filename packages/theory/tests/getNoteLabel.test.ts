import { describe, it, expect } from 'vitest';
import { getNoteLabel, Modes, Notations } from '../src';
import type { Note } from '../src';
import { ALL_NOTES, ALL_MODES } from './fixtures';

// In letter notation, every note returns its own name regardless of key/mode
describe('getNoteLabel — letter notation', () => {
  describe('returns the note name for every chromatic note in C ionian', () => {
    it.each(ALL_NOTES.map((n) => ({ note: n })))(
      '$note → "$note"',
      ({ note }) => {
        expect(getNoteLabel(note, 'C', Modes.Ionian, Notations.Letter)).toBe(
          note
        );
      }
    );
  });

  describe('returns the note name regardless of the active key', () => {
    it('F# in G ionian → "F#"', () => {
      expect(getNoteLabel('F#', 'G', Modes.Ionian, Notations.Letter)).toBe(
        'F#'
      );
    });

    it('A# in D# dorian → "A#"', () => {
      expect(getNoteLabel('A#', 'D#', Modes.Dorian, Notations.Letter)).toBe(
        'A#'
      );
    });

    it('C in B locrian → "C"', () => {
      expect(getNoteLabel('C', 'B', Modes.Locrian, Notations.Letter)).toBe('C');
    });
  });
});

// In number notation, in-scale notes return their degree string; out-of-scale notes return ""
describe('getNoteLabel — number notation', () => {
  describe('in-scale notes return their scale degree in C ionian', () => {
    const C_IONIAN_DEGREES: Array<{ note: Note; label: string }> = [
      { note: 'C', label: '1' },
      { note: 'D', label: '2' },
      { note: 'E', label: '3' },
      { note: 'F', label: '4' },
      { note: 'G', label: '5' },
      { note: 'A', label: '6' },
      { note: 'B', label: '7' },
    ];

    it.each(C_IONIAN_DEGREES)('$note → "$label"', ({ note, label }) => {
      expect(getNoteLabel(note, 'C', Modes.Ionian, Notations.Number)).toBe(
        label
      );
    });
  });

  describe('out-of-scale notes return empty string in C ionian', () => {
    const OUT_OF_SCALE: Note[] = ['C#', 'D#', 'F#', 'G#', 'A#'];

    it.each(OUT_OF_SCALE.map((n) => ({ note: n })))(
      '$note → ""',
      ({ note }) => {
        expect(getNoteLabel(note, 'C', Modes.Ionian, Notations.Number)).toBe(
          ''
        );
      }
    );
  });

  describe('degree labels shift correctly with different modes', () => {
    // C dorian: [C D D# F G A A#], degree 3 is D# not E
    it('D# is degree 3 in C dorian', () => {
      expect(getNoteLabel('D#', 'C', Modes.Dorian, Notations.Number)).toBe('3');
    });

    // E is out of scale in C dorian
    it('E returns empty string in C dorian', () => {
      expect(getNoteLabel('E', 'C', Modes.Dorian, Notations.Number)).toBe('');
    });

    // G ionian: degree 7 is F#
    it('F# is degree 7 in G ionian', () => {
      expect(getNoteLabel('F#', 'G', Modes.Ionian, Notations.Number)).toBe('7');
    });
  });

  describe('degree 1 is always the root note in all 12 keys', () => {
    it.each(ALL_NOTES.map((n) => ({ note: n })))(
      'root $note → "1" in $note ionian',
      ({ note }) => {
        expect(getNoteLabel(note, note, Modes.Ionian, Notations.Number)).toBe(
          '1'
        );
      }
    );
  });

  describe('degree 1 is always the root note across all modes', () => {
    it.each(ALL_MODES.map((m) => ({ mode: m })))(
      'C is degree 1 in C $mode',
      ({ mode }) => {
        expect(getNoteLabel('C', 'C', mode, Notations.Number)).toBe('1');
      }
    );
  });
});

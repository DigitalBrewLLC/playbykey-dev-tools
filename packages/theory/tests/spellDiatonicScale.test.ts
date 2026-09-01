import { describe, expect, it } from 'vitest';
import {
  formatSpelledNote,
  getRootLetter,
  spellDiatonicScale,
  getModeNotes,
  getHarmonicMinorNotes,
  getMelodicMinorNotes,
  getPentatonicNotes,
  getBluesNotes,
  getBebopScaleNotes,
  Modes,
  PentatonicTypes,
  BebopScaleTypes,
} from '../src';
import type { Note, NoteLetter, SpelledNote } from '../src';
import { ALL_NOTES, ALL_MODES } from './fixtures';

describe('formatSpelledNote', () => {
  const CASES: Array<{ note: SpelledNote; expected: string }> = [
    { note: { letter: 'F', accidental: -2 }, expected: 'Fbb' },
    { note: { letter: 'F', accidental: -1 }, expected: 'Fb' },
    { note: { letter: 'F', accidental: 0 }, expected: 'F' },
    { note: { letter: 'F', accidental: 1 }, expected: 'F#' },
    { note: { letter: 'F', accidental: 2 }, expected: 'F##' },
  ];

  it.each(CASES)(
    'formats $note.letter/$note.accidental as $expected',
    ({ note, expected }) => {
      expect(formatSpelledNote(note)).toBe(expected);
    }
  );
});

describe('getRootLetter', () => {
  const SHARP_EXPECTED: Record<Note, NoteLetter> = {
    C: 'C',
    'C#': 'C',
    D: 'D',
    'D#': 'D',
    E: 'E',
    F: 'F',
    'F#': 'F',
    G: 'G',
    'G#': 'G',
    A: 'A',
    'A#': 'A',
    B: 'B',
  };

  const FLAT_EXPECTED: Record<Note, NoteLetter> = {
    C: 'C',
    'C#': 'D',
    D: 'D',
    'D#': 'E',
    E: 'E',
    F: 'F',
    'F#': 'G',
    G: 'G',
    'G#': 'A',
    A: 'A',
    'A#': 'B',
    B: 'B',
  };

  it.each(ALL_NOTES)("resolves '%s' under sharp preference", (note) => {
    expect(getRootLetter(note, 'sharp')).toBe(SHARP_EXPECTED[note]);
  });

  it.each(ALL_NOTES)("resolves '%s' under flat preference", (note) => {
    expect(getRootLetter(note, 'flat')).toBe(FLAT_EXPECTED[note]);
  });
});

describe('spellDiatonicScale', () => {
  describe('major scales requiring spellings a Note cannot express', () => {
    const CASES: Array<{
      label: string;
      root: Note;
      rootLetter: NoteLetter;
      expected: string[];
    }> = [
      {
        label: 'C# major',
        root: 'C#',
        rootLetter: 'C',
        expected: ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'],
      },
      {
        label: 'D# major',
        root: 'D#',
        rootLetter: 'D',
        expected: ['D#', 'E#', 'F##', 'G#', 'A#', 'B#', 'C##'],
      },
      {
        label: 'F# major',
        root: 'F#',
        rootLetter: 'F',
        expected: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
      },
      {
        label: 'G# major',
        root: 'G#',
        rootLetter: 'G',
        expected: ['G#', 'A#', 'B#', 'C#', 'D#', 'E#', 'F##'],
      },
      {
        label: 'A# major',
        root: 'A#',
        rootLetter: 'A',
        expected: ['A#', 'B#', 'C##', 'D#', 'E#', 'F##', 'G##'],
      },
      {
        label: 'Gb major (Gb spelling of F#)',
        root: 'F#',
        rootLetter: 'G',
        expected: ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'],
      },
    ];

    it.each(CASES)('$label', ({ root, rootLetter, expected }) => {
      const notes = getModeNotes(root, Modes.Ionian);
      const spelled = spellDiatonicScale(notes, rootLetter);
      expect(spelled.map(formatSpelledNote)).toEqual(expected);
    });
  });

  describe('minor scales requiring spellings a Note cannot express', () => {
    it('A# natural minor', () => {
      const notes = getModeNotes('A#', Modes.Aeolian);
      const spelled = spellDiatonicScale(notes, 'A');
      expect(spelled.map(formatSpelledNote)).toEqual([
        'A#',
        'B#',
        'C#',
        'D#',
        'E#',
        'F#',
        'G#',
      ]);
    });

    it('D# natural minor', () => {
      const notes = getModeNotes('D#', Modes.Aeolian);
      const spelled = spellDiatonicScale(notes, 'D');
      expect(spelled.map(formatSpelledNote)).toEqual([
        'D#',
        'E#',
        'F#',
        'G#',
        'A#',
        'B',
        'C#',
      ]);
    });
  });

  describe('non-major scale types', () => {
    it('C# harmonic minor', () => {
      const notes = getHarmonicMinorNotes('C#');
      const spelled = spellDiatonicScale(notes, 'C');
      expect(spelled.map(formatSpelledNote)).toEqual([
        'C#',
        'D#',
        'E',
        'F#',
        'G#',
        'A',
        'B#',
      ]);
    });

    it('G# melodic minor', () => {
      const notes = getMelodicMinorNotes('G#');
      const spelled = spellDiatonicScale(notes, 'G');
      expect(spelled.map(formatSpelledNote)).toEqual([
        'G#',
        'A#',
        'B',
        'C#',
        'D#',
        'E#',
        'F##',
      ]);
    });
  });

  describe('structural invariants hold across all roots, modes, and root-letter preferences', () => {
    const COMBINATIONS = ALL_NOTES.flatMap((root) =>
      ALL_MODES.flatMap((mode) => [
        { root, mode, preference: 'sharp' as const },
        { root, mode, preference: 'flat' as const },
      ])
    );

    it.each(COMBINATIONS)(
      '$root $mode ($preference) spells to 7 unique letters with in-range accidentals',
      ({ root, mode, preference }) => {
        const notes = getModeNotes(root, mode);
        const rootLetter = getRootLetter(root, preference);
        const spelled = spellDiatonicScale(notes, rootLetter);

        expect(spelled).toHaveLength(7);
        expect(new Set(spelled.map((s) => s.letter)).size).toBe(7);
        spelled.forEach((s) => {
          expect(s.accidental).toBeGreaterThanOrEqual(-2);
          expect(s.accidental).toBeLessThanOrEqual(2);
        });
      }
    );
  });

  describe('error paths', () => {
    it('throws for a 5-note pentatonic scale', () => {
      const notes = getPentatonicNotes('C', PentatonicTypes.Major);
      expect(() => spellDiatonicScale(notes, 'C')).toThrow(RangeError);
    });

    it('throws for a 6-note blues scale', () => {
      const notes = getBluesNotes('C');
      expect(() => spellDiatonicScale(notes, 'C')).toThrow(RangeError);
    });

    it('throws for an 8-note bebop scale', () => {
      const notes = getBebopScaleNotes('C', BebopScaleTypes.BebopDominant);
      expect(() => spellDiatonicScale(notes, 'C')).toThrow(RangeError);
    });
  });
});

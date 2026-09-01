/**
 * Letter-correct diatonic scale spelling.
 *
 * Re-spells an already-computed 7-note pitch-class scale (from
 * `getModeNotes`/`getScaleNotes`/etc.) so each of the 7 letters A-G is used
 * exactly once, including spellings a `Note` can't represent on its own
 * (`B#`, `E#`, `Cb`, `Fb`, double-sharps, double-flats).
 */

import type {
  Note,
  NoteLetter,
  AccidentalCount,
  SpelledNote,
  SpelledAccidentalCount,
} from './types';
import { getNoteIndex, elementAt } from './engine';
import { SHARP_TO_FLAT_MAP } from './constants';

/** The 7 note letters in ascending musical order, wrapping from G back to A. */
const LETTER_SEQUENCE: readonly NoteLetter[] = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
];

/** Chromatic pitch class of each letter with no accidental applied. */
const NATURAL_PITCH_CLASS: Record<NoteLetter, number> = {
  A: 9,
  B: 11,
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
};

const ACCIDENTAL_SYMBOL: Record<AccidentalCount, string> = {
  [-2]: 'bb',
  [-1]: 'b',
  [0]: '',
  [1]: '#',
  [2]: '##',
};

/**
 * Formats a `SpelledNote` for display, e.g. `{ letter: 'F', accidental: 2 }`
 * -> `"F##"`. Uses ASCII `#`/`b`, matching the existing `FlatNote`
 * convention (e.g. `"Db"`), not unicode sharp/flat symbols.
 *
 * @param note - The spelled note to format
 * @returns The letter followed by its accidental symbol (empty for natural)
 *
 * @example
 * formatSpelledNote({ letter: 'F', accidental: 2 })
 * // → "F##"
 */
const formatSpelledNote = (note: SpelledNote): string =>
  `${note.letter}${ACCIDENTAL_SYMBOL[note.accidental]}`;

/**
 * Resolves which letter a root should be spelled as, given a sharp/flat
 * preference. The 7 unambiguous naturals pass straight through; for the 5
 * ambiguous pitch classes, `'sharp'` returns the sharp-side letter and
 * `'flat'` returns the flat-side letter.
 *
 * @param root - Root pitch class
 * @param preference - `'sharp'` or `'flat'` spelling preference for ambiguous roots
 * @returns The letter the root should be spelled as
 *
 * @example
 * getRootLetter('F#', 'sharp')
 * // → "F"
 * getRootLetter('F#', 'flat')
 * // → "G" (spelled as Gb)
 */
const getRootLetter = (root: Note, preference: 'sharp' | 'flat'): NoteLetter =>
  (preference === 'sharp'
    ? root.charAt(0)
    : SHARP_TO_FLAT_MAP[root].charAt(0)) as NoteLetter;

/**
 * Returns the letter-correct spelling of a 7-note diatonic scale (major,
 * natural/harmonic/melodic minor, or any of the 7 modes) - each of the 7
 * letters A-G used exactly once, unlike `getModeNotes`/`getScaleNotes`,
 * which return pitch classes only and may reuse a letter or omit a needed
 * sharp/flat.
 *
 * @param notes - A 7-note pitch-class scale, e.g. from `getModeNotes`/`getScaleNotes`/`getHarmonicMinorNotes`/`getMelodicMinorNotes`
 * @param rootLetter - Which letter the root should be spelled as (see `getRootLetter`)
 * @returns The scale re-spelled with one entry per letter, in scale order starting from `rootLetter`
 * @throws {RangeError} if `notes` isn't exactly 7 entries, or if a computed accidental falls outside -2..2 (signals the input wasn't a valid diatonic scale)
 *
 * @example
 * spellDiatonicScale(getModeNotes('F#', 'ionian'), 'F')
 * // → [F#, G#, A#, B, C#, D#, E#] (as SpelledNote objects)
 */
const spellDiatonicScale = (
  notes: readonly Note[],
  rootLetter: NoteLetter
): SpelledNote[] => {
  if (notes.length !== 7) {
    throw new RangeError(
      `spellDiatonicScale expects exactly 7 notes, got ${notes.length}`
    );
  }
  const startIndex = LETTER_SEQUENCE.indexOf(rootLetter);
  return notes.map((note, i) => {
    const letter = elementAt(LETTER_SEQUENCE, (startIndex + i) % 7);
    const target = getNoteIndex(note);
    const natural = NATURAL_PITCH_CLASS[letter];
    const accidental = ((((target - natural + 6) % 12) + 12) % 12) - 6;
    if (accidental < -2 || accidental > 2) {
      throw new RangeError(
        `Computed accidental ${accidental} for letter ${letter} is out of range - notes may not form a valid diatonic scale`
      );
    }
    return { letter, accidental: accidental as AccidentalCount };
  });
};

/**
 * Returns the sharp or flat count for a 7-note diatonic scale's correct
 * spelling, including how many of those accidentals are doubled. Works on
 * a major or natural minor scale interchangeably - a key and its relative
 * minor share the same signature, so spelling either one directly gives
 * the same count without resolving a relative key first.
 *
 * @param notes - A 7-note pitch-class scale, e.g. from `getModeNotes`/`getScaleNotes`
 * @param rootLetter - Which letter the root should be spelled as (see `getRootLetter`)
 * @returns `{ sharps, doubleSharps }` or `{ flats, doubleFlats }` - a scale with no accidentals returns `{ sharps: 0, doubleSharps: 0 }`
 * @throws {RangeError} if `notes` isn't exactly 7 entries, or forms an invalid diatonic scale (see `spellDiatonicScale`)
 *
 * @example
 * getSpelledAccidentalCount(getModeNotes('A#', 'ionian'), 'A')
 * // → { sharps: 7, doubleSharps: 3 }
 */
const getSpelledAccidentalCount = (
  notes: readonly Note[],
  rootLetter: NoteLetter
): SpelledAccidentalCount => {
  const spelled = spellDiatonicScale(notes, rootLetter);
  const flatCount = spelled.filter((n) => n.accidental < 0).length;
  if (flatCount > 0) {
    return {
      flats: flatCount,
      doubleFlats: spelled.filter((n) => n.accidental === -2).length,
    };
  }
  return {
    sharps: spelled.filter((n) => n.accidental > 0).length,
    doubleSharps: spelled.filter((n) => n.accidental === 2).length,
  };
};

export {
  formatSpelledNote,
  getRootLetter,
  spellDiatonicScale,
  getSpelledAccidentalCount,
};

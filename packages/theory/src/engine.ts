/**
 * Music theory computation engine.
 *
 * Pure functions that transform key + mode selections into display-ready
 * note data consumed by all visualization views. Zero side effects,
 * zero dependencies beyond local types and constants.
 */

import type { Note, ModeName, KeyQuality, FlatNote } from './types';
import {
  Modes,
  CHROMATIC_NOTES,
  MODES,
  ModeInfoById,
  ENHARMONIC_LABELS,
  KeyQualities,
  FlatNotes,
  FLAT_TO_SHARP,
  SHARP_TO_FLAT_MAP,
} from './constants';

const KEY_SIGNATURE_COUNT: Record<
  Note,
  { sharps: number } | { flats: number }
> = {
  C: { sharps: 0 },
  G: { sharps: 1 },
  D: { sharps: 2 },
  A: { sharps: 3 },
  E: { sharps: 4 },
  B: { sharps: 5 },
  'F#': { sharps: 6 },
  'C#': { flats: 5 },
  'G#': { flats: 4 },
  'D#': { flats: 3 },
  'A#': { flats: 2 },
  F: { flats: 1 },
};

/**
 * Interval patterns (in semitones) for each mode of the major scale.
 * Each array sums to 12 (one octave) and contains 7 step sizes.
 * Describes movement between consecutive scale degrees.
 */
const MODE_INTERVALS: Record<ModeName, readonly number[]> = {
  [Modes.Ionian]: [2, 2, 1, 2, 2, 2, 1],
  [Modes.Dorian]: [2, 1, 2, 2, 2, 1, 2],
  [Modes.Phrygian]: [1, 2, 2, 2, 1, 2, 2],
  [Modes.Lydian]: [2, 2, 2, 1, 2, 2, 1],
  [Modes.Mixolydian]: [2, 2, 1, 2, 2, 1, 2],
  [Modes.Aeolian]: [2, 1, 2, 2, 1, 2, 2],
  [Modes.Locrian]: [1, 2, 2, 1, 2, 2, 2],
};

/**
 * Absolute semitone offsets from root for each scale degree per mode.
 * Describes position - each degree's distance from the root note.
 *
 * Example: Ionian [0, 2, 4, 5, 7, 9, 11] means
 * root +0, +2 (2nd), +4 (3rd), +5 (4th), +7 (5th), +9 (6th), +11 (7th).
 */
const MODE_SEMITONE_OFFSETS: Record<ModeName, readonly number[]> = {
  [Modes.Ionian]: [0, 2, 4, 5, 7, 9, 11],
  [Modes.Dorian]: [0, 2, 3, 5, 7, 9, 10],
  [Modes.Phrygian]: [0, 1, 3, 5, 7, 8, 10],
  [Modes.Lydian]: [0, 2, 4, 6, 7, 9, 11],
  [Modes.Mixolydian]: [0, 2, 4, 5, 7, 9, 10],
  [Modes.Aeolian]: [0, 2, 3, 5, 7, 8, 10],
  [Modes.Locrian]: [0, 1, 3, 5, 6, 8, 10],
};

/**
 * Reads an array element at an index guaranteed to be in range by the
 * caller (e.g. the result of a `% length` wrap). Throws if that invariant
 * is ever violated, satisfying `noUncheckedIndexedAccess` without `!`.
 */
const elementAt = <T>(array: readonly T[], index: number): T => {
  const value = array[index];
  if (value === undefined) {
    throw new RangeError(`Index ${index} is out of bounds`);
  }
  return value;
};

/** Pre-computed sets for O(1) type-guard lookups. */
const NOTE_SET = new Set<string>(CHROMATIC_NOTES);
const MODE_NAME_SET = new Set<string>(Object.values(Modes));
const FLAT_NOTE_SET = new Set<string>(Object.values(FlatNotes));

/**
 * Returns the chromatic index (0-11) of a note within the chromatic scale.
 * C = 0, C# = 1, D = 2, ... B = 11.
 * Throws RangeError if the value is not a recognised note at runtime.
 */
const getNoteIndex = (note: Note): number => {
  const index = CHROMATIC_NOTES.indexOf(note);
  if (index === -1) {
    throw new RangeError(`"${note}" is not a valid note`);
  }
  return index;
};

/**
 * Returns the pitch class at a given chromatic index.
 * Pitches repeat every 12 semitones (one octave), so any index outside 0–11
 * resolves to its enharmonic equivalent: 12 → C, 13 → C#, -1 → B.
 * The double modulo handles negative indices correctly across JS runtimes.
 */
const noteAtIndex = (index: number): Note => {
  return elementAt(CHROMATIC_NOTES, ((index % 12) + 12) % 12);
};

/**
 * Computes the ascending semitone distance between two notes (0-11).
 */
const getSemitoneDistance = (from: Note, to: Note): number => {
  return (((getNoteIndex(to) - getNoteIndex(from)) % 12) + 12) % 12;
};

/**
 * Returns the 7 notes of a diatonic mode for a given root.
 *
 * Example: getModeNotes('C', 'ionian') => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 * Example: getModeNotes('D', 'dorian') => ['D', 'E', 'F', 'G', 'A', 'B', 'C']
 */
const getModeNotes = (root: Note, mode: ModeName): Note[] => {
  const rootIndex = getNoteIndex(root);
  return MODE_SEMITONE_OFFSETS[mode].map((offset) =>
    noteAtIndex(rootIndex + offset)
  );
};

/**
 * Given any root+mode, finds the parent major (Ionian) key and returns all
 * 7 rotation pairs in scale degree order.
 *
 * Example: getParentScaleModes('D', 'dorian') => parent is C major =>
 * [{ root: 'C', mode: 'ionian' }, { root: 'D', mode: 'dorian' }, ...]
 */
const getParentScaleModes = (
  key: Note,
  mode: ModeName
): Array<{ root: Note; mode: ModeName }> => {
  const modeInfo = ModeInfoById[mode];
  const parentRootIndex =
    (getNoteIndex(key) -
      elementAt(MODE_SEMITONE_OFFSETS[Modes.Ionian], modeInfo.scaleDegree - 1) +
      12) %
    12;
  const parentRoot = noteAtIndex(parentRootIndex);
  const parentScaleNotes = getModeNotes(parentRoot, Modes.Ionian);
  return MODES.map((m, i) => ({
    root: elementAt(parentScaleNotes, i),
    mode: m.id,
  }));
};

/**
 * Returns the natural root note for a mode within a parent Ionian (major) key.
 * The parent key is always treated as the Ionian root - the modal root is
 * the note at the mode's scale degree position within that parent scale.
 *
 * Example: getModalRoot('C', 'dorian')   => 'D'  (2nd degree of C major)
 * Example: getModalRoot('C', 'phrygian') => 'E'  (3rd degree of C major)
 * Example: getModalRoot('C', 'ionian')   => 'C'  (1st degree, unchanged)
 */
const getModalRoot = (parentKey: Note, mode: ModeName): Note => {
  const modeInfo = ModeInfoById[mode];
  const parentNotes = getModeNotes(parentKey, Modes.Ionian);
  return elementAt(parentNotes, modeInfo.scaleDegree - 1);
};

/**
 * Returns the relative minor root for a given major key.
 * Equivalent to moving 9 semitones up (or 3 semitones down) from the major root.
 *
 * Example: getRelativeMinorKey('C') => 'A'
 */
const getRelativeMinorKey = (majorKey: Note): Note => {
  return noteAtIndex(getNoteIndex(majorKey) + 9);
};

/**
 * Returns the relative major root for a given minor key.
 * Equivalent to moving 3 semitones up from the minor root.
 *
 * Example: getRelativeMajorKey('A') => 'C'
 */
const getRelativeMajorKey = (minorKey: Note): Note => {
  return noteAtIndex(getNoteIndex(minorKey) + 3);
};

/**
 * Returns the 12 chromatic notes in ascending fifth order starting from C.
 * Used by CircleOfFifthsView to arrange key positions on the circle.
 */
const getCircleOfFifthsOrder = (): readonly Note[] => {
  const result: Note[] = [];
  let index = 0;
  for (let i = 0; i < 12; i++) {
    result.push(noteAtIndex(index));
    index = (index + 7) % 12;
  }
  return result as readonly Note[];
};

/**
 * Returns the key signature accidental count for a given key.
 * Used by CircleOfFifthsView for labels on the circle.
 *
 * `quality` defaults to `'major'`. When `'minor'`, resolves the key's
 * relative major root and returns that root's accidental count.
 *
 * Example: getKeySignatureCount('G') => { sharps: 1 }
 * Example: getKeySignatureCount('F') => { flats: 1 }
 * Example: getKeySignatureCount('C#', 'minor') => { sharps: 4 } (relative major is E)
 */
const getKeySignatureCount = (
  key: Note,
  quality: KeyQuality = KeyQualities.Major
): { sharps: number } | { flats: number } => {
  const signatureKey =
    quality === KeyQualities.Minor ? getRelativeMajorKey(key) : key;
  return KEY_SIGNATURE_COUNT[signatureKey];
};

const normalizeNoteInput = (value: string): Note | null => {
  const normalized = value.toUpperCase();
  return NOTE_SET.has(normalized) ? (normalized as Note) : null;
};

const isNote = (value: string): value is Note =>
  normalizeNoteInput(value) !== null;

const isModeName = (value: string): value is ModeName =>
  MODE_NAME_SET.has(value.toLowerCase());

/** Type guard for the 5 canonical flat-spelled note strings (e.g. "Db"). */
const isFlatNote = (value: string): value is FlatNote =>
  FLAT_NOTE_SET.has(value);

/**
 * Normalizes a flat-spelled note token (e.g. "Db", "db", "DB") to its
 * canonical sharp Note (e.g. "C#"), or null when not recognized. The letter
 * is uppercased and the accidental is checked case-insensitively for 'b',
 * handled separately from the letter so uppercasing the whole string never
 * corrupts the accidental (e.g. "Db" must not become "DB").
 */
const normalizeFlatNoteInput = (value: string): Note | null => {
  if (value.length !== 2) return null;
  const letter = value.charAt(0).toUpperCase();
  const accidental = value.charAt(1).toLowerCase();
  if (accidental !== 'b') return null;
  const candidate = `${letter}b`;
  return isFlatNote(candidate) ? FLAT_TO_SHARP[candidate] : null;
};

/** First token before a space or comma (e.g. "C ionian" -> "C"). */
const firstToken = (value: string): string => {
  const trimmed = value.trim();
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (ch === ' ' || ch === ',') {
      return trimmed.slice(0, i);
    }
  }
  return trimmed;
};

/**
 * Parse a display key string into a chromatic Note, or null when not
 * recognized. Accepts flat-spelled note names (e.g. "Db") in addition to
 * sharps, normalizing them to their canonical sharp equivalent.
 *
 * Example: parseNote('C ionian') => 'C'
 * Example: parseNote('Db aeolian') => 'C#'
 */
const parseNote = (value: string): Note | null => {
  const token = firstToken(value);
  return normalizeNoteInput(token) ?? normalizeFlatNoteInput(token);
};

/**
 * Strict, exact-match note parser: accepts a single canonical sharp or flat
 * note token (no phrase-splitting, unlike parseNote). Returns null for
 * anything but a bare note - use this for validating a single argument
 * rather than extracting a note from a larger phrase.
 *
 * Example: parseNoteToken('Db') => 'C#'
 * Example: parseNoteToken('C ionian') => null (parseNote would return 'C')
 */
const parseNoteToken = (value: string): Note | null => {
  const trimmed = value.trim();
  return normalizeNoteInput(trimmed) ?? normalizeFlatNoteInput(trimmed);
};

/** Parse a mode slug into a ModeName, or null when not recognized. */
const parseModeName = (value: string): ModeName | null => {
  const token = firstToken(value).toLowerCase();
  return isModeName(token) ? token : null;
};

/**
 * Normalizes notes (which may be flat-spelled) to their canonical sharp
 * equivalents. Sharp/natural notes pass through unchanged.
 *
 * Example: getSharps(['Db', 'C#', 'D']) => ['C#', 'C#', 'D']
 */
const getSharps = (notes: readonly (Note | FlatNote)[]): Note[] =>
  notes.map((note) => (isFlatNote(note) ? FLAT_TO_SHARP[note] : note));

/**
 * Converts notes to their flat-spelled equivalents. Natural notes are
 * unaffected.
 *
 * Example: getFlats(['C#', 'D']) => ['Db', 'D']
 */
const getFlats = (notes: readonly Note[]): string[] =>
  notes.map((note) => SHARP_TO_FLAT_MAP[note] ?? note);

/**
 * Returns combined sharp/flat display labels for notes (e.g. "C#" -> "Db/C#").
 * Natural notes are unaffected.
 *
 * Example: getEnharmonicLabels(['C#', 'D']) => ['Db/C#', 'D']
 */
const getEnharmonicLabels = (notes: readonly Note[]): string[] =>
  notes.map((note) => ENHARMONIC_LABELS[note] ?? note);

export {
  elementAt,
  MODE_INTERVALS,
  MODE_SEMITONE_OFFSETS,
  getNoteIndex,
  noteAtIndex,
  getSemitoneDistance,
  getModeNotes,
  getModalRoot,
  getParentScaleModes,
  getRelativeMinorKey,
  getRelativeMajorKey,
  getCircleOfFifthsOrder,
  getKeySignatureCount,
  isNote,
  isModeName,
  parseNote,
  parseNoteToken,
  parseModeName,
  getSharps,
  getFlats,
  getEnharmonicLabels,
};

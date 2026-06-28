/**
 * Music theory computation engine.
 *
 * Pure functions that transform key + mode selections into display-ready
 * note data consumed by all visualization views. Zero side effects,
 * zero dependencies beyond local types and constants.
 */

import type { Note, ModeName, NotationType, NoteDisplayInfo } from './types';
import { Modes, CHROMATIC_NOTES, MODES, ModeInfoById } from './constants';

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
 * Describes position — each degree's distance from the root note.
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
 * Returns the note at a given chromatic index, wrapping around at 12.
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
 * Returns the 7 notes of a scale for a given root and mode.
 *
 * Example: getScaleNotes('C', 'ionian') => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
 * Example: getScaleNotes('D', 'dorian') => ['D', 'E', 'F', 'G', 'A', 'B', 'C']
 */
const getScaleNotes = (root: Note, mode: ModeName): Note[] => {
  const rootIndex = getNoteIndex(root);
  return MODE_SEMITONE_OFFSETS[mode].map((offset) =>
    noteAtIndex(rootIndex + offset)
  );
};

/**
 * Returns the scale degree (1-7) of a note within a key/mode, or null
 * if the note is not in the scale.
 *
 * Example: getScaleDegree('C', 'ionian', 'E') => 3
 * Example: getScaleDegree('C', 'ionian', 'F#') => null
 */
const getScaleDegree = (
  root: Note,
  mode: ModeName,
  note: Note
): number | null => {
  const scaleNotes = getScaleNotes(root, mode);
  const index = scaleNotes.indexOf(note);
  return index === -1 ? null : index + 1;
};

/**
 * Returns true if the note belongs to the given key/mode scale.
 */
const isNoteInScale = (root: Note, mode: ModeName, note: Note): boolean => {
  return getScaleDegree(root, mode, note) !== null;
};

/**
 * Returns a display label for a note based on the selected notation type.
 *
 * - 'number' notation: returns the scale degree as a string ("1"-"7"),
 *   or an empty string if the note is not in the scale.
 * - 'letter' notation: returns the note name (e.g. "C#").
 */
const getNoteLabel = (
  note: Note,
  root: Note,
  mode: ModeName,
  notation: NotationType
): string => {
  if (notation === 'letter') {
    return note;
  }

  const degree = getScaleDegree(root, mode, note);
  return degree !== null ? String(degree) : '';
};

/**
 * Produces an array of 12 NoteDisplayInfo objects (one per chromatic note,
 * starting from C), each describing how to render that note for the current
 * key/mode/notation selection.
 *
 * This is the primary data structure consumed by all visualization views.
 */
const buildNoteMap = (
  root: Note,
  mode: ModeName,
  notation: NotationType
): NoteDisplayInfo[] => {
  const scaleNotes = getScaleNotes(root, mode);
  return CHROMATIC_NOTES.map((note) => {
    const index = scaleNotes.indexOf(note);
    const scaleDegree = index === -1 ? null : index + 1;
    return {
      note,
      inScale: scaleDegree !== null,
      scaleDegree,
      label:
        notation === 'letter'
          ? note
          : scaleDegree !== null
            ? String(scaleDegree)
            : '',
      isRoot: note === root,
    };
  });
};

/**
 * Returns which scale degrees (1-7) are altered relative to Ionian.
 * Used by ModeIntervalGridView to populate grid cells (natural, flat, sharp).
 *
 * Example: getModeAlterations('dorian') => { 3: 'flat', 7: 'flat' }
 */
const getModeAlterations = (
  mode: ModeName
): Partial<Record<number, 'flat' | 'sharp'>> => {
  const ionianOffsets = MODE_SEMITONE_OFFSETS[Modes.Ionian];
  const modeOffsets = MODE_SEMITONE_OFFSETS[mode];
  const result: Partial<Record<number, 'flat' | 'sharp'>> = {};
  for (let i = 0; i < 7; i++) {
    const ionian = elementAt(ionianOffsets, i);
    const current = elementAt(modeOffsets, i);
    if (current < ionian) {
      result[i + 1] = 'flat';
    } else if (current > ionian) {
      result[i + 1] = 'sharp';
    }
  }
  return result;
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
  const parentScaleNotes = getScaleNotes(parentRoot, Modes.Ionian);
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
  const parentNotes = getScaleNotes(parentKey, Modes.Ionian);
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
 * Example: getKeySignatureCount('G') => { sharps: 1 }
 * Example: getKeySignatureCount('F') => { flats: 1 }
 */
const getKeySignatureCount = (
  key: Note
): { sharps: number } | { flats: number } => KEY_SIGNATURE_COUNT[key];

const isNote = (value: string): value is Note => NOTE_SET.has(value);

const isModeName = (value: string): value is ModeName =>
  MODE_NAME_SET.has(value);

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

/** Parse a display key string into a chromatic Note, or null when not recognized. */
const parseNote = (value: string): Note | null => {
  const token = firstToken(value);
  return isNote(token) ? token : null;
};

/** Parse a mode slug into a ModeName, or null when not recognized. */
const parseModeName = (value: string): ModeName | null => {
  const token = firstToken(value).toLowerCase();
  return isModeName(token) ? token : null;
};

export {
  elementAt,
  MODE_INTERVALS,
  MODE_SEMITONE_OFFSETS,
  getNoteIndex,
  noteAtIndex,
  getSemitoneDistance,
  getScaleNotes,
  getScaleDegree,
  isNoteInScale,
  getNoteLabel,
  buildNoteMap,
  getModeAlterations,
  getModalRoot,
  getParentScaleModes,
  getRelativeMinorKey,
  getRelativeMajorKey,
  getCircleOfFifthsOrder,
  getKeySignatureCount,
  isNote,
  isModeName,
  parseNote,
  parseModeName,
};

/**
 * Music theory computation engine.
 *
 * Pure functions that transform key + mode selections into display-ready
 * note data consumed by all visualization views. Zero side effects,
 * zero dependencies beyond local types and constants.
 */

import type { Note, ModeName, NotationType, NoteDisplayInfo } from './types';
import { MODE_NAMES, NOTES, MODES } from './constants';

/**
 * Interval patterns (in semitones) for each mode of the major scale.
 * Each array sums to 12 (one octave) and contains 7 step sizes.
 * Describes movement between consecutive scale degrees.
 */
const MODE_INTERVALS: Record<ModeName, readonly number[]> = {
  ionian: [2, 2, 1, 2, 2, 2, 1],
  dorian: [2, 1, 2, 2, 2, 1, 2],
  phrygian: [1, 2, 2, 2, 1, 2, 2],
  lydian: [2, 2, 2, 1, 2, 2, 1],
  mixolydian: [2, 2, 1, 2, 2, 1, 2],
  aeolian: [2, 1, 2, 2, 1, 2, 2],
  locrian: [1, 2, 2, 1, 2, 2, 2],
};

/**
 * Absolute semitone offsets from root for each scale degree per mode.
 * Describes position — each degree's distance from the root note.
 *
 * Example: Ionian [0, 2, 4, 5, 7, 9, 11] means
 * root +0, +2 (2nd), +4 (3rd), +5 (4th), +7 (5th), +9 (6th), +11 (7th).
 */
const MODE_SEMITONE_OFFSETS: Record<ModeName, readonly number[]> = {
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
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

/**
 * Returns the chromatic index (0-11) of a note within the NOTES array.
 * C = 0, C# = 1, D = 2, ... B = 11.
 */
const getNoteIndex = (note: Note): number => {
  return NOTES.indexOf(note);
};

/**
 * Returns the note at a given chromatic index, wrapping around at 12.
 */
const noteAtIndex = (index: number): Note => {
  return elementAt(NOTES, ((index % 12) + 12) % 12);
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
  return NOTES.map((note) => {
    const scaleDegree = getScaleDegree(root, mode, note);

    return {
      note,
      inScale: scaleDegree !== null,
      scaleDegree,
      label: getNoteLabel(note, root, mode, notation),
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
  const ionianOffsets = MODE_SEMITONE_OFFSETS['ionian'];
  const modeOffsets = MODE_SEMITONE_OFFSETS[mode];
  const result: Partial<Record<number, 'flat' | 'sharp'>> = {};
  for (let i = 0; i < 7; i++) {
    const ionian = ionianOffsets[i];
    const current = modeOffsets[i];
    if (current !== undefined && ionian !== undefined && current < ionian) {
      result[i + 1] = 'flat';
    } else if (
      current !== undefined &&
      ionian !== undefined &&
      current > ionian
    ) {
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
  const modeInfo = MODES.find((m) => m.id === mode);
  const scaleDegree = modeInfo !== undefined ? modeInfo.scaleDegree : 1;
  const parentRootIndex =
    (getNoteIndex(key) -
      elementAt(MODE_SEMITONE_OFFSETS['ionian'], scaleDegree - 1) +
      12) %
    12;
  const parentRoot = noteAtIndex(parentRootIndex);
  const parentScaleNotes = getScaleNotes(parentRoot, 'ionian');
  return MODES.map((m, i) => ({
    root: parentScaleNotes[i] as Note,
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
  const modeInfo = MODES.find((m) => m.id === mode);
  const scaleDegree = modeInfo !== undefined ? modeInfo.scaleDegree : 1;
  const parentNotes = getScaleNotes(parentKey, 'ionian');
  return parentNotes[scaleDegree - 1] as Note;
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
): { sharps: number } | { flats: number } => {
  const lookup: Record<Note, { sharps: number } | { flats: number }> = {
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
  return lookup[key];
};

const isNote = (value: string): value is Note =>
  (NOTES as readonly string[]).includes(value);

const isModeName = (value: string): value is ModeName =>
  (MODE_NAMES as readonly string[]).includes(value);

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

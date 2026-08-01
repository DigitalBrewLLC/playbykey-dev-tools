import {
  Modes,
  CHROMATIC_NOTES,
  ScaleTypes,
  PentatonicTypes,
  MelodicMinorModes,
  HarmonicMinorModes,
  BebopScaleTypes,
} from './constants';
import { elementAt, getNoteIndex, getModeNotes, noteAtIndex } from './engine';
import type {
  ModeName,
  Note,
  NoteDisplayInfo,
  PentatonicType,
  ScaleType,
  MelodicMinorModeName,
  HarmonicMinorModeName,
  BebopScaleType,
} from './types';

/** Semitone offsets from the tonic for the six-note blues scale. */
const BLUES_SEMITONE_OFFSETS = [0, 3, 5, 6, 7, 10] as const;

/**
 * Scale degrees for the major pentatonic subset (degrees 1,2,3,5,6 of ionian).
 * C major pentatonic: C D E G A
 */
const PENTATONIC_MAJOR_DEGREES = [1, 2, 3, 5, 6] as const;

/**
 * Scale degrees for the minor pentatonic subset (degrees 1,3,4,5,7 of aeolian).
 * C minor pentatonic: C Eb F G Bb
 */
const PENTATONIC_MINOR_DEGREES = [1, 3, 4, 5, 7] as const;

/** All seven diatonic scale degrees. */
const FULL_SCALE_DEGREES = [1, 2, 3, 4, 5, 6, 7] as const;

/** Aeolian (natural minor) is the parent mode for harmonic minor derivation. */
const HARMONIC_MINOR_PARENT_MODE: ModeName = Modes.Aeolian;

/** Harmonic minor raises the 7th degree by one semitone. */
const HARMONIC_MINOR_RAISE_DEGREE = 7;

/** Semitone offsets from the tonic for the ascending melodic minor scale. */
const MELODIC_MINOR_SEMITONE_OFFSETS = [0, 2, 3, 5, 7, 9, 11] as const;

/** Semitone offsets for each melodic minor mode, keyed by MelodicMinorModeName. The base scale entry references MELODIC_MINOR_SEMITONE_OFFSETS directly rather than duplicating the array, so there's one source of truth for it. */
const MELODIC_MINOR_MODE_SEMITONE_OFFSETS: Record<
  MelodicMinorModeName,
  readonly number[]
> = {
  [MelodicMinorModes.MelodicMinor]: MELODIC_MINOR_SEMITONE_OFFSETS,
  [MelodicMinorModes.DorianB2]: [0, 1, 3, 5, 7, 9, 10],
  [MelodicMinorModes.LydianAugmented]: [0, 2, 4, 6, 8, 9, 11],
  [MelodicMinorModes.LydianDominant]: [0, 2, 4, 6, 7, 9, 10],
  [MelodicMinorModes.MixolydianB6]: [0, 2, 4, 5, 7, 8, 10],
  [MelodicMinorModes.LocrianNat2]: [0, 2, 3, 5, 6, 8, 10],
  [MelodicMinorModes.Altered]: [0, 1, 3, 4, 6, 8, 10],
};

/**
 * Semitone offsets for harmonic minor modes other than the base scale itself.
 * The base scale ('harmonic-minor') is deliberately excluded here - it's
 * derived via getHarmonicMinorNotes (parent-mode + raised-7th), not a static
 * offset table, so getHarmonicMinorModeNotes delegates to that function
 * directly for that case rather than keeping a second, independently
 * maintained copy of the same result.
 */
const HARMONIC_MINOR_MODE_SEMITONE_OFFSETS: Record<
  Exclude<HarmonicMinorModeName, 'harmonic-minor'>,
  readonly number[]
> = {
  [HarmonicMinorModes.PhrygianDominant]: [0, 1, 4, 5, 7, 8, 10],
};

/** Semitone offsets for each bebop scale variant, keyed by BebopScaleType. */
const BEBOP_SCALE_SEMITONE_OFFSETS: Record<BebopScaleType, readonly number[]> =
  {
    [BebopScaleTypes.BebopDominant]: [0, 2, 4, 5, 7, 9, 10, 11],
    [BebopScaleTypes.BebopMajor]: [0, 2, 4, 5, 7, 8, 9, 11],
    [BebopScaleTypes.BebopDorian]: [0, 2, 3, 4, 5, 7, 9, 10],
  };

interface ScaleDefinition {
  label: string;
  semitoneOffsets?: readonly number[];
  parentMode?: ModeName;
  raiseDegree?: number;
}

const SCALE_DEFINITIONS: Record<ScaleType, ScaleDefinition> = {
  [ScaleTypes.Major]: {
    label: 'Major scale',
  },
  [ScaleTypes.Chromatic]: {
    label: 'Chromatic scale',
    semitoneOffsets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  [ScaleTypes.PentatonicMajor]: {
    label: 'Major pentatonic scale',
  },
  [ScaleTypes.PentatonicMinor]: {
    label: 'Minor pentatonic scale',
  },
  [ScaleTypes.Blues]: {
    label: 'Blues scale',
    semitoneOffsets: BLUES_SEMITONE_OFFSETS,
  },
  [ScaleTypes.HarmonicMinor]: {
    label: 'Harmonic minor scale',
    parentMode: HARMONIC_MINOR_PARENT_MODE,
    raiseDegree: HARMONIC_MINOR_RAISE_DEGREE,
  },
  [ScaleTypes.MelodicMinor]: {
    label: 'Melodic minor scale',
    semitoneOffsets: MELODIC_MINOR_SEMITONE_OFFSETS,
  },
};

/**
 * Returns the notes produced by a set of semitone offsets from a root -
 * the shared primitive every table-driven scale/chord function in this
 * package builds on.
 *
 * @param root - Root note
 * @param offsets - Semitone offsets from root, e.g. `[0, 4, 7]` for a major triad shape
 * @returns One note per offset, in the same order
 *
 * @example
 * notesFromSemitoneOffsets("C", [0, 4, 7])
 * // → ["C", "E", "G"]
 */
const notesFromSemitoneOffsets = (
  root: Note,
  offsets: readonly number[]
): Note[] => {
  const rootIndex = getNoteIndex(root);
  return offsets.map((offset) => noteAtIndex(rootIndex + offset));
};

/**
 * Returns the seven notes of the harmonic minor scale for a root - the
 * Aeolian (natural minor) scale with its 7th degree raised one semitone.
 *
 * @param root - Root note
 * @returns The 7 harmonic minor notes, ascending from root
 *
 * @example
 * getHarmonicMinorNotes("C")
 * // → ["C", "D", "D#", "F", "G", "G#", "B"]
 */
const getHarmonicMinorNotes = (root: Note): Note[] => {
  const raisedIndex = HARMONIC_MINOR_RAISE_DEGREE - 1;
  const parentNotes = getModeNotes(root, HARMONIC_MINOR_PARENT_MODE);
  const naturalSeventh = elementAt(parentNotes, raisedIndex);
  return [
    ...parentNotes.slice(0, raisedIndex),
    noteAtIndex(getNoteIndex(naturalSeventh) + 1),
  ];
};

/**
 * Returns the six notes of the blues scale for a root.
 *
 * @param root - Root note
 * @returns The 6 blues scale notes, ascending from root
 *
 * @example
 * getBluesNotes("C")
 * // → ["C", "D#", "F", "F#", "G", "A#"]
 */
const getBluesNotes = (root: Note): Note[] =>
  notesFromSemitoneOffsets(root, BLUES_SEMITONE_OFFSETS);

/**
 * Returns the seven notes of the ascending melodic minor scale for a root.
 *
 * @param root - Root note
 * @returns The 7 melodic minor notes, ascending from root
 *
 * @example
 * getMelodicMinorNotes("C")
 * // → ["C", "D", "D#", "F", "G", "A", "B"]
 */
const getMelodicMinorNotes = (root: Note): Note[] =>
  notesFromSemitoneOffsets(root, MELODIC_MINOR_SEMITONE_OFFSETS);

/**
 * Returns the seven notes of a melodic minor mode for a root.
 *
 * @param root - Root note
 * @param mode - Melodic minor mode name (see `MelodicMinorModes`), e.g. `"altered"`, `"lydian-dominant"`
 * @returns The mode's 7 notes, ascending from root
 *
 * @example
 * getMelodicMinorModeNotes("C", "lydian-dominant")
 * // → ["C", "D", "E", "F#", "G", "A", "A#"]
 */
const getMelodicMinorModeNotes = (
  root: Note,
  mode: MelodicMinorModeName
): Note[] =>
  notesFromSemitoneOffsets(root, MELODIC_MINOR_MODE_SEMITONE_OFFSETS[mode]);

/**
 * Returns the seven notes of a harmonic minor mode for a root. Delegates to
 * `getHarmonicMinorNotes` for the base scale itself, since that's the
 * actual (non-table-based) derivation - only the true modal rotations use
 * the offset table.
 *
 * @param root - Root note
 * @param mode - Harmonic minor mode name (see `HarmonicMinorModes`) -
 *   `"harmonic-minor"` (the base scale) or `"phrygian-dominant"`
 * @returns The mode's 7 notes, ascending from root
 *
 * @example
 * getHarmonicMinorModeNotes("C", "phrygian-dominant")
 * // → ["C", "C#", "E", "F", "G", "G#", "A#"]
 */
const getHarmonicMinorModeNotes = (
  root: Note,
  mode: HarmonicMinorModeName
): Note[] => {
  if (mode === HarmonicMinorModes.HarmonicMinor) {
    return getHarmonicMinorNotes(root);
  }
  return notesFromSemitoneOffsets(
    root,
    HARMONIC_MINOR_MODE_SEMITONE_OFFSETS[mode]
  );
};

/**
 * Returns the eight notes of a bebop scale variant for a root - each is a
 * diatonic scale plus one chromatic passing tone.
 *
 * @param root - Root note
 * @param type - Bebop scale variant (see `BebopScaleTypes`): `"bebop-dominant"`, `"bebop-major"`, or `"bebop-dorian"`
 * @returns The variant's 8 notes, ascending from root
 *
 * @example
 * getBebopScaleNotes("C", "bebop-dominant")
 * // → ["C", "D", "E", "F", "G", "A", "A#", "B"]
 */
const getBebopScaleNotes = (root: Note, type: BebopScaleType): Note[] =>
  notesFromSemitoneOffsets(root, BEBOP_SCALE_SEMITONE_OFFSETS[type]);

/**
 * Returns the five notes of a pentatonic scale rooted at `root`.
 *
 * @param root - Root note
 * @param type - `"pentatonic-major"` (degrees 1,2,3,5,6 of Ionian) or
 *   `"pentatonic-minor"` (degrees 1,3,4,5,7 of Aeolian)
 * @returns The 5 pentatonic notes, ascending from root
 *
 * @example
 * getPentatonicNotes("C", "pentatonic-major")
 * // → ["C", "D", "E", "G", "A"]
 * getPentatonicNotes("C", "pentatonic-minor")
 * // → ["C", "D#", "F", "G", "A#"]
 */
const getPentatonicNotes = (root: Note, type: PentatonicType): Note[] => {
  if (type === PentatonicTypes.Major) {
    const scale = getModeNotes(root, Modes.Ionian);
    const degrees = new Set<number>(PENTATONIC_MAJOR_DEGREES);
    return scale.filter((_, i) => degrees.has(i + 1));
  }
  const scale = getModeNotes(root, Modes.Aeolian);
  const degrees = new Set<number>(PENTATONIC_MINOR_DEGREES);
  return scale.filter((_, i) => degrees.has(i + 1));
};

/**
 * Returns all seven diatonic scale degrees, `[1, 2, 3, 4, 5, 6, 7]`.
 *
 * @returns The 7 diatonic scale degree numbers
 */
const getFullScaleDegrees = (): readonly number[] => FULL_SCALE_DEGREES;

/**
 * Returns the scale degree numbers for a scale type - 7 for diatonic
 * scales, 5 for pentatonic, 6 for blues, 12 for chromatic.
 *
 * @param scaleType - Scale type (see `ScaleTypes`)
 * @returns Scale degree numbers, e.g. `[1, 2, 3, 4, 5, 6]` for blues
 *
 * @example
 * getScaleDegrees("blues")
 * // → [1, 2, 3, 4, 5, 6]
 */
const getScaleDegrees = (scaleType: ScaleType): readonly number[] => {
  if (scaleType === ScaleTypes.Blues) {
    return BLUES_SEMITONE_OFFSETS.map((_, index) => index + 1);
  }
  if (scaleType === ScaleTypes.PentatonicMajor) {
    return PENTATONIC_MAJOR_DEGREES;
  }
  if (scaleType === ScaleTypes.PentatonicMinor) {
    return PENTATONIC_MINOR_DEGREES;
  }
  if (scaleType === ScaleTypes.Chromatic) {
    return CHROMATIC_NOTES.map((_, index) => index + 1);
  }
  return FULL_SCALE_DEGREES;
};

/**
 * Returns the notes of a scale by type - the general-purpose entry point
 * covering every `ScaleType` (major, chromatic, pentatonic-major,
 * pentatonic-minor, blues, harmonic-minor, melodic-minor).
 *
 * @param root - Root note
 * @param scaleType - Scale type (see `ScaleTypes`)
 * @returns The scale's notes, ascending from root - count depends on `scaleType`
 *
 * @example
 * getScaleNotes("A", "blues")
 * // → ["A", "C", "D", "D#", "E", "G"]
 */
const getScaleNotes = (root: Note, scaleType: ScaleType): Note[] => {
  const definition = SCALE_DEFINITIONS[scaleType];

  if (definition.semitoneOffsets !== undefined) {
    return notesFromSemitoneOffsets(root, definition.semitoneOffsets);
  }

  if (scaleType === ScaleTypes.HarmonicMinor) {
    return getHarmonicMinorNotes(root);
  }

  if (scaleType === ScaleTypes.PentatonicMajor) {
    const degrees = new Set<number>(PENTATONIC_MAJOR_DEGREES);
    return getModeNotes(root, Modes.Ionian).filter((_, i) =>
      degrees.has(i + 1)
    );
  }

  if (scaleType === ScaleTypes.PentatonicMinor) {
    const degrees = new Set<number>(PENTATONIC_MINOR_DEGREES);
    return getModeNotes(root, Modes.Aeolian).filter((_, i) =>
      degrees.has(i + 1)
    );
  }

  return getModeNotes(root, Modes.Ionian);
};

/**
 * Returns the scale degree (1-based position) of a note within a scale, or
 * `null` if the note is not present in that scale.
 *
 * @param root - Root note
 * @param scaleType - Scale type (see `ScaleTypes`)
 * @param note - Note to look up
 * @returns The note's 1-based scale degree, or `null` if it's not in the scale
 *
 * @example
 * getScaleDegree("C", "major", "E")
 * // → 3
 * getScaleDegree("C", "pentatonic-major", "F")
 * // → null
 */
const getScaleDegree = (
  root: Note,
  scaleType: ScaleType,
  note: Note
): number | null => {
  const scaleNotes = getScaleNotes(root, scaleType);
  const index = scaleNotes.indexOf(note);
  return index === -1 ? null : index + 1;
};

/**
 * Returns true if the note is present in the given root + scale type.
 *
 * @param root - Root note
 * @param scaleType - Scale type (see `ScaleTypes`)
 * @param note - Note to check
 * @returns `true` if `note` is in the scale
 *
 * @example
 * isNoteInScale("C", "major", "E")
 * // → true
 * isNoteInScale("C", "major", "F#")
 * // → false
 */
const isNoteInScale = (root: Note, scaleType: ScaleType, note: Note): boolean =>
  getScaleDegree(root, scaleType, note) !== null;

/**
 * Returns one `NoteDisplayInfo` entry per in-scale note, in scale-degree order.
 * Every entry includes the note name, its 1-based scale degree, and its semitone
 * offset from the root (0 = root, up to 11).
 * Consumers derive their own labels: use `note` for letter labels or
 * `String(scaleDegree)` for numeric labels.
 *
 * @param root - Root note
 * @param scaleType - Scale type (see `ScaleTypes`)
 * @returns One `{ note, scaleDegree, semitoneOffset }` entry per note in the scale
 *
 * @example
 * buildNoteMap("C", "major")
 * // → [
 * //   { note: "C", scaleDegree: 1, semitoneOffset: 0 },
 * //   { note: "D", scaleDegree: 2, semitoneOffset: 2 },
 * //   ...
 * // ]
 */
const buildNoteMap = (root: Note, scaleType: ScaleType): NoteDisplayInfo[] => {
  const rootIndex = getNoteIndex(root);
  const scaleNotes = getScaleNotes(root, scaleType);
  return scaleNotes.map((note, index) => ({
    note,
    scaleDegree: index + 1,
    semitoneOffset: (getNoteIndex(note) - rootIndex + 12) % 12,
  }));
};

export type { ScaleDefinition };

export {
  SCALE_DEFINITIONS,
  BLUES_SEMITONE_OFFSETS,
  PENTATONIC_MAJOR_DEGREES,
  PENTATONIC_MINOR_DEGREES,
  FULL_SCALE_DEGREES,
  getBluesNotes,
  getFullScaleDegrees,
  getHarmonicMinorNotes,
  getPentatonicNotes,
  getScaleDegree,
  getScaleDegrees,
  getScaleNotes,
  isNoteInScale,
  buildNoteMap,
  notesFromSemitoneOffsets,
  MELODIC_MINOR_SEMITONE_OFFSETS,
  MELODIC_MINOR_MODE_SEMITONE_OFFSETS,
  HARMONIC_MINOR_MODE_SEMITONE_OFFSETS,
  BEBOP_SCALE_SEMITONE_OFFSETS,
  getMelodicMinorNotes,
  getMelodicMinorModeNotes,
  getHarmonicMinorModeNotes,
  getBebopScaleNotes,
};

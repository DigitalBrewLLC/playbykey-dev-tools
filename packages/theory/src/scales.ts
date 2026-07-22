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

const notesFromSemitoneOffsets = (
  root: Note,
  offsets: readonly number[]
): Note[] => {
  const rootIndex = getNoteIndex(root);
  return offsets.map((offset) => noteAtIndex(rootIndex + offset));
};

const getHarmonicMinorNotes = (root: Note): Note[] => {
  const raisedIndex = HARMONIC_MINOR_RAISE_DEGREE - 1;
  const parentNotes = getModeNotes(root, HARMONIC_MINOR_PARENT_MODE);
  const naturalSeventh = elementAt(parentNotes, raisedIndex);
  return [
    ...parentNotes.slice(0, raisedIndex),
    noteAtIndex(getNoteIndex(naturalSeventh) + 1),
  ];
};

const getBluesNotes = (root: Note): Note[] =>
  notesFromSemitoneOffsets(root, BLUES_SEMITONE_OFFSETS);

/** Returns the seven notes of the ascending melodic minor scale for a root. */
const getMelodicMinorNotes = (root: Note): Note[] =>
  notesFromSemitoneOffsets(root, MELODIC_MINOR_SEMITONE_OFFSETS);

/** Returns the seven notes of a melodic minor mode for a root. */
const getMelodicMinorModeNotes = (
  root: Note,
  mode: MelodicMinorModeName
): Note[] =>
  notesFromSemitoneOffsets(root, MELODIC_MINOR_MODE_SEMITONE_OFFSETS[mode]);

/** Returns the seven notes of a harmonic minor mode for a root. Delegates to getHarmonicMinorNotes for the base scale itself, since that's the actual (non-table-based) derivation - only the true modal rotations use the offset table. */
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

/** Returns the eight notes of a bebop scale variant for a root - each is a diatonic scale plus one chromatic passing tone. */
const getBebopScaleNotes = (root: Note, type: BebopScaleType): Note[] =>
  notesFromSemitoneOffsets(root, BEBOP_SCALE_SEMITONE_OFFSETS[type]);

/**
 * Returns the five notes of a pentatonic scale rooted at `root`.
 *
 * - `'major'` - degrees 1,2,3,5,6 of the ionian (major) scale
 *   e.g. `getPentatonicNotes('C', 'major')` → `['C','D','E','G','A']`
 * - `'minor'` - degrees 1,3,4,5,7 of the aeolian (natural minor) scale
 *   e.g. `getPentatonicNotes('C', 'minor')` → `['C','D#','F','G','A#']`
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

const getFullScaleDegrees = (): readonly number[] => FULL_SCALE_DEGREES;

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
 * Returns the scale degree (1-based position) of a note within a scale, or null
 * if the note is not present in that scale.
 *
 * Example: getScaleDegree('C', 'major', 'E') => 3
 * Example: getScaleDegree('C', 'pentatonic-major', 'F') => null
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
 * Example: isNoteInScale('C', 'major', 'E') => true
 * Example: isNoteInScale('C', 'major', 'F#') => false
 */
const isNoteInScale = (root: Note, scaleType: ScaleType, note: Note): boolean =>
  getScaleDegree(root, scaleType, note) !== null;

/**
 * Returns one NoteDisplayInfo entry per in-scale note, in scale-degree order.
 * Every entry includes the note name, its 1-based scale degree, and its semitone
 * offset from the root (0 = root, up to 11).
 * Consumers derive their own labels: use `note` for letter labels or
 * `String(scaleDegree)` for numeric labels.
 *
 * Example: buildNoteMap('C', 'major') =>
 *   [{ note:'C', scaleDegree:1, semitoneOffset:0 }, { note:'D', scaleDegree:2, semitoneOffset:2 }, ...]
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

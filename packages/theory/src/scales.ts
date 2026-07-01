import {
  Modes,
  CHROMATIC_NOTES,
  ScaleTypes,
  PentatonicTypes,
} from './constants';
import { elementAt, getNoteIndex, getScaleNotes, noteAtIndex } from './engine';
import type { ModeName, Note, PentatonicType, ScaleType } from './types';

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
  const parentNotes = getScaleNotes(root, HARMONIC_MINOR_PARENT_MODE);
  const naturalSeventh = elementAt(parentNotes, raisedIndex);
  return [
    ...parentNotes.slice(0, raisedIndex),
    noteAtIndex(getNoteIndex(naturalSeventh) + 1),
  ];
};

const getBluesNotes = (root: Note): Note[] =>
  notesFromSemitoneOffsets(root, BLUES_SEMITONE_OFFSETS);

/**
 * Returns the five notes of a pentatonic scale rooted at `root`.
 *
 * - `'major'` — degrees 1,2,3,5,6 of the ionian (major) scale
 *   e.g. `getPentatonicNotes('C', 'major')` → `['C','D','E','G','A']`
 * - `'minor'` — degrees 1,3,4,5,7 of the aeolian (natural minor) scale
 *   e.g. `getPentatonicNotes('C', 'minor')` → `['C','D#','F','G','A#']`
 */
const getPentatonicNotes = (root: Note, type: PentatonicType): Note[] => {
  if (type === PentatonicTypes.Major) {
    const scale = getScaleNotes(root, Modes.Ionian);
    const degrees = new Set<number>(PENTATONIC_MAJOR_DEGREES);
    return scale.filter((_, i) => degrees.has(i + 1));
  }
  const scale = getScaleNotes(root, Modes.Aeolian);
  const degrees = new Set<number>(PENTATONIC_MINOR_DEGREES);
  return scale.filter((_, i) => degrees.has(i + 1));
};

const getFullScaleDegrees = (): readonly number[] => FULL_SCALE_DEGREES;

const getScaleEmphasisDegrees = (scaleType: ScaleType): readonly number[] => {
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

const getDerivedScaleNotes = (root: Note, scaleType: ScaleType): Note[] => {
  const definition = SCALE_DEFINITIONS[scaleType];

  if (definition.semitoneOffsets !== undefined) {
    return notesFromSemitoneOffsets(root, definition.semitoneOffsets);
  }

  if (scaleType === ScaleTypes.HarmonicMinor) {
    return getHarmonicMinorNotes(root);
  }

  if (scaleType === ScaleTypes.PentatonicMajor) {
    const degrees = new Set<number>(PENTATONIC_MAJOR_DEGREES);
    return getScaleNotes(root, Modes.Ionian).filter((_, i) =>
      degrees.has(i + 1)
    );
  }

  if (scaleType === ScaleTypes.PentatonicMinor) {
    const degrees = new Set<number>(PENTATONIC_MINOR_DEGREES);
    return getScaleNotes(root, Modes.Aeolian).filter((_, i) =>
      degrees.has(i + 1)
    );
  }

  return getScaleNotes(root, Modes.Ionian);
};

const getScaleContextNotes = (root: Note, scaleType: ScaleType): Note[] => {
  if (scaleType === ScaleTypes.Chromatic) {
    return [...CHROMATIC_NOTES];
  }
  if (scaleType === ScaleTypes.Blues) {
    return getScaleNotes(root, Modes.Aeolian);
  }
  if (scaleType === ScaleTypes.HarmonicMinor) {
    return getHarmonicMinorNotes(root);
  }
  if (scaleType === ScaleTypes.PentatonicMajor) {
    return getScaleNotes(root, Modes.Ionian);
  }
  if (scaleType === ScaleTypes.PentatonicMinor) {
    return getScaleNotes(root, Modes.Aeolian);
  }
  return getScaleNotes(root, Modes.Ionian);
};

export type { ScaleDefinition };

export {
  SCALE_DEFINITIONS,
  BLUES_SEMITONE_OFFSETS,
  PENTATONIC_MAJOR_DEGREES,
  PENTATONIC_MINOR_DEGREES,
  FULL_SCALE_DEGREES,
  getBluesNotes,
  getDerivedScaleNotes,
  getFullScaleDegrees,
  getHarmonicMinorNotes,
  getPentatonicNotes,
  getScaleContextNotes,
  getScaleEmphasisDegrees,
  notesFromSemitoneOffsets,
};

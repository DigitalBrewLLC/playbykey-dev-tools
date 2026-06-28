import { Modes, CHROMATIC_NOTES, ScaleTypes } from './constants';
import { elementAt, getNoteIndex, getScaleNotes, noteAtIndex } from './engine';
import type { ModeName, Note, ScaleType } from './types';

/** Semitone offsets from the tonic for the six-note blues scale. */
const BLUES_SEMITONE_OFFSETS = [0, 3, 5, 6, 7, 10] as const;

/** Scale degrees included in major and minor pentatonic subsets. */
const PENTATONIC_DEGREES = [1, 2, 3, 5, 6] as const;

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
  pentatonicSubset?: boolean;
}

const SCALE_DEFINITIONS: Record<ScaleType, ScaleDefinition> = {
  [ScaleTypes.Mode]: {
    label: 'Mode scale',
  },
  [ScaleTypes.Chromatic]: {
    label: 'Chromatic scale',
    semitoneOffsets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  [ScaleTypes.Pentatonic]: {
    label: 'Pentatonic scale',
    pentatonicSubset: true,
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

const getPentatonicDegrees = (): readonly number[] => PENTATONIC_DEGREES;

const getFullScaleDegrees = (): readonly number[] => FULL_SCALE_DEGREES;

const getScaleEmphasisDegrees = (scaleType: ScaleType): readonly number[] => {
  if (scaleType === ScaleTypes.Blues) {
    return BLUES_SEMITONE_OFFSETS.map((_, index) => index + 1);
  }
  if (scaleType === ScaleTypes.Pentatonic) {
    return PENTATONIC_DEGREES;
  }
  if (scaleType === ScaleTypes.Chromatic) {
    return CHROMATIC_NOTES.map((_, index) => index + 1);
  }
  return FULL_SCALE_DEGREES;
};

/**
 * Returns the pitch classes that define a scale type from a root (and mode when
 * the scale is mode-relative, e.g. diatonic or pentatonic subset).
 */
const getDerivedScaleNotes = (
  root: Note,
  mode: ModeName,
  scaleType: ScaleType
): Note[] => {
  const definition = SCALE_DEFINITIONS[scaleType];

  if (definition.semitoneOffsets !== undefined) {
    return notesFromSemitoneOffsets(root, definition.semitoneOffsets);
  }

  if (scaleType === ScaleTypes.HarmonicMinor) {
    return getHarmonicMinorNotes(root);
  }

  if (definition.pentatonicSubset === true) {
    const pentDegrees = new Set<number>(PENTATONIC_DEGREES);
    return getScaleNotes(root, mode).filter((_, index) =>
      pentDegrees.has(index + 1)
    );
  }

  return getScaleNotes(root, mode);
};

/**
 * Returns the wider note set used as harmonic context around a scale type
 * (e.g. aeolian for blues, parent mode for pentatonic).
 */
const getScaleContextNotes = (
  root: Note,
  mode: ModeName,
  scaleType: ScaleType
): Note[] => {
  if (scaleType === ScaleTypes.Chromatic) {
    return [...CHROMATIC_NOTES];
  }
  if (scaleType === ScaleTypes.Blues) {
    return getScaleNotes(root, Modes.Aeolian);
  }
  if (scaleType === ScaleTypes.HarmonicMinor) {
    return getHarmonicMinorNotes(root);
  }
  return getScaleNotes(root, mode);
};

export type { ScaleDefinition };

export {
  SCALE_DEFINITIONS,
  BLUES_SEMITONE_OFFSETS,
  PENTATONIC_DEGREES,
  FULL_SCALE_DEGREES,
  getBluesNotes,
  getDerivedScaleNotes,
  getFullScaleDegrees,
  getHarmonicMinorNotes,
  getPentatonicDegrees,
  getScaleContextNotes,
  getScaleEmphasisDegrees,
  notesFromSemitoneOffsets,
};

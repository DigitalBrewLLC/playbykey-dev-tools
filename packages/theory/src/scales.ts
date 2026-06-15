import { MODE_IDS, NOTES } from './constants';
import { getNoteIndex, getScaleNotes, noteAtIndex } from './engine';
import type { ModeName, Note, ScaleKind } from './types';

/** Semitone offsets from the tonic for the six-note blues scale. */
const BLUES_SEMITONE_OFFSETS = [0, 3, 5, 6, 7, 10] as const;

/** Scale degrees included in major and minor pentatonic subsets. */
const PENTATONIC_DEGREES = [1, 2, 3, 5, 6] as const;

/** All seven diatonic scale degrees. */
const FULL_SCALE_DEGREES = [1, 2, 3, 4, 5, 6, 7] as const;

interface ScaleDefinition {
  label: string;
  semitoneOffsets?: readonly number[];
  parentMode?: ModeName;
  raiseDegree?: number;
  pentatonicSubset?: boolean;
}

const SCALE_DEFINITIONS: Record<ScaleKind, ScaleDefinition> = {
  mode: {
    label: 'Mode scale',
  },
  chromatic: {
    label: 'Chromatic scale',
    semitoneOffsets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  pentatonic: {
    label: 'Pentatonic scale',
    pentatonicSubset: true,
  },
  blues: {
    label: 'Blues scale',
    semitoneOffsets: BLUES_SEMITONE_OFFSETS,
  },
  'harmonic-minor': {
    label: 'Harmonic minor scale',
    parentMode: MODE_IDS.AEOLIAN,
    raiseDegree: 7,
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
  const definition = SCALE_DEFINITIONS['harmonic-minor'];
  const parentMode = definition.parentMode ?? MODE_IDS.AEOLIAN;
  const parentNotes = getScaleNotes(root, parentMode);
  const raiseDegree = definition.raiseDegree ?? 7;
  const raisedIndex = raiseDegree - 1;
  const naturalSeventh = parentNotes[raisedIndex];

  if (naturalSeventh === undefined) {
    return parentNotes;
  }

  return [
    ...parentNotes.slice(0, raisedIndex),
    noteAtIndex(getNoteIndex(naturalSeventh) + 1),
  ];
};

const getBluesNotes = (root: Note): Note[] => {
  const offsets = SCALE_DEFINITIONS.blues.semitoneOffsets;
  if (offsets === undefined) {
    return [];
  }
  return notesFromSemitoneOffsets(root, offsets);
};

const getPentatonicDegrees = (): readonly number[] => PENTATONIC_DEGREES;

const getFullScaleDegrees = (): readonly number[] => FULL_SCALE_DEGREES;

const getScaleEmphasisDegrees = (scaleKind: ScaleKind): readonly number[] => {
  if (scaleKind === 'blues') {
    return BLUES_SEMITONE_OFFSETS.map((_, index) => index + 1);
  }
  if (scaleKind === 'pentatonic') {
    return PENTATONIC_DEGREES;
  }
  if (scaleKind === 'chromatic') {
    return NOTES.map((_, index) => index + 1);
  }
  return FULL_SCALE_DEGREES;
};

/**
 * Returns the pitch classes that define a scale kind from a root (and mode when
 * the scale is mode-relative, e.g. diatonic or pentatonic subset).
 */
const getDerivedScaleNotes = (
  root: Note,
  mode: ModeName,
  scaleKind: ScaleKind
): Note[] => {
  const definition = SCALE_DEFINITIONS[scaleKind];

  if (definition.semitoneOffsets !== undefined) {
    return notesFromSemitoneOffsets(root, definition.semitoneOffsets);
  }

  if (scaleKind === 'harmonic-minor') {
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
 * Returns the wider note set used as keyboard/strip context behind a scale kind
 * (e.g. aeolian for blues, parent mode for pentatonic).
 */
const getKeyboardContextNotes = (
  root: Note,
  mode: ModeName,
  scaleKind: ScaleKind
): Note[] => {
  if (scaleKind === 'chromatic') {
    return [...NOTES];
  }
  if (scaleKind === 'blues') {
    return getScaleNotes(root, MODE_IDS.AEOLIAN);
  }
  if (scaleKind === 'harmonic-minor') {
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
  getKeyboardContextNotes,
  getPentatonicDegrees,
  getScaleEmphasisDegrees,
  notesFromSemitoneOffsets,
};

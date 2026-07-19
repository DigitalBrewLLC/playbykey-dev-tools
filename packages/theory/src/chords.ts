import { ChordTypes, Modes } from './constants';
import { elementAt, getModeNotes, getSemitoneDistance } from './engine';
import { notesFromSemitoneOffsets } from './scales';
import type { Chord, ChordInversion, ChordType, ModeName, Note } from './types';

interface ChordDefinition {
  label: string;
  semitoneOffsets: readonly number[];
}

const CHORD_DEFINITIONS: Record<ChordType, ChordDefinition> = {
  [ChordTypes.MajorTriad]: { label: 'Major triad', semitoneOffsets: [0, 4, 7] },
  [ChordTypes.MinorTriad]: { label: 'Minor triad', semitoneOffsets: [0, 3, 7] },
  [ChordTypes.DiminishedTriad]: {
    label: 'Diminished triad',
    semitoneOffsets: [0, 3, 6],
  },
  [ChordTypes.AugmentedTriad]: {
    label: 'Augmented triad',
    semitoneOffsets: [0, 4, 8],
  },
  [ChordTypes.Major7th]: {
    label: 'Major 7th chord',
    semitoneOffsets: [0, 4, 7, 11],
  },
  [ChordTypes.Minor7th]: {
    label: 'Minor 7th chord',
    semitoneOffsets: [0, 3, 7, 10],
  },
  [ChordTypes.Dominant7th]: {
    label: 'Dominant 7th chord',
    semitoneOffsets: [0, 4, 7, 10],
  },
  [ChordTypes.Major6th]: {
    label: 'Major 6th chord',
    semitoneOffsets: [0, 4, 7, 9],
  },
  [ChordTypes.Minor6th]: {
    label: 'Minor 6th chord',
    semitoneOffsets: [0, 3, 7, 9],
  },
  [ChordTypes.Major9th]: {
    label: 'Major 9th chord',
    semitoneOffsets: [0, 4, 7, 11, 14],
  },
  [ChordTypes.Minor9th]: {
    label: 'Minor 9th chord',
    semitoneOffsets: [0, 3, 7, 10, 14],
  },
};

/** Returns the notes of a chord type built on root. */
const getChordNotes = (root: Note, chordType: ChordType): Note[] =>
  notesFromSemitoneOffsets(root, CHORD_DEFINITIONS[chordType].semitoneOffsets);

/** Returns the number of valid inversions for a chord type (its note count) as an array [0, 1, ..., N-1]. */
const getAvailableInversions = (
  chordType: ChordType
): readonly ChordInversion[] => {
  const noteCount = CHORD_DEFINITIONS[chordType].semitoneOffsets.length;
  return Array.from(
    { length: noteCount },
    (_, index) => index
  ) as readonly ChordInversion[];
};

/** Reorders a chord's notes so the given inversion's chord tone is lowest (first in the array). Throws if the inversion is out of range for this chord's note count. */
const getChordInversion = (chord: Chord, inversion: ChordInversion): Note[] => {
  const notes = getChordNotes(chord.root, chord.type);
  const validInversions = getAvailableInversions(chord.type);
  if (!validInversions.includes(inversion)) {
    throw new RangeError(
      `Inversion ${inversion} is out of range for chord type "${chord.type}" (valid: ${validInversions.join(', ')})`
    );
  }
  return [...notes.slice(inversion), ...notes.slice(0, inversion)];
};

/** The 4 triad ChordTypes - classifyTriadType only ever matches against these, never the 7th/6th/9th shapes also defined in CHORD_DEFINITIONS. */
const TRIAD_TYPES: readonly ChordType[] = [
  ChordTypes.MajorTriad,
  ChordTypes.MinorTriad,
  ChordTypes.DiminishedTriad,
  ChordTypes.AugmentedTriad,
];

/**
 * Identifies which triad shape (root, third, fifth) forms, by computing each
 * note's semitone offset from the root and matching against CHORD_DEFINITIONS'
 * existing offset arrays for the 4 triad types - the same table getChordNotes
 * already uses, not a second, independently-maintained classification table.
 * Throws if no triad shape matches (should not happen for the 7 major-scale
 * modes; see the note on getDiatonicChords below).
 */
const classifyTriadType = (root: Note, third: Note, fifth: Note): ChordType => {
  const offsets = [
    0,
    getSemitoneDistance(root, third),
    getSemitoneDistance(root, fifth),
  ];
  const match = TRIAD_TYPES.find((type) => {
    const definitionOffsets = CHORD_DEFINITIONS[type].semitoneOffsets;
    return (
      definitionOffsets.length === offsets.length &&
      definitionOffsets.every((offset, i) => offset === offsets[i])
    );
  });
  if (match === undefined) {
    throw new RangeError(
      `No triad type matches offsets [${offsets.join(', ')}] for root ${root}`
    );
  }
  return match;
};

/**
 * Returns the 7 diatonic triads for a key/mode, one per scale degree, in
 * degree order. Defaults to Ionian (major).
 *
 * Algorithm: for each of the 7 scale degrees, build a triad by stacking the
 * scale note at that degree, the scale note two positions later (wrapping
 * within the 7-note scale array), and the scale note four positions later
 * (also wrapping), then identify which triad shape those 3 notes form via
 * classifyTriadType. Only major/minor/diminished triads actually occur across
 * the 7 major-scale modes; augmented is matched too since CHORD_DEFINITIONS
 * already defines it, so the classification stays correct if this is ever
 * called against a scale where it occurs.
 */
const getDiatonicChords = (
  root: Note,
  mode: ModeName = Modes.Ionian
): Chord[] => {
  const scaleNotes = getModeNotes(root, mode);
  return scaleNotes.map((degreeRoot, degreeIndex) => {
    const third = elementAt(scaleNotes, (degreeIndex + 2) % 7);
    const fifth = elementAt(scaleNotes, (degreeIndex + 4) % 7);
    const type = classifyTriadType(degreeRoot, third, fifth);
    return { root: degreeRoot, type };
  });
};

/** Returns the chord at a specific scale degree - a single-item version of getDiatonicChords. Degree is 1-7. Defaults to Ionian (major). */
const getChordByDegree = (
  degree: number,
  root: Note,
  mode: ModeName = Modes.Ionian
): Chord => {
  const diatonicChords = getDiatonicChords(root, mode);
  const chord = diatonicChords[degree - 1];
  if (chord === undefined) {
    throw new RangeError(`Degree ${degree} is out of range (expected 1-7)`);
  }
  return chord;
};

export type { ChordDefinition };
export {
  CHORD_DEFINITIONS,
  getChordNotes,
  getDiatonicChords,
  getChordByDegree,
  getAvailableInversions,
  getChordInversion,
};

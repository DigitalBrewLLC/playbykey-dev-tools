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
  [ChordTypes.Diminished7th]: {
    label: 'Diminished 7th chord',
    semitoneOffsets: [0, 3, 6, 9],
  },
  [ChordTypes.HalfDiminished7th]: {
    label: 'Half-diminished 7th chord',
    semitoneOffsets: [0, 3, 6, 10],
  },
  [ChordTypes.Dominant9th]: {
    label: 'Dominant 9th chord',
    semitoneOffsets: [0, 4, 7, 10, 14],
  },
  [ChordTypes.Sus2]: {
    label: 'Suspended 2nd chord',
    semitoneOffsets: [0, 2, 7],
  },
  [ChordTypes.Sus4]: {
    label: 'Suspended 4th chord',
    semitoneOffsets: [0, 5, 7],
  },
  [ChordTypes.Major11th]: {
    label: 'Major 11th chord',
    semitoneOffsets: [0, 4, 7, 11, 14, 17],
  },
  [ChordTypes.Minor11th]: {
    label: 'Minor 11th chord',
    semitoneOffsets: [0, 3, 7, 10, 14, 17],
  },
  [ChordTypes.Dominant11th]: {
    label: 'Dominant 11th chord',
    semitoneOffsets: [0, 4, 7, 10, 14, 17],
  },
  [ChordTypes.Major13th]: {
    label: 'Major 13th chord',
    semitoneOffsets: [0, 4, 7, 11, 14, 17, 21],
  },
  [ChordTypes.Minor13th]: {
    label: 'Minor 13th chord',
    semitoneOffsets: [0, 3, 7, 10, 14, 17, 21],
  },
  [ChordTypes.Dominant13th]: {
    label: 'Dominant 13th chord',
    semitoneOffsets: [0, 4, 7, 10, 14, 17, 21],
  },
};

/**
 * Returns the notes of a chord type built on root.
 *
 * @param root - Root note, sharps-only chromatic spelling (e.g. `"C"`, `"F#"`)
 * @param chordType - One of the 22 supported chord types (see `ChordTypes`),
 *   e.g. `"major-triad"`, `"dominant-9th"`, `"minor-13th"`
 * @returns The chord's notes in stacked order, root first
 *
 * @example
 * getChordNotes("C", "major-triad")
 * // → ["C", "E", "G"]
 */
const getChordNotes = (root: Note, chordType: ChordType): Note[] =>
  notesFromSemitoneOffsets(root, CHORD_DEFINITIONS[chordType].semitoneOffsets);

/**
 * Returns the valid inversion numbers for a chord type - always `[0, 1, ..., N-1]`
 * where N is that chord type's note count (3 for a triad, up to 7 for a 13th chord).
 *
 * @param chordType - One of the 22 supported chord types
 * @returns Every valid inversion number for that chord type, ascending from 0 (root position)
 *
 * @example
 * getAvailableInversions("major-triad")
 * // → [0, 1, 2]
 * getAvailableInversions("major-13th")
 * // → [0, 1, 2, 3, 4, 5, 6]
 */
const getAvailableInversions = (
  chordType: ChordType
): readonly ChordInversion[] => {
  const noteCount = CHORD_DEFINITIONS[chordType].semitoneOffsets.length;
  return Array.from(
    { length: noteCount },
    (_, index) => index
  ) as readonly ChordInversion[];
};

/**
 * Reorders a chord's notes so the given inversion's chord tone is lowest (first in the array).
 *
 * @param chord - The chord to invert, `{ root, type }`
 * @param inversion - Which chord tone to put in the bass (0 = root position). Must be
 *   in range for `chord.type`'s actual note count - a triad only has 0-2 valid even
 *   though `ChordInversion` itself covers 0-6, the widest range across all chord types
 * @returns The chord's notes, rotated so the requested tone is first
 * @throws {RangeError} if `inversion` is out of range for `chord.type`'s note count -
 *   use `getAvailableInversions(chord.type)` to check first if the range isn't known
 *
 * @example
 * getChordInversion({ root: "C", type: "major-triad" }, 1)
 * // → ["E", "G", "C"]
 */
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

/**
 * The 4 triad ChordTypes - classifyTriadType only ever matches against these,
 * never the 7th/6th/9th shapes also defined in CHORD_DEFINITIONS. Augmented
 * is included even though none of the 7 major-scale modes ever produce one
 * (so that branch has no current caller and no test can reach it) - kept
 * intentionally so classification stays correct if this is ever called
 * against a scale where it does occur, not left in by oversight.
 */
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
 * Returns the 7 diatonic triads for a key/mode, one per scale degree, in degree order.
 *
 * Algorithm: for each of the 7 scale degrees, build a triad by stacking the
 * scale note at that degree, the scale note two positions later (wrapping
 * within the 7-note scale array), and the scale note four positions later
 * (also wrapping), then identify which triad shape those 3 notes form via
 * classifyTriadType. Only major/minor/diminished triads actually occur across
 * the 7 major-scale modes; augmented is matched too since CHORD_DEFINITIONS
 * already defines it, so the classification stays correct if this is ever
 * called against a scale where it occurs.
 *
 * @param root - Root of the key
 * @param mode - Diatonic mode name (e.g. `"ionian"`, `"dorian"`) - defaults to `"ionian"` (major)
 * @returns 7 chords in scale-degree order (index 0 = degree 1/tonic), each `{ root, type }`
 *
 * @example
 * getDiatonicChords("C", "ionian")
 * // → [
 * //   { root: "C", type: "major-triad" },
 * //   { root: "D", type: "minor-triad" },
 * //   { root: "E", type: "minor-triad" },
 * //   { root: "F", type: "major-triad" },
 * //   { root: "G", type: "major-triad" },
 * //   { root: "A", type: "minor-triad" },
 * //   { root: "B", type: "diminished-triad" },
 * // ]
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

/**
 * Returns the chord at a specific scale degree - a single-item version of `getDiatonicChords`.
 *
 * @param degree - Scale degree, 1-7 (1 = tonic)
 * @param root - Root of the key
 * @param mode - Diatonic mode name - defaults to `"ionian"` (major)
 * @returns The chord at that degree, `{ root, type }`
 * @throws {RangeError} if `degree` is outside 1-7
 *
 * @example
 * getChordByDegree(5, "C", "ionian")
 * // → { root: "G", type: "major-triad" }
 */
const getChordByDegree = (
  degree: number,
  root: Note,
  mode: ModeName = Modes.Ionian
): Chord => {
  const diatonicChords = getDiatonicChords(root, mode);
  try {
    return elementAt(diatonicChords, degree - 1);
  } catch {
    throw new RangeError(`Degree ${degree} is out of range (expected 1-7)`);
  }
};

const CHORD_TYPES = Object.values(ChordTypes);

/**
 * Identifies every chord (root, type) reading of a set of notes (any order,
 * duplicates ignored) - keyed by root, with every matching chord type for
 * that root as an array (today, no root ever matches more than one type
 * for the same note set - verified against the full 22-entry dictionary,
 * no two chord types share an identical shape - but the shape doesn't
 * assume that stays true forever). Each candidate root is checked for an
 * exact match against a complete CHORD_DEFINITIONS shape - no
 * closest/partial match, since inferring from an incomplete note set is
 * generation from partial input (paid, Harmony API), not describing a
 * complete object. Returns `{}` if no root matches anything.
 *
 * Many note sets legitimately have more than one valid root: symmetric
 * shapes have multiple valid roots for the same type (augmented-triad,
 * diminished-7th), and distinct types can share an identical note set at
 * different roots (minor-7th / major-6th, sus2 / sus4, and every
 * 13th-chord type, since a full 7-note stack is just the parent scale's
 * note collection under a different modal name) - all of these come back
 * as separate entries, not collapsed to one. Choosing among them is the
 * caller's job (e.g. using musical context this function doesn't have).
 *
 * Offsets are compared mod 12: `notes` is pitch-class only (no octave/
 * register), so a 9th and a 2nd are the same input value - CHORD_DEFINITIONS'
 * semitoneOffsets for 9th/11th/13th chords intentionally use raw values past
 * 11 (14, 17, 21) to distinguish "extended" tones for display/voicing
 * purposes, but that distinction doesn't exist in a bare pitch-class set and
 * must be collapsed before matching.
 *
 * @param notes - Notes to identify (any order, duplicates ignored)
 * @returns Every matching `{ root: chordType[] }` reading, or `{}` if nothing matches
 *
 * @example
 * detectChords(["E", "C", "G"])
 * // → { C: ["major-triad"] }
 *
 * @example
 * // Symmetric chords have multiple valid roots for the identical notes
 * detectChords(["C", "D#", "F#", "A"])
 * // → { C: ["diminished-7th"], "D#": ["diminished-7th"], "F#": ["diminished-7th"], A: ["diminished-7th"] }
 */
const detectChords = (
  notes: readonly Note[]
): Partial<Record<Note, ChordType[]>> => {
  const uniqueNotes = [...new Set(notes)];
  const matches: Partial<Record<Note, ChordType[]>> = {};
  for (const candidateRoot of uniqueNotes) {
    const offsets = uniqueNotes
      .map((note) => getSemitoneDistance(candidateRoot, note))
      .sort((a, b) => a - b);
    const rootMatches = CHORD_TYPES.filter((type) => {
      const definitionOffsets = [...CHORD_DEFINITIONS[type].semitoneOffsets]
        .map((offset) => offset % 12)
        .sort((a, b) => a - b);
      return (
        definitionOffsets.length === offsets.length &&
        definitionOffsets.every((offset, i) => offset === offsets[i])
      );
    });
    if (rootMatches.length > 0) {
      matches[candidateRoot] = rootMatches;
    }
  }
  return matches;
};

export type { ChordDefinition };
export {
  CHORD_DEFINITIONS,
  getChordNotes,
  getDiatonicChords,
  getChordByDegree,
  getAvailableInversions,
  getChordInversion,
  detectChords,
};

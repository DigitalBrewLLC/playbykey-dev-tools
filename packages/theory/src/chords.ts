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
 * Returns every valid value for a chord type's `inversion` parameter (see
 * `getChordInversion`) - 0 is root position, not itself an inversion; 1
 * and up are 1st inversion, 2nd inversion, and so on. A triad allows 0-2
 * (root position plus 2 inversions); a 13th chord allows 0-6 (root
 * position plus 6 inversions).
 *
 * @param chordType - One of the 22 supported chord types
 * @returns Every valid `inversion` value for that chord type, starting at 0 (root position)
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
 * @param inversion - Which chord tone to put in the bass (0 = root position).
 *   Must be in range for `chord.type`'s actual note count - a triad only goes
 *   up to 2, even though `ChordInversion` covers 0-6
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
 * The 4 triad types classifyTriadType matches against, never the 7th/6th/9th
 * shapes CHORD_DEFINITIONS also holds. Augmented is included even though no
 * major-scale mode produces one, kept for correctness if this is ever called
 * against a scale where it does.
 */
const TRIAD_TYPES: readonly ChordType[] = [
  ChordTypes.MajorTriad,
  ChordTypes.MinorTriad,
  ChordTypes.DiminishedTriad,
  ChordTypes.AugmentedTriad,
];

/**
 * Identifies a triad shape from root/third/fifth by matching semitone offsets
 * against CHORD_DEFINITIONS - the same table getChordNotes uses, not a second
 * classification table. Throws if nothing matches, which shouldn't happen for
 * the 7 major-scale modes.
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
 * Builds each degree's triad from the scale notes two and four positions
 * later (wrapping within the 7-note scale), then classifies the shape via
 * classifyTriadType. Augmented is matched even though the 7 major-scale
 * modes never produce one, since CHORD_DEFINITIONS already defines it.
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
 * Identifies every chord (root, type) match for a set of notes, keyed by
 * root - each value is that root's matching types. Exact match only; omits
 * a root rather than guessing, and returns `{}` if nothing matches.
 *
 * Multiple valid roots are common: symmetric chords (augmented-triad,
 * diminished-7th), minor-7th/major-6th overlap, and the whole 13th-chord
 * family all produce more than one entry.
 *
 * Offsets are compared mod 12: notes are pitch-class only, so 9th/11th/
 * 13th chords' extended-tone offsets (14, 17, 21) must collapse to their
 * pitch class before matching.
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
      // Not deduplicated after mod 12 - safe today since no definition's
      // offsets collide post-modulo, but a future chord type that does
      // collide would silently stop matching here instead of erroring.
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

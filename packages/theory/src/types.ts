/**
 * Core music theory domain types shared across all features.
 */

/**
 * The 12 chromatic notes using sharps only.
 *
 * Flats are intentionally excluded. The entire engine (chromatic indexing,
 * scale computation, NOTES array) depends on this fixed 12-element set.
 * For display purposes, `ENHARMONIC_LABELS` maps the 5 black-key notes to
 * their combined sharp/flat label (e.g. `'C#': 'Db/C#'`). A function that
 * returns a flat-spelled note (e.g. `Db`) cannot exist without extending
 * this type - which would be a cross-cutting breaking change.
 */
type Note =
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'A'
  | 'A#'
  | 'B';

/** The 7 modes of the major scale, ordered by brightness (Ionian = brightest). */
type ModeName =
  | 'ionian'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'aeolian'
  | 'locrian';

/** Interval identifiers used in the interval catalog. */
type IntervalId =
  | 'half_step'
  | 'whole_step'
  | 'minor_2nd'
  | 'major_2nd'
  | 'minor_3rd'
  | 'major_3rd'
  | 'perfect_4th'
  | 'tritone'
  | 'perfect_5th'
  | 'minor_6th'
  | 'major_6th'
  | 'minor_7th'
  | 'major_7th'
  | 'octave';

/** Scale types supported by the scale-derivation functions. */
type ScaleType =
  | 'major'
  | 'chromatic'
  | 'pentatonic-major'
  | 'pentatonic-minor'
  | 'blues'
  | 'harmonic-minor';

/** Pentatonic variant: major (degrees 1,2,3,5,6 of ionian) or minor (degrees 1,3,4,5,7 of aeolian). */
type PentatonicType = 'pentatonic-major' | 'pentatonic-minor';

/** Scale degree notation: numbers (1-7) or letter names (C, D, E...). */
type NotationType = 'number' | 'letter';

/** Accidental display preference: sharp names (C#), flat names (Db), or both (Db/C#). */
type AccidentalType = 'sharp' | 'flat' | 'both';

/** Key-signature quality: major or (natural) minor. Determines which relative key's accidental count is returned. */
type KeyQuality = 'major' | 'minor';

/** The 5 flat-spelled accidental notes accepted as input, alongside their canonical sharp equivalents. */
type FlatNote = 'Db' | 'Eb' | 'Gb' | 'Ab' | 'Bb';

/** Display metadata for a mode. */
interface ModeInfo {
  id: ModeName;
  name: string;
  scaleDegree: number;
  character: string;
}

/** Chord type - quality plus any added-interval extension. */
type ChordType =
  | 'major-triad'
  | 'minor-triad'
  | 'diminished-triad'
  | 'augmented-triad'
  | 'major-7th'
  | 'minor-7th'
  | 'dominant-7th'
  | 'major-6th'
  | 'minor-6th'
  | 'major-9th'
  | 'minor-9th';

/** A chord: root note plus its type. Notes are derived via getChordNotes, not stored. */
interface Chord {
  root: Note;
  type: ChordType;
}

/**
 * Chord inversion - which chord tone is in the bass. 0 = root position.
 * The valid range depends on the chord type (a triad has 3 valid inversions,
 * 0-2; a 9th chord has 5, 0-4) - this type covers the maximum range across
 * all chord types (0-4). Runtime validation against the actual valid range
 * for a given chord type happens in the chords module, not via this type alone.
 */
type ChordInversion = 0 | 1 | 2 | 3 | 4;

/** Catalog identifier for a fixed, named progression - extend as the catalog grows. */
type ProgressionId =
  | 'I-V-vi-IV'
  | 'ii-V-I'
  | 'I-IV-V'
  | 'vi-IV-I-V'
  | '12-bar-blues';

/** Computed display data for a single in-scale note, consumed by all visualization views. */
interface NoteDisplayInfo {
  note: Note;
  scaleDegree: number;
  semitoneOffset: number;
}

export type {
  Note,
  ModeName,
  IntervalId,
  ScaleType,
  PentatonicType,
  NotationType,
  AccidentalType,
  KeyQuality,
  FlatNote,
  ModeInfo,
  NoteDisplayInfo,
  ChordType,
  Chord,
  ChordInversion,
  ProgressionId,
};

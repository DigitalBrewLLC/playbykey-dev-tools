/**
 * Core music theory domain types shared across all features.
 */

/** The 12 chromatic notes using sharps (no flats/enharmonics). */
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

/** Scale kinds supported by the scale-derivation functions. */
type ScaleKind =
  | 'mode'
  | 'chromatic'
  | 'pentatonic'
  | 'blues'
  | 'harmonic-minor';

/** Scale degree notation: numbers (1-7) or letter names (C, D, E...). */
type NotationType = 'number' | 'letter';

/** Accidental display preference: sharp names (C#), flat names (Db), or both (Db/C#). */
type AccidentalType = 'sharp' | 'flat' | 'both';

/** Display metadata for a mode. */
interface ModeInfo {
  id: ModeName;
  name: string;
  scaleDegree: number;
  character: string;
}

/** Computed display data for a single chromatic note, consumed by all visualization views. */
interface NoteDisplayInfo {
  note: Note;
  inScale: boolean;
  scaleDegree: number | null;
  label: string;
  isRoot: boolean;
}

export type {
  Note,
  ModeName,
  IntervalId,
  ScaleKind,
  NotationType,
  AccidentalType,
  ModeInfo,
  NoteDisplayInfo,
};

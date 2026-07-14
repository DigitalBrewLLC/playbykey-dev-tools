import type {
  Note,
  ModeInfo,
  ModeName,
  NotationType,
  IntervalId,
  ScaleType,
  AccidentalType,
  PentatonicType,
  KeyQuality,
  FlatNote,
} from './types';

/** All 12 chromatic notes with dot-notation access. Sharp notes use CSharp/DSharp style. */
const Notes = {
  C: 'C',
  CSharp: 'C#',
  D: 'D',
  DSharp: 'D#',
  E: 'E',
  F: 'F',
  FSharp: 'F#',
  G: 'G',
  GSharp: 'G#',
  A: 'A',
  ASharp: 'A#',
  B: 'B',
} as const satisfies Record<string, Note>;

/** All 12 chromatic notes in ascending order from C. */
const CHROMATIC_NOTES: readonly Note[] = Object.values(
  Notes
) as readonly Note[];

/** Named constants for each notation display type. */
const Notations = {
  Letter: 'letter',
  Number: 'number',
} as const satisfies Record<string, NotationType>;

/** Named constants for each diatonic mode. */
const Modes = {
  Ionian: 'ionian',
  Dorian: 'dorian',
  Phrygian: 'phrygian',
  Lydian: 'lydian',
  Mixolydian: 'mixolydian',
  Aeolian: 'aeolian',
  Locrian: 'locrian',
} as const satisfies Record<string, ModeName>;

/** Named constants for each musical interval. */
const Intervals = {
  HalfStep: 'half_step',
  WholeStep: 'whole_step',
  Minor2nd: 'minor_2nd',
  Major2nd: 'major_2nd',
  Minor3rd: 'minor_3rd',
  Major3rd: 'major_3rd',
  Perfect4th: 'perfect_4th',
  Tritone: 'tritone',
  Perfect5th: 'perfect_5th',
  Minor6th: 'minor_6th',
  Major6th: 'major_6th',
  Minor7th: 'minor_7th',
  Major7th: 'major_7th',
  Octave: 'octave',
} as const satisfies Record<string, IntervalId>;

/** Named constants for each derived scale type. */
const ScaleTypes = {
  Major: 'major',
  Chromatic: 'chromatic',
  PentatonicMajor: 'pentatonic-major',
  PentatonicMinor: 'pentatonic-minor',
  Blues: 'blues',
  HarmonicMinor: 'harmonic-minor',
} as const satisfies Record<string, ScaleType>;

/** Named constants for pentatonic types. */
const PentatonicTypes = {
  Major: 'pentatonic-major',
  Minor: 'pentatonic-minor',
} as const satisfies Record<string, PentatonicType>;

/** Named constants for each accidental display preference. */
const Accidentals = {
  Sharp: 'sharp',
  Flat: 'flat',
  Both: 'both',
} as const satisfies Record<string, AccidentalType>;

/** Named constants for each key-signature quality. */
const KeyQualities = {
  Major: 'major',
  Minor: 'minor',
} as const satisfies Record<string, KeyQuality>;

/** Named constants for each flat-spelled accidental note accepted as input. */
const FlatNotes = {
  DFlat: 'Db',
  EFlat: 'Eb',
  GFlat: 'Gb',
  AFlat: 'Ab',
  BFlat: 'Bb',
} as const satisfies Record<string, FlatNote>;

/** All 7 modes with display names, scale degrees, and characteristic descriptions. */
const MODES: readonly ModeInfo[] = [
  {
    id: Modes.Ionian,
    name: 'Ionian',
    scaleDegree: 1,
    character: 'Bright and resolved - the familiar major sound',
  },
  {
    id: Modes.Dorian,
    name: 'Dorian',
    scaleDegree: 2,
    character: 'Smooth and soulful - minor with a bright 6th',
  },
  {
    id: Modes.Phrygian,
    name: 'Phrygian',
    scaleDegree: 3,
    character: 'Dark and exotic - minor with a flat 2nd',
  },
  {
    id: Modes.Lydian,
    name: 'Lydian',
    scaleDegree: 4,
    character: 'Dreamy and floating - major with a raised 4th',
  },
  {
    id: Modes.Mixolydian,
    name: 'Mixolydian',
    scaleDegree: 5,
    character: 'Bright and bluesy - major with a flat 7th',
  },
  {
    id: Modes.Aeolian,
    name: 'Aeolian',
    scaleDegree: 6,
    character: 'Melancholic and natural - the natural minor sound',
  },
  {
    id: Modes.Locrian,
    name: 'Locrian',
    scaleDegree: 7,
    character: 'Unstable and tense - diminished with a flat 2nd and flat 5th',
  },
] as const;

/** O(1) lookup for ModeInfo by ModeName. */
const ModeInfoById: Record<ModeName, ModeInfo> = Object.fromEntries(
  MODES.map((m) => [m.id, m])
) as Record<ModeName, ModeInfo>;

/**
 * Display labels for the five accidental notes, showing the flat name first
 * since flat spellings are more common in major scale contexts.
 * Natural notes return null.
 */
const ENHARMONIC_LABELS: Record<Note, string | null> = {
  C: null,
  'C#': 'Db/C#',
  D: null,
  'D#': 'Eb/D#',
  E: null,
  F: null,
  'F#': 'Gb/F#',
  G: null,
  'G#': 'Ab/G#',
  A: null,
  'A#': 'Bb/A#',
  B: null,
};

/**
 * Maps each flat-spelled input note to its canonical sharp equivalent.
 * Derived from ENHARMONIC_LABELS (single source of truth); a companion
 * test asserts this table's keys are exactly the 5 FlatNote values and
 * stay consistent with ENHARMONIC_LABELS. Module-internal to the package
 * (exported from this file for use in engine.ts, but not re-exported from
 * index.ts — not part of the public API).
 */
const FLAT_TO_SHARP: Readonly<Record<FlatNote, Note>> = Object.fromEntries(
  Object.entries(ENHARMONIC_LABELS)
    .filter((entry): entry is [Note, string] => entry[1] !== null)
    .map(([sharp, label]) => [label.split('/')[0], sharp])
) as Record<FlatNote, Note>;

/**
 * Maps each note to its flat-spelled equivalent (naturals map to themselves).
 * Derived from ENHARMONIC_LABELS; same consistency guarantee and visibility
 * as FLAT_TO_SHARP.
 */
const SHARP_TO_FLAT_MAP: Readonly<Record<Note, string>> = Object.fromEntries(
  CHROMATIC_NOTES.map((note) => {
    const label = ENHARMONIC_LABELS[note];
    return [note, label === null ? note : label.split('/')[0]];
  })
) as Record<Note, string>;

export {
  Notes,
  CHROMATIC_NOTES,
  Notations,
  Modes,
  Intervals,
  ScaleTypes,
  PentatonicTypes,
  Accidentals,
  MODES,
  ModeInfoById,
  ENHARMONIC_LABELS,
  KeyQualities,
  FlatNotes,
  FLAT_TO_SHARP,
  SHARP_TO_FLAT_MAP,
};

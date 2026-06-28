import type {
  Note,
  ModeInfo,
  ModeName,
  NotationType,
  IntervalId,
  ScaleKind,
  AccidentalType,
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

/** Named constants for each derived scale kind. */
const ScaleKinds = {
  Mode: 'mode',
  Chromatic: 'chromatic',
  Pentatonic: 'pentatonic',
  Blues: 'blues',
  HarmonicMinor: 'harmonic-minor',
} as const satisfies Record<string, ScaleKind>;

/** Named constants for each accidental display preference. */
const Accidentals = {
  Sharp: 'sharp',
  Flat: 'flat',
  Both: 'both',
} as const satisfies Record<string, AccidentalType>;

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

export {
  Notes,
  CHROMATIC_NOTES,
  Notations,
  Modes,
  Intervals,
  ScaleKinds,
  Accidentals,
  MODES,
  ModeInfoById,
  ENHARMONIC_LABELS,
};

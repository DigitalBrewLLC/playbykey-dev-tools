import type {
  Note,
  ModeInfo,
  ModeName,
  NotationType,
  IntervalId,
  ScaleKind,
  AccidentalType,
} from './types';

/** All 12 chromatic notes in ascending order from C. */
const NOTES: readonly Note[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

/** Named constants for each notation type, validated against NotationType. */
const NOTATION_IDS = {
  LETTER: 'letter',
  NUMBER: 'number',
} as const satisfies Record<string, NotationType>;

/** Named constants for each mode ID, validated against ModeName. */
const MODE_IDS = {
  IONIAN: 'ionian',
  DORIAN: 'dorian',
  PHRYGIAN: 'phrygian',
  LYDIAN: 'lydian',
  MIXOLYDIAN: 'mixolydian',
  AEOLIAN: 'aeolian',
  LOCRIAN: 'locrian',
} as const satisfies Record<string, ModeName>;

/** All mode names derived from MODE_IDS. */
const MODE_NAMES = Object.values(MODE_IDS) as readonly ModeName[];

/** Named constants for each interval id, validated against IntervalId. */
const INTERVAL_IDS = {
  HALF_STEP: 'half_step',
  WHOLE_STEP: 'whole_step',
  MAJOR_2ND: 'major_2nd',
  MINOR_3RD: 'minor_3rd',
  MAJOR_3RD: 'major_3rd',
  PERFECT_4TH: 'perfect_4th',
  TRITONE: 'tritone',
  PERFECT_5TH: 'perfect_5th',
  MINOR_6TH: 'minor_6th',
  MAJOR_6TH: 'major_6th',
  MINOR_7TH: 'minor_7th',
  MAJOR_7TH: 'major_7th',
  OCTAVE: 'octave',
} as const satisfies Record<string, IntervalId>;

/** All interval ids derived from INTERVAL_IDS. */
const INTERVAL_ID_VALUES = Object.values(INTERVAL_IDS) as readonly IntervalId[];

/** Named constants for each scale kind, validated against ScaleKind. */
const SCALE_KIND_IDS = {
  MODE: 'mode',
  CHROMATIC: 'chromatic',
  PENTATONIC: 'pentatonic',
  BLUES: 'blues',
  HARMONIC_MINOR: 'harmonic-minor',
} as const satisfies Record<string, ScaleKind>;

/** All scale kinds derived from SCALE_KIND_IDS. */
const SCALE_KIND_VALUES = Object.values(SCALE_KIND_IDS) as readonly ScaleKind[];

/** Named constants for each accidental display preference, validated against AccidentalType. */
const ACCIDENTAL_IDS = {
  SHARP: 'sharp',
  FLAT: 'flat',
  BOTH: 'both',
} as const satisfies Record<string, AccidentalType>;

/** All 7 modes with display names, scale degrees, and characteristic descriptions. */
const MODES: readonly ModeInfo[] = [
  {
    id: MODE_IDS.IONIAN,
    name: 'Ionian',
    scaleDegree: 1,
    character: 'Bright and resolved - the familiar major sound',
  },
  {
    id: MODE_IDS.DORIAN,
    name: 'Dorian',
    scaleDegree: 2,
    character: 'Smooth and soulful - minor with a bright 6th',
  },
  {
    id: MODE_IDS.PHRYGIAN,
    name: 'Phrygian',
    scaleDegree: 3,
    character: 'Dark and exotic - minor with a flat 2nd',
  },
  {
    id: MODE_IDS.LYDIAN,
    name: 'Lydian',
    scaleDegree: 4,
    character: 'Dreamy and floating - major with a raised 4th',
  },
  {
    id: MODE_IDS.MIXOLYDIAN,
    name: 'Mixolydian',
    scaleDegree: 5,
    character: 'Bright and bluesy - major with a flat 7th',
  },
  {
    id: MODE_IDS.AEOLIAN,
    name: 'Aeolian',
    scaleDegree: 6,
    character: 'Melancholic and natural - the natural minor sound',
  },
  {
    id: MODE_IDS.LOCRIAN,
    name: 'Locrian',
    scaleDegree: 7,
    character: 'Unstable and tense - diminished with a flat 2nd and flat 5th',
  },
] as const;

/**
 * Display labels for the five accidental notes, showing the flat name first
 * since flat spellings are more common in major scale contexts.
 * Used by the scale detail strip to avoid duplicate letter names in a scale
 * (e.g. D# Ionian contains both D and D#; showing "Eb/D#" makes them distinct).
 */
const ENHARMONIC_LABELS: Partial<Record<Note, string>> = {
  'C#': 'Db/C#',
  'D#': 'Eb/D#',
  'F#': 'Gb/F#',
  'G#': 'Ab/G#',
  'A#': 'Bb/A#',
};

export {
  NOTATION_IDS,
  MODE_IDS,
  MODE_NAMES,
  INTERVAL_IDS,
  INTERVAL_ID_VALUES,
  SCALE_KIND_IDS,
  SCALE_KIND_VALUES,
  ACCIDENTAL_IDS,
  NOTES,
  MODES,
  ENHARMONIC_LABELS,
};

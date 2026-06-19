import type {
  Note,
  ModeInfo,
  HowItWorksContent,
  FrameworkInfo,
  CategoryInfo,
  FrameworkId,
  ModeName,
  NotationType,
  RelativePerspective,
  IntervalId,
  ScaleKind,
  VisualizationType,
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

/** Named constants for each relative perspective ID, validated against RelativePerspective. */
const PERSPECTIVE_IDS = {
  MAJOR: 'major',
  MINOR: 'minor',
} as const satisfies Record<string, RelativePerspective>;

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

/** Named constants for each visualization view, validated against VisualizationType. */
const VISUALIZATION_IDS = {
  KEYBOARD: 'keyboard',
  FRETBOARD: 'fretboard',
} as const satisfies Record<string, VisualizationType>;

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

/** Named constants for each framework ID, validated against FrameworkId. */
const FRAMEWORK_IDS = {
  MODAL: 'modal',
  MAJOR_SCALE: 'major-scale',
  MINOR_SCALE: 'minor-scale',
  RELATIVE_KEY: 'relative-key',
  CIRCLE_OF_FIFTHS: 'circle-of-fifths',
} as const satisfies Record<string, FrameworkId>;

/** The five frameworks with metadata for display and routing. */
const FRAMEWORKS: readonly FrameworkInfo[] = [
  {
    id: FRAMEWORK_IDS.MODAL,
    name: 'Modal System',
    subtitle: 'Same key, different centers',
    description:
      "Establish one note as your center and explore all 7 modes built from that center. Learn how each mode's unique interval structure creates a distinct modal character.",
    howItWorks: {
      paragraphs: [
        'All 7 modes share one key signature. The mode you select determines which note becomes the center - not which notes you play.',
        'This is called the parent scale approach: you pick a key (e.g. C), and every mode you explore uses that same set of 7 notes. Only the starting point - the center - changes.',
        'This is different from building a mode independently from its own root. D Dorian built from scratch gives you D E F G A B C. The notes are identical to C Ionian, but the construction logic is the opposite direction.',
      ],
      example:
        'Dorian modal center in the key of C: start from the C key signature (C D E F G A B) and treat D as home. Dm Dorian as a mode: start from D and apply the Dorian interval formula (D E F G A B C). The notes are identical - the distinction is direction. Modal center = key first, then shift the home. Mode = root first, then build the scale.',
    } satisfies HowItWorksContent,
  },
  {
    id: FRAMEWORK_IDS.MAJOR_SCALE,
    name: 'Major Scale System',
    subtitle: 'Parent Scale - same notes, different centers',
    description:
      'Navigate all 7 modes within the major scale. One set of seven notes takes on a distinct tonal character depending on which note you treat as home.',
    howItWorks: {
      paragraphs: [
        'Every mode has a parent major key. D Dorian, E Phrygian, and F Lydian all come from the same parent key: C major. They use the exact same 7 notes - only the note you call home changes.',
        'This framework helps you navigate that parent key by rotating through all 7 homes. When you pick a key, you see every mode that lives inside it and can jump directly to any of them.',
        'This is the opposite direction from Modal System: instead of fixing a center and exploring modes, you fix a key signature and explore all the centers it contains.',
      ],
      example:
        'Parent key C (no sharps or flats): C D E F G A B. D Dorian starts on D and uses the same 7 notes. G Mixolydian starts on G and uses the same 7 notes. The key signature never changes - only the home note does.',
    } satisfies HowItWorksContent,
  },
  {
    id: FRAMEWORK_IDS.MINOR_SCALE,
    name: 'Minor Scale System',
    subtitle: 'Child Scale - minor-centered perspective',
    description:
      'Navigate all 7 modes within the minor scale. Minor tonality has its own identity and harmonic logic that becomes clearer when explored from a minor-centered perspective.',
    howItWorks: {
      paragraphs: [
        'Natural minor (Aeolian) differs from major (Ionian) at exactly three degrees: the 3rd, 6th, and 7th are each lowered by a half step. These three changes are what give minor its characteristic sound.',
        'This framework places major and minor side by side from the same root so those three differences are immediately visible. You hear and see what makes minor sound the way it does - not as a separate system, but as a direct transformation of major.',
        'The mode selector lets you explore all 7 modes of the minor parent scale, each with its own center and character built from the same minor key signature.',
      ],
      example:
        'Root C: C major is C D E F G A B. C natural minor is C D Eb F G Ab Bb. Three notes differ: E becomes Eb (b3), A becomes Ab (b6), B becomes Bb (b7). Everything else is identical.',
    } satisfies HowItWorksContent,
  },
  {
    id: FRAMEWORK_IDS.RELATIVE_KEY,
    name: 'Relative Key System',
    subtitle: 'Family Scale - major/minor duality',
    description:
      'Navigate between the major scale and its relative minor, where the same seven notes create two distinct tonal centers. Every major key has a relative minor, and every minor key has a relative major, built from the exact same notes.',
    howItWorks: {
      paragraphs: [
        'Every major key has a relative minor that shares its exact key signature. C major and A minor both use C D E F G A B - no sharps, no flats. The notes are identical; only the home note differs.',
        'This framework shows both homes on the same keyboard simultaneously. You can flip between the major perspective (C as home, Ionian sound) and the minor perspective (A as home, Aeolian sound) to hear how the same 7 notes create two entirely different emotional contexts.',
        'The relationship holds for every key: G major and E minor share 1 sharp, F major and D minor share 1 flat, and so on around the circle.',
      ],
      example:
        'Key of C: C D E F G A B. Treat C as home and you hear the bright, resolved Ionian sound. Treat A as home using the same notes and you hear the melancholic Aeolian sound. Same notes, same instrument, different story.',
    } satisfies HowItWorksContent,
  },
  {
    id: FRAMEWORK_IDS.CIRCLE_OF_FIFTHS,
    name: 'Circle of Fifths System',
    subtitle: 'Systematic key navigation',
    description:
      'Move through keys using fifth relationships. Learn key signatures systematically, understand harmonic progressions based on fifth movement, and develop the ability to transpose.',
    howItWorks: {
      paragraphs: [
        'Each time you move up a perfect fifth, you add exactly one sharp to the key signature. Each time you move down a fifth (or up a fourth), you add exactly one flat. This creates a predictable map of all 12 keys arranged in a circle.',
        'Keys that are neighbors on the circle are harmonically close - they share 6 out of 7 notes. Keys on opposite sides of the circle are the most distant - they share only 2 notes. This spatial arrangement makes key relationships and common modulations immediately visible.',
        'The circle also reveals why certain chord progressions feel natural: moving by fifths is the most common harmonic motion in Western music (V-I, ii-V-I, and cycle-of-fifths progressions all follow this pattern).',
      ],
      example: `Starting from C (0 accidentals):

→ Up a perfect 5th to G - add 1 sharp (F#)
→ Up again to D - add 2 sharps (F#, C#)
← Down a perfect 5th to F - add 1 flat (Bb)
  (same step as up a perfect 4th from C to F)

C and G share 6 notes. C and F# share only 2.`,
    } satisfies HowItWorksContent,
  },
] as const;

/** The three practice category levels shared across all frameworks. */
const CATEGORIES: readonly CategoryInfo[] = [
  {
    level: 1,
    levelLabel: 'Beginner',
    name: 'Foundation & Orientation',
    timeRange: '10-15 minutes',
    focus:
      'Establish your reference point and learn how each element sounds within this framework.',
  },
  {
    level: 2,
    levelLabel: 'Intermediate',
    name: 'Controlled Improvisation',
    timeRange: '15-25 minutes',
    focus:
      'Apply what you know through focused exercises with limits that build fluency and judgment.',
  },
  {
    level: 3,
    levelLabel: 'Advanced',
    name: 'Free Application',
    timeRange: '5-10 minutes',
    focus:
      'Play freely with no constraints, using everything available in the current framework context.',
  },
] as const;

/** Set of valid framework IDs for route validation. */
const VALID_FRAMEWORK_IDS = new Set(FRAMEWORKS.map((fw) => fw.id));

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
  PERSPECTIVE_IDS,
  MODE_IDS,
  MODE_NAMES,
  INTERVAL_IDS,
  INTERVAL_ID_VALUES,
  SCALE_KIND_IDS,
  SCALE_KIND_VALUES,
  VISUALIZATION_IDS,
  ACCIDENTAL_IDS,
  FRAMEWORK_IDS,
  NOTES,
  MODES,
  FRAMEWORKS,
  CATEGORIES,
  VALID_FRAMEWORK_IDS,
  ENHARMONIC_LABELS,
};

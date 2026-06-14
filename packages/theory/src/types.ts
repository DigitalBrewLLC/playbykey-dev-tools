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

/** Theory interval subtopic ids used in the interval catalog and diagrams. */
type TheoryIntervalId =
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

/** Scale kinds used in theory diagrams and scale strips. */
type TheoryScaleKind =
  | 'mode'
  | 'chromatic'
  | 'pentatonic'
  | 'blues'
  | 'harmonic-minor';

/** Identifier for each of the five practice frameworks. */
type FrameworkId =
  | 'modal'
  | 'major-scale'
  | 'minor-scale'
  | 'relative-key'
  | 'circle-of-fifths';

/** Available instrument/visualization views. */
type VisualizationType = 'keyboard' | 'fretboard';

/** Scale degree notation: numbers (1-7) or letter names (C, D, E...). */
type NotationType = 'number' | 'letter';

/** Accidental display preference: sharp names (C#), flat names (Db), or both (Db/C#). */
type AccidentalType = 'sharp' | 'flat' | 'both';

/** Which tonal center to highlight in the Relative Key framework view. */
type RelativePerspective = 'major' | 'minor';

/** Practice category level corresponding to the three progressive stages. */
type CategoryLevel = 1 | 2 | 3;

/** Player-facing difficulty label for a practice category level. */
type CategoryLevelLabel = 'Beginner' | 'Intermediate' | 'Advanced';

/** Display metadata for a mode. */
interface ModeInfo {
  id: ModeName;
  name: string;
  scaleDegree: number;
  character: string;
}

/** "How it works" content block for a framework's explainer section. */
interface HowItWorksContent {
  paragraphs: string[];
  example?: string;
}

/** Display metadata for a framework. */
interface FrameworkInfo {
  id: FrameworkId;
  name: string;
  subtitle: string;
  description: string;
  howItWorks?: HowItWorksContent;
}

/** Display metadata for a practice category. */
interface CategoryInfo {
  level: CategoryLevel;
  levelLabel: CategoryLevelLabel;
  name: string;
  timeRange: string;
  focus: string;
}

/** Computed display data for a single chromatic note, consumed by all visualization views. */
interface NoteDisplayInfo {
  note: Note;
  inScale: boolean;
  scaleDegree: number | null;
  label: string;
  isRoot: boolean;
}

/** The complete filter state driving all visualizations. */
interface VisualizationState {
  key: Note;
  mode: ModeName;
  notation: NotationType;
  view: VisualizationType;
  accidental: AccidentalType;
}

export type {
  Note,
  ModeName,
  TheoryIntervalId,
  TheoryScaleKind,
  FrameworkId,
  VisualizationType,
  NotationType,
  AccidentalType,
  RelativePerspective,
  CategoryLevel,
  CategoryLevelLabel,
  ModeInfo,
  HowItWorksContent,
  FrameworkInfo,
  CategoryInfo,
  NoteDisplayInfo,
  VisualizationState,
};

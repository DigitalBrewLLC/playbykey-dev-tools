/**
 * Music theory module — barrel export.
 *
 * Re-exports all types, constants, and engine functions
 * for clean single-path imports across the app.
 */

export type {
  Note,
  ModeName,
  TheoryIntervalId,
  TheoryScaleKind,
  FrameworkId,
  VisualizationType,
  NotationType,
  AccidentalType,
  CategoryLevel,
  CategoryLevelLabel,
  ModeInfo,
  FrameworkInfo,
  CategoryInfo,
  NoteDisplayInfo,
  VisualizationState,
} from './types';

export {
  NOTATION_IDS,
  PERSPECTIVE_IDS,
  MODE_IDS,
  MODE_NAMES,
  INTERVAL_IDS,
  THEORY_INTERVAL_IDS,
  SCALE_KIND_IDS,
  THEORY_SCALE_KINDS,
  VISUALIZATION_IDS,
  ACCIDENTAL_IDS,
  FRAMEWORK_IDS,
  NOTES,
  MODES,
  FRAMEWORKS,
  CATEGORIES,
  VALID_FRAMEWORK_IDS,
  ENHARMONIC_LABELS,
} from './constants';

export {
  MODE_INTERVALS,
  MODE_SEMITONE_OFFSETS,
  getNoteIndex,
  noteAtIndex,
  getSemitoneDistance,
  getScaleNotes,
  getScaleDegree,
  isNoteInScale,
  getNoteLabel,
  buildNoteMap,
  getModeAlterations,
  getModalRoot,
  getParentScaleModes,
  getRelativeMinorKey,
  getRelativeMajorKey,
  getCircleOfFifthsOrder,
  getKeySignatureCount,
  isNote,
  isModeName,
  parseNote,
  parseModeName,
} from './engine';

export type {
  TheoryIntervalContext,
  IntervalSpec,
  IntervalDefinition,
  ResolvedInterval,
} from './intervals';

export {
  INTERVAL_DEFINITIONS,
  isTheoryIntervalId,
  intervalUsesChromaticTo,
  resolveIntervalEndpoints,
} from './intervals';

export type { ScaleDefinition } from './scales';

export {
  SCALE_DEFINITIONS,
  BLUES_SEMITONE_OFFSETS,
  PENTATONIC_DEGREES,
  FULL_SCALE_DEGREES,
  getBluesNotes,
  getDerivedScaleNotes,
  getFullScaleDegrees,
  getHarmonicMinorNotes,
  getKeyboardContextNotes,
  getPentatonicDegrees,
  getScaleEmphasisDegrees,
  notesFromSemitoneOffsets,
} from './scales';

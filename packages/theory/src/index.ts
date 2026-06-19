/**
 * Music theory module — barrel export.
 *
 * Re-exports all types, constants, and engine functions
 * for clean single-path imports across the app.
 */

export type {
  Note,
  ModeName,
  IntervalId,
  ScaleKind,
  NotationType,
  AccidentalType,
  ModeInfo,
  NoteDisplayInfo,
} from './types';

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
  IntervalContext,
  IntervalSpec,
  IntervalDefinition,
  ResolvedInterval,
} from './intervals';

export {
  INTERVAL_DEFINITIONS,
  isIntervalId,
  getIntervalSemitones,
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
  getPentatonicDegrees,
  getScaleContextNotes,
  getScaleEmphasisDegrees,
  notesFromSemitoneOffsets,
} from './scales';

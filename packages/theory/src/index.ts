/**
 * Music theory module - barrel export.
 *
 * Re-exports all types, constants, and engine functions
 * for clean single-path imports across the app.
 */

export type {
  Note,
  ModeName,
  IntervalId,
  ScaleType,
  PentatonicType,
  NotationType,
  AccidentalType,
  ModeInfo,
  NoteDisplayInfo,
} from './types';

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
} from './constants';

export {
  elementAt,
  MODE_INTERVALS,
  MODE_SEMITONE_OFFSETS,
  getSemitoneDistance,
  getModeNotes,
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
  PENTATONIC_MAJOR_DEGREES,
  PENTATONIC_MINOR_DEGREES,
  FULL_SCALE_DEGREES,
  getBluesNotes,
  getFullScaleDegrees,
  getHarmonicMinorNotes,
  getPentatonicNotes,
  getScaleDegree,
  getScaleDegrees,
  getScaleNotes,
  isNoteInScale,
  buildNoteMap,
  notesFromSemitoneOffsets,
} from './scales';

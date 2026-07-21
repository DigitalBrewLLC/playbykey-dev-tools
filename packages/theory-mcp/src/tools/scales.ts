import {
  getScaleNotes,
  buildNoteMap,
  getScaleDegree,
  isNoteInScale,
  getMelodicMinorNotes,
  getMelodicMinorModeNotes,
  getHarmonicMinorModeNotes,
  getBebopScaleNotes,
} from '@playbykey/theory';
import {
  validateNote,
  validateScaleType,
  validateMelodicMinorMode,
  validateHarmonicMinorMode,
  validateBebopScaleType,
} from '../validate.js';
import { type ToolContent, errorContent, okContent } from '../tool-helpers.js';

export function handleGetScaleNotes(
  args: Record<string, unknown>
): ToolContent {
  const root = validateNote(args['root']);
  const scaleType = validateScaleType(args['scale_type']);
  if (!root.ok) return errorContent(root.error);
  if (!scaleType.ok) return errorContent(scaleType.error);

  const notes = getScaleNotes(root.value, scaleType.value);
  const summary = `${root.value} ${scaleType.value}: ${notes.join(', ')}`;
  return okContent(summary, {
    root: root.value,
    scaleType: scaleType.value,
    notes,
  });
}

export function handleBuildNoteMap(args: Record<string, unknown>): ToolContent {
  const root = validateNote(args['root']);
  const scaleType = validateScaleType(args['scale_type']);
  if (!root.ok) return errorContent(root.error);
  if (!scaleType.ok) return errorContent(scaleType.error);

  const noteMap = buildNoteMap(root.value, scaleType.value);
  const summary = `Note map for ${root.value} ${scaleType.value}: ${noteMap.map((n) => `${n.note}(deg ${n.scaleDegree})`).join(', ')}`;
  return okContent(summary, {
    root: root.value,
    scaleType: scaleType.value,
    noteMap,
  });
}

export function handleGetScaleDegree(
  args: Record<string, unknown>
): ToolContent {
  const root = validateNote(args['root']);
  const scaleType = validateScaleType(args['scale_type']);
  const note = validateNote(args['note']);
  if (!root.ok) return errorContent(root.error);
  if (!scaleType.ok) return errorContent(scaleType.error);
  if (!note.ok) return errorContent(note.error);

  const degree = getScaleDegree(root.value, scaleType.value, note.value);
  const summary =
    degree !== null
      ? `${note.value} is degree ${degree} in ${root.value} ${scaleType.value}`
      : `${note.value} is not in ${root.value} ${scaleType.value}`;
  return okContent(summary, {
    root: root.value,
    scaleType: scaleType.value,
    note: note.value,
    degree,
    inScale: degree !== null,
  });
}

export function handleIsNoteInScale(
  args: Record<string, unknown>
): ToolContent {
  const root = validateNote(args['root']);
  const scaleType = validateScaleType(args['scale_type']);
  const note = validateNote(args['note']);
  if (!root.ok) return errorContent(root.error);
  if (!scaleType.ok) return errorContent(scaleType.error);
  if (!note.ok) return errorContent(note.error);

  const inScale = isNoteInScale(root.value, scaleType.value, note.value);
  const summary = `${note.value} is ${inScale ? '' : 'not '}in ${root.value} ${scaleType.value}`;
  return okContent(summary, {
    root: root.value,
    scaleType: scaleType.value,
    note: note.value,
    inScale,
  });
}

export function handleGetMelodicMinorNotes(
  args: Record<string, unknown>
): ToolContent {
  const root = validateNote(args['root']);
  if (!root.ok) return errorContent(root.error);

  const notes = getMelodicMinorNotes(root.value);
  const summary = `${root.value} melodic minor: ${notes.join(', ')}`;
  return okContent(summary, { root: root.value, notes });
}

export function handleGetMelodicMinorModeNotes(
  args: Record<string, unknown>
): ToolContent {
  const root = validateNote(args['root']);
  const mode = validateMelodicMinorMode(args['mode']);
  if (!root.ok) return errorContent(root.error);
  if (!mode.ok) return errorContent(mode.error);

  const notes = getMelodicMinorModeNotes(root.value, mode.value);
  const summary = `${root.value} ${mode.value}: ${notes.join(', ')}`;
  return okContent(summary, { root: root.value, mode: mode.value, notes });
}

export function handleGetHarmonicMinorModeNotes(
  args: Record<string, unknown>
): ToolContent {
  const root = validateNote(args['root']);
  const mode = validateHarmonicMinorMode(args['mode']);
  if (!root.ok) return errorContent(root.error);
  if (!mode.ok) return errorContent(mode.error);

  const notes = getHarmonicMinorModeNotes(root.value, mode.value);
  const summary = `${root.value} ${mode.value}: ${notes.join(', ')}`;
  return okContent(summary, { root: root.value, mode: mode.value, notes });
}

export function handleGetBebopScaleNotes(
  args: Record<string, unknown>
): ToolContent {
  const root = validateNote(args['root']);
  const type = validateBebopScaleType(args['type']);
  if (!root.ok) return errorContent(root.error);
  if (!type.ok) return errorContent(type.error);

  const notes = getBebopScaleNotes(root.value, type.value);
  const summary = `${root.value} ${type.value}: ${notes.join(', ')}`;
  return okContent(summary, { root: root.value, type: type.value, notes });
}

import {
  getScaleNotes,
  buildNoteMap,
  getScaleDegree,
  isNoteInScale,
} from '@playbykey/theory';
import { validateNote, validateScaleType } from '../validate.js';
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

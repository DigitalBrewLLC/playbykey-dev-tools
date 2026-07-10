import { getScaleNotes, buildNoteMap } from '@playbykey/theory';
import { validateNote, validateScaleType } from '../validate.js';

type ToolContent = { content: Array<{ type: 'text'; text: string }> };

function errorContent(message: string): ToolContent {
  return { content: [{ type: 'text', text: message }] };
}

export function handleGetScaleNotes(
  args: Record<string, unknown>
): ToolContent {
  const root = validateNote(args['root']);
  const scaleType = validateScaleType(args['scale_type']);
  if (!root.ok) return errorContent(root.error);
  if (!scaleType.ok) return errorContent(scaleType.error);

  const notes = getScaleNotes(root.value, scaleType.value);
  const summary = `${root.value} ${scaleType.value}: ${notes.join(', ')}`;
  const json = JSON.stringify({
    root: root.value,
    scaleType: scaleType.value,
    notes,
  });
  return { content: [{ type: 'text', text: `${summary}\n\n${json}` }] };
}

export function handleBuildNoteMap(args: Record<string, unknown>): ToolContent {
  const root = validateNote(args['root']);
  const scaleType = validateScaleType(args['scale_type']);
  if (!root.ok) return errorContent(root.error);
  if (!scaleType.ok) return errorContent(scaleType.error);

  const noteMap = buildNoteMap(root.value, scaleType.value);
  const summary = `Note map for ${root.value} ${scaleType.value}: ${noteMap.map((n) => `${n.note}(deg ${n.scaleDegree})`).join(', ')}`;
  const json = JSON.stringify({
    root: root.value,
    scaleType: scaleType.value,
    noteMap,
  });
  return { content: [{ type: 'text', text: `${summary}\n\n${json}` }] };
}

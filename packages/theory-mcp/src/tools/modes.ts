import {
  getModeNotes,
  getParentScaleModes,
  getModalRoot,
  getRelativeMinorKey,
  getRelativeMajorKey,
  ModeInfoById,
} from '@playbykey/theory';
import { validateNote, validateModeName } from '../validate.js';

type ToolContent = { content: Array<{ type: 'text'; text: string }> };

function errorContent(message: string): ToolContent {
  return { content: [{ type: 'text', text: message }] };
}

export function handleGetModeNotes(args: Record<string, unknown>): ToolContent {
  const root = validateNote(args['root']);
  const mode = validateModeName(args['mode']);
  if (!root.ok) return errorContent(root.error);
  if (!mode.ok) return errorContent(mode.error);

  const notes = getModeNotes(root.value, mode.value);
  const summary = `${root.value} ${mode.value}: ${notes.join(', ')}`;
  const json = JSON.stringify({ root: root.value, mode: mode.value, notes });
  return { content: [{ type: 'text', text: `${summary}\n\n${json}` }] };
}

export function handleGetParentScaleModes(
  args: Record<string, unknown>
): ToolContent {
  const root = validateNote(args['root']);
  const mode = validateModeName(args['mode']);
  if (!root.ok) return errorContent(root.error);
  if (!mode.ok) return errorContent(mode.error);

  const modes = getParentScaleModes(root.value, mode.value);
  const summary = `Parent scale modes for ${root.value} ${mode.value}: ${modes.map((m) => `${m.root} ${m.mode}`).join(', ')}`;
  const json = JSON.stringify({ root: root.value, mode: mode.value, modes });
  return { content: [{ type: 'text', text: `${summary}\n\n${json}` }] };
}

export function handleGetModalRoot(args: Record<string, unknown>): ToolContent {
  const parentKey = validateNote(args['parent_key']);
  const mode = validateModeName(args['mode']);
  if (!parentKey.ok) return errorContent(parentKey.error);
  if (!mode.ok) return errorContent(mode.error);

  const modalRoot = getModalRoot(parentKey.value, mode.value);
  const summary = `The ${mode.value} mode of the ${parentKey.value} major scale is rooted on ${modalRoot}`;
  const json = JSON.stringify({
    parentKey: parentKey.value,
    mode: mode.value,
    modalRoot,
  });
  return { content: [{ type: 'text', text: `${summary}\n\n${json}` }] };
}

export function handleGetRelativeMinor(
  args: Record<string, unknown>
): ToolContent {
  const majorKey = validateNote(args['major_key']);
  if (!majorKey.ok) return errorContent(majorKey.error);

  const minorKey = getRelativeMinorKey(majorKey.value);
  const summary = `The relative minor of ${majorKey.value} major is ${minorKey} minor`;
  const json = JSON.stringify({ majorKey: majorKey.value, minorKey });
  return { content: [{ type: 'text', text: `${summary}\n\n${json}` }] };
}

export function handleGetRelativeMajor(
  args: Record<string, unknown>
): ToolContent {
  const minorKey = validateNote(args['minor_key']);
  if (!minorKey.ok) return errorContent(minorKey.error);

  const majorKey = getRelativeMajorKey(minorKey.value);
  const summary = `The relative major of ${minorKey.value} minor is ${majorKey} major`;
  const json = JSON.stringify({ minorKey: minorKey.value, majorKey });
  return { content: [{ type: 'text', text: `${summary}\n\n${json}` }] };
}

export function handleGetModeInfo(args: Record<string, unknown>): ToolContent {
  const mode = validateModeName(args['mode']);
  if (!mode.ok) return errorContent(mode.error);

  const info = ModeInfoById[mode.value];
  const summary = `${info.name} (degree ${info.scaleDegree}): ${info.character}`;
  const json = JSON.stringify(info);
  return { content: [{ type: 'text', text: `${summary}\n\n${json}` }] };
}

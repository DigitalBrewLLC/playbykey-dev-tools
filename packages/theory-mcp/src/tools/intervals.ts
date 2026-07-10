import {
  resolveIntervalEndpoints,
  getSemitoneDistance,
} from '@playbykey/theory';
import type { IntervalContext } from '@playbykey/theory';
import { validateNote, validateIntervalId } from '../validate.js';

type ToolContent = { content: Array<{ type: 'text'; text: string }> };

function errorContent(message: string): ToolContent {
  return { content: [{ type: 'text', text: message }] };
}

export function handleResolveInterval(
  args: Record<string, unknown>
): ToolContent {
  const root = validateNote(args['root']);
  const interval = validateIntervalId(args['interval']);
  if (!root.ok) return errorContent(root.error);
  if (!interval.ok) return errorContent(interval.error);

  const context: IntervalContext = {
    root: root.value,
    interval: interval.value,
  };
  const result = resolveIntervalEndpoints(context);
  const summary = `${result.label}: ${result.from} to ${result.to} (${result.semitones} semitone${result.semitones === 1 ? '' : 's'})`;
  const json = JSON.stringify({
    root: root.value,
    interval: interval.value,
    ...result,
  });
  return { content: [{ type: 'text', text: `${summary}\n\n${json}` }] };
}

export function handleGetSemitoneDistance(
  args: Record<string, unknown>
): ToolContent {
  const from = validateNote(args['from']);
  const to = validateNote(args['to']);
  if (!from.ok) return errorContent(from.error);
  if (!to.ok) return errorContent(to.error);

  const semitones = getSemitoneDistance(from.value, to.value);
  const summary = `${from.value} to ${to.value}: ${semitones} semitone${semitones === 1 ? '' : 's'}`;
  const json = JSON.stringify({ from: from.value, to: to.value, semitones });
  return { content: [{ type: 'text', text: `${summary}\n\n${json}` }] };
}

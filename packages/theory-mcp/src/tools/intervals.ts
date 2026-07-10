import {
  resolveIntervalEndpoints,
  getSemitoneDistance,
} from '@playbykey/theory';
import type { IntervalContext } from '@playbykey/theory';
import { validateNote, validateIntervalId } from '../validate.js';
import { type ToolContent, errorContent, okContent } from '../tool-helpers.js';

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
  return okContent(summary, {
    root: root.value,
    interval: interval.value,
    ...result,
  });
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
  return okContent(summary, { from: from.value, to: to.value, semitones });
}

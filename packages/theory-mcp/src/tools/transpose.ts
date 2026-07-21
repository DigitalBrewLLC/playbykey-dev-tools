import { transpose } from '@playbykey/theory';
import { validateNote, validateNoteArray } from '../validate.js';
import { type ToolContent, errorContent, okContent } from '../tool-helpers.js';

export function handleTranspose(args: Record<string, unknown>): ToolContent {
  const notes = validateNoteArray(args['notes']);
  const fromRoot = validateNote(args['from_root']);
  const toRoot = validateNote(args['to_root']);
  if (!notes.ok) return errorContent(notes.error);
  if (!fromRoot.ok) return errorContent(fromRoot.error);
  if (!toRoot.ok) return errorContent(toRoot.error);

  const result = transpose(notes.value, fromRoot.value, toRoot.value);
  const summary = `Transposed [${notes.value.join(', ')}] from ${fromRoot.value} to ${toRoot.value}: ${result.join(', ')}`;
  return okContent(summary, {
    notes: notes.value,
    fromRoot: fromRoot.value,
    toRoot: toRoot.value,
    result,
  });
}

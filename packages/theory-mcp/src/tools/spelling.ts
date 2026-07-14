import { getSharps, getFlats, getEnharmonicLabels } from '@playbykey/theory';
import { validateNoteArray } from '../validate.js';
import { type ToolContent, errorContent, okContent } from '../tool-helpers.js';

export function handleGetSharps(args: Record<string, unknown>): ToolContent {
  const notes = validateNoteArray(args['notes']);
  if (!notes.ok) return errorContent(notes.error);

  const sharps = getSharps(notes.value);
  return okContent(`Sharps: ${sharps.join(', ')}`, { notes: sharps });
}

export function handleGetFlats(args: Record<string, unknown>): ToolContent {
  const notes = validateNoteArray(args['notes']);
  if (!notes.ok) return errorContent(notes.error);

  const flats = getFlats(notes.value);
  return okContent(`Flats: ${flats.join(', ')}`, { notes: flats });
}

export function handleGetEnharmonicLabels(
  args: Record<string, unknown>
): ToolContent {
  const notes = validateNoteArray(args['notes']);
  if (!notes.ok) return errorContent(notes.error);

  const labels = getEnharmonicLabels(notes.value);
  return okContent(`Enharmonic labels: ${labels.join(', ')}`, {
    notes: labels,
  });
}

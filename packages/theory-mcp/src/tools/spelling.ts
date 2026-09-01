import {
  getSharps,
  getFlats,
  getEnharmonicLabels,
  getRootLetter,
  spellDiatonicScale,
  formatSpelledNote,
} from '@playbykey/theory';
import {
  validateNoteArray,
  validateNote,
  validateNoteLetter,
  validateSpellingPreference,
} from '../validate.js';
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

export function handleGetRootLetter(
  args: Record<string, unknown>
): ToolContent {
  const root = validateNote(args['root']);
  if (!root.ok) return errorContent(root.error);
  const preference = validateSpellingPreference(args['preference']);
  if (!preference.ok) return errorContent(preference.error);

  const letter = getRootLetter(root.value, preference.value);
  return okContent(
    `Root letter for ${root.value} (${preference.value}): ${letter}`,
    { letter }
  );
}

export function handleSpellDiatonicScale(
  args: Record<string, unknown>
): ToolContent {
  const notes = validateNoteArray(args['notes']);
  if (!notes.ok) return errorContent(notes.error);
  const rootLetter = validateNoteLetter(args['root_letter']);
  if (!rootLetter.ok) return errorContent(rootLetter.error);

  try {
    const spelled = spellDiatonicScale(notes.value, rootLetter.value).map(
      formatSpelledNote
    );
    return okContent(`Spelled scale: ${spelled.join(', ')}`, {
      notes: spelled,
    });
  } catch (error) {
    return errorContent(error instanceof Error ? error.message : String(error));
  }
}

import { getProgressionInKey, getRomanNumeral, Modes } from '@playbykey/theory';
import {
  validateNote,
  validateOptionalModeName,
  validateProgressionId,
  validateDegree,
} from '../validate.js';
import { type ToolContent, errorContent, okContent } from '../tool-helpers.js';

export function handleGetProgressionInKey(
  args: Record<string, unknown>
): ToolContent {
  const progressionId = validateProgressionId(args['progression_id']);
  const root = validateNote(args['root']);
  if (!progressionId.ok) return errorContent(progressionId.error);
  if (!root.ok) return errorContent(root.error);

  const chords = getProgressionInKey(progressionId.value, root.value);
  const summary = `${progressionId.value} in ${root.value} (${chords.length} chords) - see the chords field for each chord's root and type.`;
  return okContent(summary, {
    progressionId: progressionId.value,
    root: root.value,
    chords,
  });
}

export function handleGetRomanNumeral(
  args: Record<string, unknown>
): ToolContent {
  const degree = validateDegree(args['degree']);
  const mode = validateOptionalModeName(args['mode']);
  if (!degree.ok) return errorContent(degree.error);
  if (!mode.ok) return errorContent(mode.error);

  const resolvedMode = mode.value ?? Modes.Ionian;
  const numeral = getRomanNumeral(degree.value, mode.value);
  const summary = `Degree ${degree.value} in ${resolvedMode}: ${numeral}`;
  return okContent(summary, {
    degree: degree.value,
    mode: resolvedMode,
    numeral,
  });
}

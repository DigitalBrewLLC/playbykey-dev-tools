import {
  getCircleOfFifthsOrder,
  getKeySignatureCount,
} from '@playbykey/theory';
import { validateNote } from '../validate.js';
import { type ToolContent, errorContent, okContent } from '../tool-helpers.js';

export function handleGetCircleOfFifths(): ToolContent {
  const notes = getCircleOfFifthsOrder();
  const summary = `Circle of fifths: ${notes.join(', ')}`;
  return okContent(summary, { notes });
}

export function handleGetKeySignature(
  args: Record<string, unknown>
): ToolContent {
  const key = validateNote(args['key']);
  if (!key.ok) return errorContent(key.error);

  const sig = getKeySignatureCount(key.value);
  const summary = formatKeySignatureSummary(key.value, sig);
  return okContent(summary, { key: key.value, signature: sig });
}

function formatKeySignatureSummary(
  key: string,
  sig: { sharps: number } | { flats: number }
): string {
  if ('sharps' in sig) {
    return sig.sharps === 0
      ? `${key} has no sharps or flats`
      : `${key} has ${sig.sharps} sharp${sig.sharps === 1 ? '' : 's'}`;
  }
  return `${key} has ${sig.flats} flat${sig.flats === 1 ? '' : 's'}`;
}

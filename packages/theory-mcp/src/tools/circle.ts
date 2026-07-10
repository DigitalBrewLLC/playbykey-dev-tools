import {
  getCircleOfFifthsOrder,
  getKeySignatureCount,
} from '@playbykey/theory';
import { validateNote } from '../validate.js';

type ToolContent = { content: Array<{ type: 'text'; text: string }> };

function errorContent(message: string): ToolContent {
  return { content: [{ type: 'text', text: message }] };
}

export function handleGetCircleOfFifths(
  args: Record<string, unknown>
): ToolContent {
  void args;
  const notes = getCircleOfFifthsOrder();
  const summary = `Circle of fifths: ${notes.join(', ')}`;
  const json = JSON.stringify({ notes });
  return { content: [{ type: 'text', text: `${summary}\n\n${json}` }] };
}

export function handleGetKeySignature(
  args: Record<string, unknown>
): ToolContent {
  const key = validateNote(args['key']);
  if (!key.ok) return errorContent(key.error);

  const sig = getKeySignatureCount(key.value);
  const summary = formatKeySignatureSummary(key.value, sig);
  const json = JSON.stringify({ key: key.value, signature: sig });
  return { content: [{ type: 'text', text: `${summary}\n\n${json}` }] };
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

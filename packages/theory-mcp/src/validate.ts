import {
  isModeName,
  isIntervalId,
  parseNoteToken,
  ScaleTypes,
} from '@playbykey/theory';
import type { Note, ModeName, IntervalId, ScaleType } from '@playbykey/theory';

type ValidateOk<T> = { ok: true; value: T };
type ValidateErr = { ok: false; error: string };
export type ValidateResult<T> = ValidateOk<T> | ValidateErr;

const SCALE_TYPE_SET = new Set<string>(Object.values(ScaleTypes));

function isScaleType(value: string): value is ScaleType {
  return SCALE_TYPE_SET.has(value);
}

export function validateNote(value: unknown): ValidateResult<Note> {
  if (typeof value === 'string') {
    const parsed = parseNoteToken(value);
    if (parsed !== null) return { ok: true, value: parsed };
  }
  return {
    ok: false,
    error: `Invalid note: "${String(value)}". Must be one of: C, C#, D, D#, E, F, F#, G, G#, A, A#, B (or their flat equivalents Db, Eb, Gb, Ab, Bb).`,
  };
}

export function validateModeName(value: unknown): ValidateResult<ModeName> {
  if (typeof value === 'string' && isModeName(value))
    return { ok: true, value };
  return {
    ok: false,
    error: `Invalid mode: "${String(value)}". Must be one of: ionian, dorian, phrygian, lydian, mixolydian, aeolian, locrian.`,
  };
}

export function validateIntervalId(value: unknown): ValidateResult<IntervalId> {
  if (typeof value === 'string' && isIntervalId(value))
    return { ok: true, value };
  return {
    ok: false,
    error: `Invalid interval: "${String(value)}". Use one of the interval IDs from the inputSchema enum (e.g. "major_3rd", "perfect_5th").`,
  };
}

export function validateNoteArray(value: unknown): ValidateResult<Note[]> {
  if (!Array.isArray(value)) {
    return {
      ok: false,
      error: 'Invalid notes: expected an array of note strings.',
    };
  }
  const notes: Note[] = [];
  for (const item of value) {
    const result = validateNote(item);
    if (!result.ok) return result;
    notes.push(result.value);
  }
  return { ok: true, value: notes };
}

export function validateScaleType(value: unknown): ValidateResult<ScaleType> {
  if (typeof value === 'string' && isScaleType(value)) {
    return { ok: true, value };
  }
  return {
    ok: false,
    error: `Invalid scale type: "${String(value)}". Must be one of: ${Object.values(ScaleTypes).join(', ')}.`,
  };
}

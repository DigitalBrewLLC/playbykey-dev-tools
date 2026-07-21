import {
  isModeName,
  isIntervalId,
  parseNoteToken,
  ScaleTypes,
  ChordTypes,
  ProgressionIds,
  MelodicMinorModes,
  HarmonicMinorModes,
  BebopScaleTypes,
} from '@playbykey/theory';
import type {
  Note,
  ModeName,
  IntervalId,
  ScaleType,
  ChordType,
  ChordInversion,
  ProgressionId,
  MelodicMinorModeName,
  HarmonicMinorModeName,
  BebopScaleType,
} from '@playbykey/theory';

type ValidateOk<T> = { ok: true; value: T };
type ValidateErr = { ok: false; error: string };
export type ValidateResult<T> = ValidateOk<T> | ValidateErr;

const SCALE_TYPE_SET = new Set<string>(Object.values(ScaleTypes));

function isScaleType(value: string): value is ScaleType {
  return SCALE_TYPE_SET.has(value);
}

const VALID_CHORD_INVERSIONS = new Set<number>([0, 1, 2, 3, 4]);
const CHORD_TYPE_SET = new Set<string>(Object.values(ChordTypes));

function isChordType(value: string): value is ChordType {
  return CHORD_TYPE_SET.has(value);
}

function isChordInversion(value: number): value is ChordInversion {
  return VALID_CHORD_INVERSIONS.has(value);
}

const PROGRESSION_ID_SET = new Set<string>(Object.values(ProgressionIds));

function isProgressionId(value: string): value is ProgressionId {
  return PROGRESSION_ID_SET.has(value);
}

const MELODIC_MINOR_MODE_SET = new Set<string>(
  Object.values(MelodicMinorModes)
);
const HARMONIC_MINOR_MODE_SET = new Set<string>(
  Object.values(HarmonicMinorModes)
);
const BEBOP_SCALE_TYPE_SET = new Set<string>(Object.values(BebopScaleTypes));

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

/** Like validateModeName, but treats an omitted mode as valid (undefined) rather than an error - for tools wrapping an engine function whose mode parameter defaults to Ionian. */
export function validateOptionalModeName(
  value: unknown
): ValidateResult<ModeName | undefined> {
  if (value === undefined) return { ok: true, value: undefined };
  return validateModeName(value);
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

export function validateChordType(value: unknown): ValidateResult<ChordType> {
  if (typeof value === 'string' && isChordType(value)) {
    return { ok: true, value };
  }
  return {
    ok: false,
    error: `Invalid chord type: "${String(value)}". Must be one of: ${Object.values(ChordTypes).join(', ')}.`,
  };
}

export function validateInversion(
  value: unknown
): ValidateResult<ChordInversion> {
  if (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    isChordInversion(value)
  ) {
    return { ok: true, value };
  }
  return {
    ok: false,
    error: `Invalid inversion: "${String(value)}". Must be an integer 0-4 (the valid upper bound depends on the chord type - use get_available_inversions to check; get_chord_inversion itself will still reject an in-range-but-too-high value for a given chord type).`,
  };
}

export function validateDegree(value: unknown): ValidateResult<number> {
  if (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 7
  ) {
    return { ok: true, value };
  }
  return {
    ok: false,
    error: `Invalid degree: "${String(value)}". Must be an integer from 1 to 7.`,
  };
}

export function validateProgressionId(
  value: unknown
): ValidateResult<ProgressionId> {
  if (typeof value === 'string' && isProgressionId(value)) {
    return { ok: true, value };
  }
  return {
    ok: false,
    error: `Invalid progression ID: "${String(value)}". Must be one of: ${Object.values(ProgressionIds).join(', ')}.`,
  };
}

export function validateOctave(value: unknown): ValidateResult<number> {
  if (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= -1 &&
    value <= 9
  ) {
    return { ok: true, value };
  }
  return {
    ok: false,
    error: `Invalid octave: "${String(value)}". Must be an integer, typically -1 to 9 (scientific pitch notation).`,
  };
}

export function validateMidiNumber(value: unknown): ValidateResult<number> {
  if (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 127
  ) {
    return { ok: true, value };
  }
  return {
    ok: false,
    error: `Invalid MIDI number: "${String(value)}". Must be an integer from 0 to 127.`,
  };
}

export function validateMelodicMinorMode(
  value: unknown
): ValidateResult<MelodicMinorModeName> {
  if (typeof value === 'string' && MELODIC_MINOR_MODE_SET.has(value)) {
    return { ok: true, value: value as MelodicMinorModeName };
  }
  return {
    ok: false,
    error: `Invalid melodic minor mode: "${String(value)}". Must be one of: ${Object.values(MelodicMinorModes).join(', ')}.`,
  };
}

export function validateHarmonicMinorMode(
  value: unknown
): ValidateResult<HarmonicMinorModeName> {
  if (typeof value === 'string' && HARMONIC_MINOR_MODE_SET.has(value)) {
    return { ok: true, value: value as HarmonicMinorModeName };
  }
  return {
    ok: false,
    error: `Invalid harmonic minor mode: "${String(value)}". Must be one of: ${Object.values(HarmonicMinorModes).join(', ')}.`,
  };
}

export function validateBebopScaleType(
  value: unknown
): ValidateResult<BebopScaleType> {
  if (typeof value === 'string' && BEBOP_SCALE_TYPE_SET.has(value)) {
    return { ok: true, value: value as BebopScaleType };
  }
  return {
    ok: false,
    error: `Invalid bebop scale type: "${String(value)}". Must be one of: ${Object.values(BebopScaleTypes).join(', ')}.`,
  };
}

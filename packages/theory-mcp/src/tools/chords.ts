import {
  getChordNotes,
  getDiatonicChords,
  getChordByDegree,
  getAvailableInversions,
  getChordInversion,
} from '@playbykey/theory';
import {
  validateNote,
  validateModeName,
  validateChordType,
  validateInversion,
  validateDegree,
} from '../validate.js';
import { type ToolContent, errorContent, okContent } from '../tool-helpers.js';

export function handleGetChordNotes(
  args: Record<string, unknown>
): ToolContent {
  const root = validateNote(args['root']);
  const chordType = validateChordType(args['chord_type']);
  if (!root.ok) return errorContent(root.error);
  if (!chordType.ok) return errorContent(chordType.error);

  const notes = getChordNotes(root.value, chordType.value);
  const summary = `${root.value} ${chordType.value}: ${notes.join(', ')}`;
  return okContent(summary, {
    root: root.value,
    chordType: chordType.value,
    notes,
  });
}

export function handleGetDiatonicChords(
  args: Record<string, unknown>
): ToolContent {
  const root = validateNote(args['root']);
  const mode = validateModeName(args['mode']);
  if (!root.ok) return errorContent(root.error);
  if (!mode.ok) return errorContent(mode.error);

  const chords = getDiatonicChords(root.value, mode.value);
  const summary = `Diatonic chords in ${root.value} ${mode.value} (${chords.length} chords) - see the chords field for each chord's root and type.`;
  return okContent(summary, { root: root.value, mode: mode.value, chords });
}

export function handleGetChordByDegree(
  args: Record<string, unknown>
): ToolContent {
  const degree = validateDegree(args['degree']);
  const root = validateNote(args['root']);
  const mode = validateModeName(args['mode']);
  if (!degree.ok) return errorContent(degree.error);
  if (!root.ok) return errorContent(root.error);
  if (!mode.ok) return errorContent(mode.error);

  const chord = getChordByDegree(degree.value, root.value, mode.value);
  const summary = `Degree ${degree.value} of ${root.value} ${mode.value}: ${chord.root} ${chord.type}`;
  return okContent(summary, {
    degree: degree.value,
    root: root.value,
    mode: mode.value,
    chord,
  });
}

export function handleGetAvailableInversions(
  args: Record<string, unknown>
): ToolContent {
  const chordType = validateChordType(args['chord_type']);
  if (!chordType.ok) return errorContent(chordType.error);

  const inversions = getAvailableInversions(chordType.value);
  const summary = `${chordType.value} has ${inversions.length} valid inversions: ${inversions.join(', ')}`;
  return okContent(summary, { chordType: chordType.value, inversions });
}

export function handleGetChordInversion(
  args: Record<string, unknown>
): ToolContent {
  const root = validateNote(args['root']);
  const chordType = validateChordType(args['chord_type']);
  const inversion = validateInversion(args['inversion']);
  if (!root.ok) return errorContent(root.error);
  if (!chordType.ok) return errorContent(chordType.error);
  if (!inversion.ok) return errorContent(inversion.error);

  try {
    const notes = getChordInversion(
      { root: root.value, type: chordType.value },
      inversion.value
    );
    const summary = `${root.value} ${chordType.value}, inversion ${inversion.value}: ${notes.join(', ')}`;
    return okContent(summary, {
      root: root.value,
      chordType: chordType.value,
      inversion: inversion.value,
      notes,
    });
  } catch (error) {
    return errorContent(error instanceof Error ? error.message : String(error));
  }
}

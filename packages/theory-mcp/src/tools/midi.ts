import { noteToMidi, midiToNote, noteToFrequency } from '@playbykey/theory';
import {
  validateNote,
  validateOctave,
  validateMidiNumber,
} from '../validate.js';
import { type ToolContent, errorContent, okContent } from '../tool-helpers.js';

export function handleNoteToMidi(args: Record<string, unknown>): ToolContent {
  const note = validateNote(args['note']);
  const octave = validateOctave(args['octave']);
  if (!note.ok) return errorContent(note.error);
  if (!octave.ok) return errorContent(octave.error);

  const midiNumber = noteToMidi(note.value, octave.value);
  if (midiNumber < 0 || midiNumber > 127) {
    return errorContent(
      `Invalid note/octave combination: ${note.value}${octave.value} is MIDI note ${midiNumber}, outside the valid MIDI range (0-127).`
    );
  }
  const summary = `${note.value}${octave.value} is MIDI note ${midiNumber}`;
  return okContent(summary, {
    note: note.value,
    octave: octave.value,
    midiNumber,
  });
}

export function handleMidiToNote(args: Record<string, unknown>): ToolContent {
  const midiNumber = validateMidiNumber(args['midi_number']);
  if (!midiNumber.ok) return errorContent(midiNumber.error);

  const result = midiToNote(midiNumber.value);
  const summary = `MIDI note ${midiNumber.value} is ${result.note}${result.octave}`;
  return okContent(summary, { midiNumber: midiNumber.value, ...result });
}

export function handleNoteToFrequency(
  args: Record<string, unknown>
): ToolContent {
  const note = validateNote(args['note']);
  const octave = validateOctave(args['octave']);
  if (!note.ok) return errorContent(note.error);
  if (!octave.ok) return errorContent(octave.error);

  const frequency = noteToFrequency(note.value, octave.value);
  const summary = `${note.value}${octave.value} is ${frequency.toFixed(2)} Hz`;
  return okContent(summary, {
    note: note.value,
    octave: octave.value,
    frequency,
  });
}

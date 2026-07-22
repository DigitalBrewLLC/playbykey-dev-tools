import { describe, it, expect } from 'vitest';
import {
  handleNoteToMidi,
  handleMidiToNote,
  handleNoteToFrequency,
} from '../src/tools/midi.js';

describe('handleNoteToMidi', () => {
  it('returns 60 for C4', () => {
    const result = handleNoteToMidi({ note: 'C', octave: 4 });
    expect(result.content[0]?.text).toContain('"midiNumber":60');
  });

  it('returns error for invalid note', () => {
    const result = handleNoteToMidi({ note: 'X', octave: 4 });
    expect(result.content[0]?.text).toContain('Invalid note');
  });

  it('returns error for invalid octave', () => {
    const result = handleNoteToMidi({ note: 'C', octave: 'bogus' });
    expect(result.content[0]?.text).toContain('Invalid octave');
  });

  it('accepts flat-spelled notes, normalizing to the same result as sharps', () => {
    const flat = handleNoteToMidi({ note: 'Db', octave: 4 });
    const sharp = handleNoteToMidi({ note: 'C#', octave: 4 });
    expect(flat.content[0]?.text).toEqual(sharp.content[0]?.text);
  });

  it('returns error-content, not an out-of-range MIDI number, for a note/octave combination above 127', () => {
    const result = handleNoteToMidi({ note: 'B', octave: 9 });
    expect(result.content[0]?.text).toContain('outside the valid MIDI range');
  });

  it('accepts the highest valid note/octave combination (G9 = MIDI 127)', () => {
    const result = handleNoteToMidi({ note: 'G', octave: 9 });
    expect(result.content[0]?.text).toContain('"midiNumber":127');
  });
});

describe('handleMidiToNote', () => {
  it('returns A4 for MIDI 69', () => {
    const result = handleMidiToNote({ midi_number: 69 });
    expect(result.content[0]?.text).toContain('"note":"A"');
    expect(result.content[0]?.text).toContain('"octave":4');
  });

  it('returns error for invalid MIDI number', () => {
    const result = handleMidiToNote({ midi_number: 200 });
    expect(result.content[0]?.text).toContain('Invalid MIDI number');
  });
});

describe('handleNoteToFrequency', () => {
  it('returns 440 for A4', () => {
    const result = handleNoteToFrequency({ note: 'A', octave: 4 });
    expect(result.content[0]?.text).toContain('440.00 Hz');
  });

  it('returns error for invalid note', () => {
    const result = handleNoteToFrequency({ note: 'X', octave: 4 });
    expect(result.content[0]?.text).toContain('Invalid note');
  });

  it('returns error for invalid octave', () => {
    const result = handleNoteToFrequency({ note: 'A', octave: 'bogus' });
    expect(result.content[0]?.text).toContain('Invalid octave');
  });

  it('accepts flat-spelled notes, normalizing to the same result as sharps', () => {
    const flat = handleNoteToFrequency({ note: 'Db', octave: 4 });
    const sharp = handleNoteToFrequency({ note: 'C#', octave: 4 });
    expect(flat.content[0]?.text).toEqual(sharp.content[0]?.text);
  });
});

import { describe, expect, it } from 'vitest';
import { noteToMidi, midiToNote, noteToFrequency } from '../src/midi';
import type { Note } from '../src/types';

describe('noteToMidi', () => {
  it('returns 60 for C4 (middle C)', () => {
    expect(noteToMidi('C', 4)).toBe(60);
  });

  it('returns 69 for A4', () => {
    expect(noteToMidi('A', 4)).toBe(69);
  });
});

describe('midiToNote', () => {
  it('returns C4 for MIDI 60', () => {
    expect(midiToNote(60)).toEqual({ note: 'C', octave: 4 });
  });

  it('returns A4 for MIDI 69', () => {
    expect(midiToNote(69)).toEqual({ note: 'A', octave: 4 });
  });

  it('round-trips through noteToMidi for several note/octave pairs', () => {
    const pairs: ReadonlyArray<readonly [Note, number]> = [
      ['C', 4],
      ['F#', 3],
      ['B', 5],
    ];
    for (const [note, octave] of pairs) {
      const midiNumber = noteToMidi(note, octave);
      expect(midiToNote(midiNumber)).toEqual({ note, octave });
    }
  });
});

describe('noteToFrequency', () => {
  it('returns 440 for A4', () => {
    expect(noteToFrequency('A', 4)).toBeCloseTo(440, 5);
  });
});

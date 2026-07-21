import { useMemo, useState } from 'react';
import {
  noteToMidi,
  midiToNote,
  noteToFrequency,
  Notes,
} from '@playbykey/theory';
import type { Note } from '@playbykey/theory';
import { FunctionCard } from '../ui/FunctionCard';
import { NoteSelect } from '../ui/NoteSelect';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.5rem',
};

const inputStyle = {
  padding: '0.375rem 0.5rem',
  borderRadius: '0.375rem',
  border: '1px solid var(--sl-color-gray-5)',
  background: 'var(--sl-color-gray-6)',
  color: 'var(--sl-color-gray-1)',
  width: '5rem',
};

const labelStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.25rem',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--sl-color-gray-2)',
};

const MidiFrequencyPlayground = () => {
  const [midiNote, setMidiNote] = useState<Note>(Notes.C);
  const [midiOctave, setMidiOctave] = useState(4);

  const [reverseMidiNumber, setReverseMidiNumber] = useState(60);

  const [freqNote, setFreqNote] = useState<Note>(Notes.A);
  const [freqOctave, setFreqOctave] = useState(4);

  const midiNumber = useMemo(
    () => noteToMidi(midiNote, midiOctave),
    [midiNote, midiOctave]
  );

  const noteFromMidi = useMemo(
    () => midiToNote(reverseMidiNumber),
    [reverseMidiNumber]
  );

  const frequency = useMemo(
    () => noteToFrequency(freqNote, freqOctave),
    [freqNote, freqOctave]
  );

  return (
    <div style={containerStyle}>
      <FunctionCard
        name="noteToMidi"
        signature="noteToMidi(note: Note, octave: number): number"
        description="Returns the MIDI note number for a note at a given octave, using scientific pitch notation (C4 = middle C = MIDI 60)."
        result={midiNumber}
      >
        <NoteSelect value={midiNote} onChange={setMidiNote} label="Note" />
        <label style={labelStyle}>
          Octave
          <input
            style={inputStyle}
            type="number"
            min={0}
            max={8}
            value={midiOctave}
            onChange={(e) => setMidiOctave(Number(e.target.value))}
          />
        </label>
      </FunctionCard>

      <FunctionCard
        name="midiToNote"
        signature="midiToNote(midiNumber: number): { note: Note; octave: number }"
        description="Returns the note and octave for a given MIDI note number - the inverse of noteToMidi."
        result={noteFromMidi}
      >
        <label style={labelStyle}>
          MIDI number
          <input
            style={inputStyle}
            type="number"
            min={0}
            max={127}
            value={reverseMidiNumber}
            onChange={(e) => setReverseMidiNumber(Number(e.target.value))}
          />
        </label>
      </FunctionCard>

      <FunctionCard
        name="noteToFrequency"
        signature="noteToFrequency(note: Note, octave: number): number"
        description="Returns the frequency in Hz for a note at a given octave, equal temperament, A4 = 440Hz."
        result={frequency}
      >
        <NoteSelect value={freqNote} onChange={setFreqNote} label="Note" />
        <label style={labelStyle}>
          Octave
          <input
            style={inputStyle}
            type="number"
            min={0}
            max={8}
            value={freqOctave}
            onChange={(e) => setFreqOctave(Number(e.target.value))}
          />
        </label>
      </FunctionCard>
    </div>
  );
};

export { MidiFrequencyPlayground };
export default MidiFrequencyPlayground;

import { useMemo, useState } from 'react';
import {
  getBluesNotes,
  getHarmonicMinorNotes,
  getPentatonicNotes,
  getScaleDegree,
  getScaleDegrees,
  getScaleNotes,
  isNoteInScale,
  Notes,
  PentatonicTypes,
  ScaleTypes,
} from '@playbykey/theory';
import type { Note, PentatonicType, ScaleType } from '@playbykey/theory';
import { FieldSelect } from '../ui/FieldSelect';
import { FunctionCard } from '../ui/FunctionCard';
import { NoteSelect } from '../ui/NoteSelect';
import { NoteSpellingResults } from '../ui/NoteSpellingResults';
import { ScaleTypeSelect } from '../ui/ScaleTypeSelect';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.5rem',
};

const ScalesPlayground = () => {
  const [bluesRoot, setBluesRoot] = useState<Note>(Notes.A);
  const [harmonicRoot, setHarmonicRoot] = useState<Note>(Notes.A);
  const [pentRoot, setPentRoot] = useState<Note>(Notes.C);
  const [pentType, setPentType] = useState<PentatonicType>(
    PentatonicTypes.Major
  );
  const [scaleNotesRoot, setScaleNotesRoot] = useState<Note>(Notes.A);
  const [scaleNotesType, setScaleNotesType] = useState<ScaleType>(
    ScaleTypes.PentatonicMajor
  );
  const [degreesType, setDegreesType] = useState<ScaleType>(ScaleTypes.Blues);
  const [degreeRoot, setDegreeRoot] = useState<Note>(Notes.C);
  const [degreeType, setDegreeType] = useState<ScaleType>(ScaleTypes.Major);
  const [degreeNote, setDegreeNote] = useState<Note>(Notes.E);
  const [inScaleRoot, setInScaleRoot] = useState<Note>(Notes.C);
  const [inScaleType, setInScaleType] = useState<ScaleType>(ScaleTypes.Major);
  const [inScaleNote, setInScaleNote] = useState<Note>(Notes.E);

  const bluesNotes = useMemo(() => getBluesNotes(bluesRoot), [bluesRoot]);
  const harmonicMinorNotes = useMemo(
    () => getHarmonicMinorNotes(harmonicRoot),
    [harmonicRoot]
  );
  const pentatonicNotes = useMemo(
    () => getPentatonicNotes(pentRoot, pentType),
    [pentRoot, pentType]
  );
  const derivedNotes = useMemo(
    () => getScaleNotes(scaleNotesRoot, scaleNotesType),
    [scaleNotesRoot, scaleNotesType]
  );
  const emphasisDegrees = useMemo(
    () => getScaleDegrees(degreesType),
    [degreesType]
  );
  const scaleDegreeResult = useMemo(
    () => getScaleDegree(degreeRoot, degreeType, degreeNote),
    [degreeRoot, degreeType, degreeNote]
  );
  const inScaleResult = useMemo(
    () => isNoteInScale(inScaleRoot, inScaleType, inScaleNote),
    [inScaleRoot, inScaleType, inScaleNote]
  );

  return (
    <div style={containerStyle}>
      <FunctionCard
        name="getBluesNotes"
        signature="getBluesNotes(root: Note): Note[]"
        description="Returns the six-note blues scale for a root."
        result={bluesNotes}
      >
        <NoteSelect value={bluesRoot} onChange={setBluesRoot} label="Root" />
      </FunctionCard>

      <FunctionCard
        name="getHarmonicMinorNotes"
        signature="getHarmonicMinorNotes(root: Note): Note[]"
        description="Returns the seven-note harmonic minor scale for a root."
        result={harmonicMinorNotes}
      >
        <NoteSelect
          value={harmonicRoot}
          onChange={setHarmonicRoot}
          label="Root"
        />
      </FunctionCard>

      <FunctionCard
        name="getPentatonicNotes"
        signature="getPentatonicNotes(root: Note, type: PentatonicType): Note[]"
        description="Returns the five notes of a major or minor pentatonic scale for a given root."
        result={pentatonicNotes}
      >
        <NoteSelect value={pentRoot} onChange={setPentRoot} label="Root" />
        <FieldSelect
          label="Type"
          value={pentType}
          onChange={(v) => setPentType(v as PentatonicType)}
        >
          <option value={PentatonicTypes.Major}>Major</option>
          <option value={PentatonicTypes.Minor}>Minor</option>
        </FieldSelect>
      </FunctionCard>

      <FunctionCard
        name="getScaleNotes"
        signature="getScaleNotes(root: Note, scaleType: ScaleType): Note[]"
        description="Returns the notes for any scale type - major, blues, pentatonic, harmonic minor, and chromatic."
        result={derivedNotes}
        additionalResults={<NoteSpellingResults notes={derivedNotes} />}
      >
        <NoteSelect
          value={scaleNotesRoot}
          onChange={setScaleNotesRoot}
          label="Root"
        />
        <ScaleTypeSelect value={scaleNotesType} onChange={setScaleNotesType} />
      </FunctionCard>

      <FunctionCard
        name="getScaleDegrees"
        signature="getScaleDegrees(scaleType: ScaleType): number[]"
        description="Returns the active scale degrees for a given scale type."
        result={emphasisDegrees}
      >
        <ScaleTypeSelect value={degreesType} onChange={setDegreesType} />
      </FunctionCard>

      <FunctionCard
        name="getScaleDegree"
        signature="getScaleDegree(root: Note, scaleType: ScaleType, note: Note): number | null"
        description="Returns the 1-based scale degree of a note within a scale, or null if the note is not present."
        result={scaleDegreeResult}
      >
        <NoteSelect value={degreeRoot} onChange={setDegreeRoot} label="Root" />
        <ScaleTypeSelect value={degreeType} onChange={setDegreeType} />
        <NoteSelect value={degreeNote} onChange={setDegreeNote} label="Note" />
      </FunctionCard>

      <FunctionCard
        name="isNoteInScale"
        signature="isNoteInScale(root: Note, scaleType: ScaleType, note: Note): boolean"
        description="Returns true if the note is present in the given root + scale type."
        result={inScaleResult}
      >
        <NoteSelect
          value={inScaleRoot}
          onChange={setInScaleRoot}
          label="Root"
        />
        <ScaleTypeSelect value={inScaleType} onChange={setInScaleType} />
        <NoteSelect
          value={inScaleNote}
          onChange={setInScaleNote}
          label="Note"
        />
      </FunctionCard>
    </div>
  );
};

export { ScalesPlayground };
export default ScalesPlayground;

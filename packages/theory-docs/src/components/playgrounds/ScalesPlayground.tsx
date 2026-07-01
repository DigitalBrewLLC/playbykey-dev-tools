import { useMemo, useState } from 'react';
import {
  getBluesNotes,
  getHarmonicMinorNotes,
  getPentatonicNotes,
  getScaleDegrees,
  getScaleNotes,
  Notes,
  PentatonicTypes,
  ScaleTypes,
} from '@playbykey/theory';
import type { Note, PentatonicType, ScaleType } from '@playbykey/theory';
import { FieldSelect } from '../ui/FieldSelect';
import { FunctionCard } from '../ui/FunctionCard';
import { NoteSelect } from '../ui/NoteSelect';
import { ScaleTypeSelect } from '../ui/ScaleTypeSelect';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.5rem',
};

const ScalesPlayground = () => {
  const [root, setRoot] = useState<Note>(Notes.A);
  const [derivedType, setDerivedType] = useState<ScaleType>(
    ScaleTypes.PentatonicMajor
  );
  const [emphasisType, setEmphasisType] = useState<ScaleType>(ScaleTypes.Blues);
  const [pentRoot, setPentRoot] = useState<Note>(Notes.C);
  const [pentType, setPentType] = useState<PentatonicType>(
    PentatonicTypes.Major
  );

  const bluesNotes = useMemo(() => getBluesNotes(root), [root]);
  const harmonicMinorNotes = useMemo(() => getHarmonicMinorNotes(root), [root]);
  const pentatonicNotes = useMemo(
    () => getPentatonicNotes(pentRoot, pentType),
    [pentRoot, pentType]
  );
  const derivedNotes = useMemo(
    () => getScaleNotes(root, derivedType),
    [root, derivedType]
  );
  const emphasisDegrees = useMemo(
    () => getScaleDegrees(emphasisType),
    [emphasisType]
  );

  return (
    <div style={containerStyle}>
      <FunctionCard
        name="getBluesNotes"
        signature="getBluesNotes(root: Note): Note[]"
        description="Returns the six-note blues scale for a root."
        result={bluesNotes}
      >
        <NoteSelect value={root} onChange={setRoot} label="Root" />
      </FunctionCard>

      <FunctionCard
        name="getHarmonicMinorNotes"
        signature="getHarmonicMinorNotes(root: Note): Note[]"
        description="Returns the seven-note harmonic minor scale for a root."
        result={harmonicMinorNotes}
      >
        <NoteSelect value={root} onChange={setRoot} label="Root" />
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
        description="Returns the notes for any scale type — major, blues, pentatonic, harmonic minor, and chromatic."
        result={derivedNotes}
      >
        <NoteSelect value={root} onChange={setRoot} label="Root" />
        <ScaleTypeSelect value={derivedType} onChange={setDerivedType} />
      </FunctionCard>

      <FunctionCard
        name="getScaleDegrees"
        signature="getScaleDegrees(scaleType: ScaleType): number[]"
        description="Returns the active scale degrees for a given scale type."
        result={emphasisDegrees}
      >
        <ScaleTypeSelect value={emphasisType} onChange={setEmphasisType} />
      </FunctionCard>
    </div>
  );
};

export { ScalesPlayground };
export default ScalesPlayground;

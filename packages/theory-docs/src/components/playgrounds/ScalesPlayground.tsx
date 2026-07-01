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
import { FunctionCard } from '../ui/FunctionCard';
import { NoteSelect } from '../ui/NoteSelect';
import { ScaleTypeSelect } from '../ui/ScaleTypeSelect';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.5rem',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.25rem',
};

const labelStyle = {
  fontSize: '0.75rem',
  color: 'var(--sl-color-gray-3)',
  fontWeight: 500,
};

const selectStyle = {
  padding: '0.375rem 0.5rem',
  borderRadius: '0.375rem',
  border: '1px solid var(--sl-color-gray-5)',
  background: 'var(--sl-color-bg)',
  color: 'var(--sl-color-text)',
  fontSize: '0.875rem',
  cursor: 'pointer',
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
        <label style={fieldStyle}>
          <span style={labelStyle}>Type</span>
          <select
            style={selectStyle}
            value={pentType}
            onChange={(e) => setPentType(e.target.value as PentatonicType)}
          >
            <option value={PentatonicTypes.Major}>major</option>
            <option value={PentatonicTypes.Minor}>minor</option>
          </select>
        </label>
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

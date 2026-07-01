import { useMemo, useState } from 'react';
import {
  getBluesNotes,
  getDerivedScaleNotes,
  getHarmonicMinorNotes,
  getPentatonicNotes,
  getScaleContextNotes,
  getScaleEmphasisDegrees,
  Notes,
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
  const [contextType, setContextType] = useState<ScaleType>(ScaleTypes.Blues);
  const [emphasisType, setEmphasisType] = useState<ScaleType>(ScaleTypes.Blues);
  const [pentRoot, setPentRoot] = useState<Note>(Notes.C);
  const [pentType, setPentType] = useState<PentatonicType>('major');

  const bluesNotes = useMemo(() => getBluesNotes(root), [root]);
  const harmonicMinorNotes = useMemo(() => getHarmonicMinorNotes(root), [root]);
  const pentatonicNotes = useMemo(
    () => getPentatonicNotes(pentRoot, pentType),
    [pentRoot, pentType]
  );
  const derivedNotes = useMemo(
    () => getDerivedScaleNotes(root, derivedType),
    [root, derivedType]
  );
  const contextNotes = useMemo(
    () => getScaleContextNotes(root, contextType),
    [root, contextType]
  );
  const emphasisDegrees = useMemo(
    () => getScaleEmphasisDegrees(emphasisType),
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
            <option value="major">major</option>
            <option value="minor">minor</option>
          </select>
        </label>
      </FunctionCard>

      <FunctionCard
        name="getDerivedScaleNotes"
        signature="getDerivedScaleNotes(root: Note, scaleType: ScaleType): Note[]"
        description="Derives scale notes for major, blues, pentatonic, harmonic minor, and other types."
        result={derivedNotes}
      >
        <NoteSelect value={root} onChange={setRoot} label="Root" />
        <ScaleTypeSelect value={derivedType} onChange={setDerivedType} />
      </FunctionCard>

      <FunctionCard
        name="getScaleContextNotes"
        signature="getScaleContextNotes(root: Note, scaleType: ScaleType): Note[]"
        description="Returns the parent context scale for a derived scale type."
        result={contextNotes}
      >
        <NoteSelect value={root} onChange={setRoot} label="Root" />
        <ScaleTypeSelect value={contextType} onChange={setContextType} />
      </FunctionCard>

      <FunctionCard
        name="getScaleEmphasisDegrees"
        signature="getScaleEmphasisDegrees(scaleType: ScaleType): number[]"
        description="Returns emphasized scale degrees for a derived scale type."
        result={emphasisDegrees}
      >
        <ScaleTypeSelect value={emphasisType} onChange={setEmphasisType} />
      </FunctionCard>
    </div>
  );
};

export { ScalesPlayground };
export default ScalesPlayground;

import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  getBluesNotes,
  getDerivedScaleNotes,
  getHarmonicMinorNotes,
  getPentatonicDegrees,
  getScaleContextNotes,
  getScaleEmphasisDegrees,
} from '@playbykey/theory';
import type { ModeName, Note, ScaleKind } from '@playbykey/theory';
import { FunctionCard } from '../ui/FunctionCard';
import { ModeSelect } from '../ui/ModeSelect';
import { NoteSelect } from '../ui/NoteSelect';
import { ScaleKindSelect } from '../ui/ScaleKindSelect';

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

const labelStyle: CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--sl-color-gray-2)',
};

const selectStyle: CSSProperties = {
  padding: '0.375rem 0.5rem',
  borderRadius: '0.375rem',
  border: '1px solid var(--sl-color-gray-5)',
  background: 'var(--sl-color-gray-6)',
  color: 'var(--sl-color-gray-1)',
};

const ScalesPlayground = () => {
  const [root, setRoot] = useState<Note>('A');
  const [pentatonicKind, setPentatonicKind] = useState<'major' | 'minor'>(
    'major'
  );
  const [derivedKind, setDerivedKind] = useState<ScaleKind>('pentatonic');
  const [derivedMode, setDerivedMode] = useState<ModeName>('ionian');
  const [contextMode, setContextMode] = useState<ModeName>('aeolian');
  const [contextKind, setContextKind] = useState<ScaleKind>('blues');
  const [emphasisKind, setEmphasisKind] = useState<ScaleKind>('blues');

  const bluesNotes = useMemo(() => getBluesNotes(root), [root]);
  const harmonicMinorNotes = useMemo(() => getHarmonicMinorNotes(root), [root]);
  const pentatonicDegrees = useMemo(
    () => getPentatonicDegrees(pentatonicKind),
    [pentatonicKind]
  );
  const derivedNotes = useMemo(
    () => getDerivedScaleNotes(root, derivedMode, derivedKind),
    [root, derivedMode, derivedKind]
  );
  const contextNotes = useMemo(
    () => getScaleContextNotes(root, contextMode, contextKind),
    [root, contextMode, contextKind]
  );
  const emphasisDegrees = useMemo(
    () => getScaleEmphasisDegrees(emphasisKind),
    [emphasisKind]
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
        name="getPentatonicDegrees"
        signature="getPentatonicDegrees(kind: 'major' | 'minor'): number[]"
        description="Returns scale degrees used by major or minor pentatonic."
        result={pentatonicDegrees}
      >
        <label style={fieldStyle}>
          <span style={labelStyle}>Pentatonic Kind</span>
          <select
            style={selectStyle}
            value={pentatonicKind}
            onChange={(event) =>
              setPentatonicKind(event.target.value as 'major' | 'minor')
            }
          >
            <option value="major">Major</option>
            <option value="minor">Minor</option>
          </select>
        </label>
      </FunctionCard>

      <FunctionCard
        name="getDerivedScaleNotes"
        signature="getDerivedScaleNotes(root: Note, mode: ModeName, kind: ScaleKind): Note[]"
        description="Derives scale notes for blues, pentatonic, harmonic minor, and other kinds."
        result={derivedNotes}
      >
        <NoteSelect value={root} onChange={setRoot} label="Root" />
        <ModeSelect value={derivedMode} onChange={setDerivedMode} />
        <ScaleKindSelect value={derivedKind} onChange={setDerivedKind} />
      </FunctionCard>

      <FunctionCard
        name="getScaleContextNotes"
        signature="getScaleContextNotes(root: Note, mode: ModeName, kind: ScaleKind): Note[]"
        description="Returns the parent context scale for a derived scale type."
        result={contextNotes}
      >
        <NoteSelect value={root} onChange={setRoot} label="Root" />
        <ModeSelect value={contextMode} onChange={setContextMode} />
        <ScaleKindSelect value={contextKind} onChange={setContextKind} />
      </FunctionCard>

      <FunctionCard
        name="getScaleEmphasisDegrees"
        signature="getScaleEmphasisDegrees(kind: ScaleKind): number[]"
        description="Returns emphasized scale degrees for a derived scale kind."
        result={emphasisDegrees}
      >
        <ScaleKindSelect value={emphasisKind} onChange={setEmphasisKind} />
      </FunctionCard>
    </div>
  );
};

export { ScalesPlayground };
export default ScalesPlayground;

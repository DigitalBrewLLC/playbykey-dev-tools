import { useMemo, useState } from 'react';
import {
  getBluesNotes,
  getDerivedScaleNotes,
  getHarmonicMinorNotes,
  getPentatonicDegrees,
  getScaleContextNotes,
  getScaleEmphasisDegrees,
  Modes,
  Notes,
  ScaleTypes,
} from '@playbykey/theory';
import type { ModeName, Note, ScaleType } from '@playbykey/theory';
import { FunctionCard } from '../ui/FunctionCard';
import { ModeSelect } from '../ui/ModeSelect';
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
    ScaleTypes.Pentatonic
  );
  const [derivedMode, setDerivedMode] = useState<ModeName>(Modes.Ionian);
  const [contextMode, setContextMode] = useState<ModeName>(Modes.Aeolian);
  const [contextType, setContextType] = useState<ScaleType>(ScaleTypes.Blues);
  const [emphasisType, setEmphasisType] = useState<ScaleType>(ScaleTypes.Blues);

  const bluesNotes = useMemo(() => getBluesNotes(root), [root]);
  const harmonicMinorNotes = useMemo(() => getHarmonicMinorNotes(root), [root]);
  const pentatonicDegrees = getPentatonicDegrees();
  const derivedNotes = useMemo(
    () => getDerivedScaleNotes(root, derivedMode, derivedType),
    [root, derivedMode, derivedType]
  );
  const contextNotes = useMemo(
    () => getScaleContextNotes(root, contextMode, contextType),
    [root, contextMode, contextType]
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
        name="getPentatonicDegrees"
        signature="getPentatonicDegrees(): readonly number[]"
        description="Returns the five scale degrees used by pentatonic subsets."
        result={pentatonicDegrees}
      />

      <FunctionCard
        name="getDerivedScaleNotes"
        signature="getDerivedScaleNotes(root: Note, mode: ModeName, scaleType: ScaleType): Note[]"
        description="Derives scale notes for blues, pentatonic, harmonic minor, and other types."
        result={derivedNotes}
      >
        <NoteSelect value={root} onChange={setRoot} label="Root" />
        <ModeSelect value={derivedMode} onChange={setDerivedMode} />
        <ScaleTypeSelect value={derivedType} onChange={setDerivedType} />
      </FunctionCard>

      <FunctionCard
        name="getScaleContextNotes"
        signature="getScaleContextNotes(root: Note, mode: ModeName, scaleType: ScaleType): Note[]"
        description="Returns the parent context scale for a derived scale type."
        result={contextNotes}
      >
        <NoteSelect value={root} onChange={setRoot} label="Root" />
        <ModeSelect value={contextMode} onChange={setContextMode} />
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

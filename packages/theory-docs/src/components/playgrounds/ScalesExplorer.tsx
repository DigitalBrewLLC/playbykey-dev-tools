import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { SCALE_DEFINITIONS, getDerivedScaleNotes } from '@playbykey/theory';
import type { ModeName, Note, ScaleKind } from '@playbykey/theory';
import { ModeSelect } from '../ui/ModeSelect';
import { NoteSelect } from '../ui/NoteSelect';
import { ResultPanel } from '../ui/ResultPanel';
import { ScaleKindSelect } from '../ui/ScaleKindSelect';

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const controlsRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
};

const infoBlockStyle: CSSProperties = {
  padding: '1rem',
  borderRadius: '0.5rem',
  border: '1px solid var(--sl-color-gray-5)',
  background: 'var(--sl-color-gray-6)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const modeNameStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--sl-color-accent)',
};

const snippetStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.875rem',
  color: 'var(--sl-color-gray-2)',
};

const snippetCallStyle: CSSProperties = {
  color: 'var(--sl-color-accent)',
};

const ScalesExplorer = () => {
  const [root, setRoot] = useState<Note>('C');
  const [mode, setMode] = useState<ModeName>('ionian');
  const [scaleKind, setScaleKind] = useState<ScaleKind>('mode');

  const modeIsRelevant = scaleKind === 'mode' || scaleKind === 'pentatonic';
  const definition = useMemo(() => SCALE_DEFINITIONS[scaleKind], [scaleKind]);
  const notes = useMemo(
    () => getDerivedScaleNotes(root, mode, scaleKind),
    [root, mode, scaleKind]
  );

  return (
    <div style={containerStyle}>
      <div style={controlsRowStyle}>
        <NoteSelect value={root} onChange={setRoot} />
        <ScaleKindSelect value={scaleKind} onChange={setScaleKind} />
        {modeIsRelevant && <ModeSelect value={mode} onChange={setMode} />}
      </div>

      <div style={infoBlockStyle}>
        <p style={modeNameStyle}>{definition.label}</p>
      </div>

      <p style={snippetStyle}>
        <code
          style={snippetCallStyle}
        >{`getDerivedScaleNotes('${root}', '${mode}', '${scaleKind}')`}</code>
      </p>

      <ResultPanel label="getDerivedScaleNotes result" value={notes} />
    </div>
  );
};

export { ScalesExplorer };
export default ScalesExplorer;

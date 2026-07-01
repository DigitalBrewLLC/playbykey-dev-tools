import { useMemo, useState } from 'react';
import {
  SCALE_DEFINITIONS,
  getScaleNotes,
  ScaleTypes,
} from '@playbykey/theory';
import type { Note, ScaleType } from '@playbykey/theory';
import { NoteSelect } from '../ui/NoteSelect';
import { ResultPanel } from '../ui/ResultPanel';
import { ScaleTypeSelect } from '../ui/ScaleTypeSelect';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '1.5rem',
};

const controlsRowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '0.75rem',
};

const infoBlockStyle = {
  padding: '1rem',
  borderRadius: '0.5rem',
  border: '1px solid var(--sl-color-gray-5)',
  background: 'var(--sl-color-gray-6)',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.5rem',
};

const modeNameStyle = {
  margin: 0,
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--sl-color-accent-high)',
};

const snippetStyle = {
  margin: 0,
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.875rem',
  color: 'var(--sl-color-gray-2)',
};

const snippetCallStyle = {
  color: 'var(--sl-color-accent-high)',
};

const ScalesExplorer = () => {
  const [root, setRoot] = useState<Note>('C');
  const [scaleType, setScaleType] = useState<ScaleType>(ScaleTypes.Major);

  const definition = useMemo(() => SCALE_DEFINITIONS[scaleType], [scaleType]);
  const notes = useMemo(
    () => getScaleNotes(root, scaleType),
    [root, scaleType]
  );

  return (
    <div style={containerStyle}>
      <div style={controlsRowStyle}>
        <NoteSelect value={root} onChange={setRoot} />
        <ScaleTypeSelect value={scaleType} onChange={setScaleType} />
      </div>

      <div style={infoBlockStyle}>
        <p style={modeNameStyle}>{definition.label}</p>
      </div>

      <p style={snippetStyle}>
        <code
          style={snippetCallStyle}
        >{`getScaleNotes('${root}', '${scaleType}')`}</code>
      </p>

      <ResultPanel label="getScaleNotes result" value={notes} />
    </div>
  );
};

export { ScalesExplorer };
export default ScalesExplorer;

import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  INTERVAL_DEFINITIONS,
  resolveIntervalEndpoints,
} from '@playbykey/theory';
import type { IntervalId, ModeName, Note } from '@playbykey/theory';
import { IntervalSelect } from '../ui/IntervalSelect';
import { ModeSelect } from '../ui/ModeSelect';
import { NoteSelect } from '../ui/NoteSelect';
import { ResultPanel } from '../ui/ResultPanel';

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

const degreeBadgeStyle: CSSProperties = {
  fontSize: '0.875rem',
  color: 'var(--sl-color-gray-3)',
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

const IntervalExplorer = () => {
  const [root, setRoot] = useState<Note>('C');
  const [mode, setMode] = useState<ModeName>('ionian');
  const [interval, setInterval] = useState<IntervalId>('perfect_5th');

  const definition = useMemo(() => INTERVAL_DEFINITIONS[interval], [interval]);
  const resolved = useMemo(
    () => resolveIntervalEndpoints({ root, mode, interval }),
    [root, mode, interval]
  );

  return (
    <div style={containerStyle}>
      <div style={controlsRowStyle}>
        <NoteSelect value={root} onChange={setRoot} />
        <ModeSelect value={mode} onChange={setMode} />
        <IntervalSelect value={interval} onChange={setInterval} />
      </div>

      <div style={infoBlockStyle}>
        <p style={modeNameStyle}>{definition.label}</p>
        <span style={degreeBadgeStyle}>
          {definition.intervalSpec.semitones} semitones
        </span>
      </div>

      <p style={snippetStyle}>
        <code
          style={snippetCallStyle}
        >{`resolveIntervalEndpoints({ root: '${root}', mode: '${mode}', interval: '${interval}' })`}</code>
      </p>

      <ResultPanel label="resolveIntervalEndpoints result" value={resolved} />
    </div>
  );
};

export { IntervalExplorer };
export default IntervalExplorer;

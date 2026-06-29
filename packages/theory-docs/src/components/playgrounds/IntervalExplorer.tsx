import { useMemo, useState } from 'react';
import {
  INTERVAL_DEFINITIONS,
  Intervals,
  Modes,
  Notes,
  resolveIntervalEndpoints,
} from '@playbykey/theory';
import type { IntervalId, ModeName, Note } from '@playbykey/theory';
import { IntervalSelect } from '../ui/IntervalSelect';
import { ModeSelect } from '../ui/ModeSelect';
import { NoteSelect } from '../ui/NoteSelect';
import { ResultPanel } from '../ui/ResultPanel';

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
  color: 'var(--sl-color-accent)',
};

const degreeBadgeStyle = {
  fontSize: '0.875rem',
  color: 'var(--sl-color-gray-3)',
};

const snippetStyle = {
  margin: 0,
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.875rem',
  color: 'var(--sl-color-gray-2)',
};

const snippetCallStyle = {
  color: 'var(--sl-color-accent)',
};

const IntervalExplorer = () => {
  const [root, setRoot] = useState<Note>(Notes.C);
  const [mode, setMode] = useState<ModeName>(Modes.Ionian);
  const [interval, setInterval] = useState<IntervalId>(Intervals.Perfect5th);

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

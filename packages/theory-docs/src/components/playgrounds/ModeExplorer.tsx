import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  getModeAlterations,
  getScaleNotes,
  MODES,
  MODE_INTERVALS,
  MODE_SEMITONE_OFFSETS,
} from '@playbykey/theory';
import type { ModeName, Note } from '@playbykey/theory';
import { ModeSelect } from '../ui/ModeSelect';
import { NoteSelect } from '../ui/NoteSelect';
import { ResultPanel } from '../ui/ResultPanel';

const formatArray = (arr: readonly number[]): string => `[${arr.join(', ')}]`;

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

const characterStyle: CSSProperties = {
  margin: 0,
  color: 'var(--sl-color-gray-2)',
  lineHeight: 1.5,
};

const dataRowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

const dataLabelStyle: CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--sl-color-gray-2)',
};

const dataValueStyle: CSSProperties = {
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.8125rem',
  color: 'var(--sl-color-gray-1)',
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

const ModeExplorer = () => {
  const [root, setRoot] = useState<Note>('C');
  const [mode, setMode] = useState<ModeName>('ionian');

  // MODES contains all 7 modes; find with a valid ModeName is always defined
  const modeInfo = useMemo(() => MODES.find((m) => m.id === mode)!, [mode]);
  const intervals = useMemo(() => MODE_INTERVALS[mode], [mode]);
  const offsets = useMemo(() => MODE_SEMITONE_OFFSETS[mode], [mode]);
  const alterations = useMemo(() => getModeAlterations(mode), [mode]);
  const notes = useMemo(() => getScaleNotes(root, mode), [root, mode]);

  return (
    <div style={containerStyle}>
      <div style={controlsRowStyle}>
        <NoteSelect value={root} onChange={setRoot} />
        <ModeSelect value={mode} onChange={setMode} />
      </div>

      <div style={infoBlockStyle}>
        <p style={modeNameStyle}>{modeInfo.name}</p>
        <p style={characterStyle}>{modeInfo.character}</p>
      </div>

      <div style={dataRowStyle}>
        <span style={dataLabelStyle}>Step intervals</span>
        <span style={dataValueStyle}>{formatArray(intervals)}</span>
      </div>

      <div style={dataRowStyle}>
        <span style={dataLabelStyle}>Semitone offsets</span>
        <span style={dataValueStyle}>{formatArray(offsets)}</span>
      </div>

      <ResultPanel label="Alterations from Ionian" value={alterations} />

      <p style={snippetStyle}>
        <code
          style={snippetCallStyle}
        >{`getScaleNotes('${root}', '${mode}')`}</code>
      </p>

      <ResultPanel label="getScaleNotes result" value={notes} />
    </div>
  );
};

export { ModeExplorer };
export default ModeExplorer;

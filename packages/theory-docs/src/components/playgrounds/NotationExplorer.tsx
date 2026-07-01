import { useMemo, useState } from 'react';
import { buildNoteMap, Modes, Notes, Notations } from '@playbykey/theory';
import type { ModeName, Note, NotationType } from '@playbykey/theory';
import { ModeSelect } from '../ui/ModeSelect';
import { NoteSelect } from '../ui/NoteSelect';
import { ResultPanel } from '../ui/ResultPanel';

const NOTATION_DESCRIPTIONS: Record<NotationType, string> = {
  letter: 'In-scale and out-of-scale notes labeled by name',
  number:
    'In-scale notes labeled by scale degree; out-of-scale notes as empty string',
};

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

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.25rem',
};

const labelStyle = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--sl-color-gray-2)',
};

const selectStyle = {
  padding: '0.375rem 0.5rem',
  borderRadius: '0.375rem',
  border: '1px solid var(--sl-color-gray-5)',
  background: 'var(--sl-color-gray-6)',
  color: 'var(--sl-color-gray-1)',
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
  color: 'var(--sl-color-accent-high)',
};

const NotationExplorer = () => {
  const [root, setRoot] = useState<Note>(Notes.C);
  const [mode, setMode] = useState<ModeName>(Modes.Ionian);
  const [notation, setNotation] = useState<NotationType>(Notations.Letter);

  const noteMap = useMemo(
    () => buildNoteMap(root, mode, notation),
    [root, mode, notation]
  );

  return (
    <div style={containerStyle}>
      <div style={controlsRowStyle}>
        <NoteSelect value={root} onChange={setRoot} />
        <ModeSelect value={mode} onChange={setMode} />
        <label style={fieldStyle}>
          <span style={labelStyle}>Notation</span>
          <select
            style={selectStyle}
            value={notation}
            onChange={(e) => setNotation(e.target.value as NotationType)}
          >
            <option value={Notations.Letter}>Letter</option>
            <option value={Notations.Number}>Number</option>
          </select>
        </label>
      </div>

      <div style={infoBlockStyle}>
        <p style={modeNameStyle}>{notation}</p>
        <span style={degreeBadgeStyle}>{NOTATION_DESCRIPTIONS[notation]}</span>
      </div>

      <p style={snippetStyle}>
        <code
          style={snippetCallStyle}
        >{`buildNoteMap('${root}', '${mode}', '${notation}')`}</code>
      </p>

      <ResultPanel label="buildNoteMap result" value={noteMap} />
    </div>
  );
};

export { NotationExplorer };
export default NotationExplorer;

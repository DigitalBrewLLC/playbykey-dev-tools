import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { ENHARMONIC_LABELS, getNoteIndex } from '@playbykey/theory';
import type { Note } from '@playbykey/theory';
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

const NotesExplorer = () => {
  const [note, setNote] = useState<Note>('C');

  const index = useMemo(() => getNoteIndex(note), [note]);
  const enharmonicLabel = useMemo(() => ENHARMONIC_LABELS[note], [note]);

  return (
    <div style={containerStyle}>
      <div style={controlsRowStyle}>
        <NoteSelect value={note} onChange={setNote} label="Note" />
      </div>

      <div style={infoBlockStyle}>
        <div>
          <span style={dataLabelStyle}>Chromatic index</span>
          <div style={dataValueStyle}>{index}</div>
        </div>
        <div>
          <span style={dataLabelStyle}>Enharmonic label</span>
          <div style={dataValueStyle}>
            {enharmonicLabel ?? 'Natural — no enharmonic equivalent'}
          </div>
        </div>
      </div>

      <p style={snippetStyle}>
        <code style={snippetCallStyle}>{`getNoteIndex('${note}')`}</code>
      </p>

      <ResultPanel label="getNoteIndex result" value={index} />
    </div>
  );
};

export { NotesExplorer };
export default NotesExplorer;

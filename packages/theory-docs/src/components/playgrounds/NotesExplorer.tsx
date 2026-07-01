import { useMemo, useState } from 'react';
import { ENHARMONIC_LABELS, getNoteIndex, Notes } from '@playbykey/theory';
import type { Note } from '@playbykey/theory';
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
  alignItems: 'flex-end',
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

const dataLabelStyle = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--sl-color-gray-2)',
};

const dataValueStyle = {
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.8125rem',
  color: 'var(--sl-color-gray-1)',
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

const NotesExplorer = () => {
  const [note, setNote] = useState<Note>(Notes.C);

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
        <code
          style={snippetCallStyle}
        >{`getNoteIndex(Notes.${Object.entries(Notes).find(([, v]) => v === note)?.[0]})`}</code>
      </p>

      <ResultPanel label="getNoteIndex result" value={index} />
    </div>
  );
};

export { NotesExplorer };
export default NotesExplorer;

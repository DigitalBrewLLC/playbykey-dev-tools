import { useMemo, useState } from 'react';
import { ENHARMONIC_LABELS, Notes } from '@playbykey/theory';
import type { Note } from '@playbykey/theory';
import { CodeSnippet } from '../ui/CodeSnippet';
import { InfoBlock } from '../ui/InfoBlock';
import { NoteSelect } from '../ui/NoteSelect';
import {
  containerStyle,
  controlsRowStyle,
  dataLabelStyle,
  dataRowStyle,
  dataValueStyle,
} from './playgroundStyles';

const NotesExplorer = () => {
  const [note, setNote] = useState<Note>(Notes.C);

  const enharmonicLabel = useMemo(() => ENHARMONIC_LABELS[note], [note]);

  const noteKey = Object.entries(Notes).find(([, v]) => v === note)?.[0];

  return (
    <div style={containerStyle}>
      <div style={controlsRowStyle}>
        <NoteSelect value={note} onChange={setNote} label="Note" />
      </div>

      <InfoBlock>
        <div style={dataRowStyle}>
          <span style={dataLabelStyle}>Enharmonic label</span>
          <div style={dataValueStyle}>
            {enharmonicLabel ?? 'Natural — no enharmonic equivalent'}
          </div>
        </div>
      </InfoBlock>

      <CodeSnippet call={`ENHARMONIC_LABELS[Notes.${noteKey}]`} />
    </div>
  );
};

export { NotesExplorer };
export default NotesExplorer;

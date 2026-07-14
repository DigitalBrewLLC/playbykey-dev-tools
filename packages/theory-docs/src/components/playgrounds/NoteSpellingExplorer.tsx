import { useMemo, useState } from 'react';
import {
  FlatNotes,
  getEnharmonicLabels,
  getFlats,
  getSharps,
  isNote,
  Notes,
} from '@playbykey/theory';
import type { FlatNote, Note } from '@playbykey/theory';
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

/** getFlats returns a generic display string; narrow it back to a typed
 * note before feeding it to getSharps, rather than casting unsafely. */
const FLAT_NOTE_VALUES = new Set<string>(Object.values(FlatNotes));
const isNoteOrFlatNote = (value: string): value is Note | FlatNote =>
  isNote(value) || FLAT_NOTE_VALUES.has(value);

const NoteSpellingExplorer = () => {
  const [note, setNote] = useState<Note>(Notes.CSharp);

  const flat = useMemo(() => getFlats([note])[0], [note]);
  const label = useMemo(() => getEnharmonicLabels([note])[0], [note]);
  const backToSharp = useMemo(
    () =>
      flat !== undefined && isNoteOrFlatNote(flat)
        ? getSharps([flat])[0]
        : undefined,
    [flat]
  );

  const noteKey = Object.entries(Notes).find(([, v]) => v === note)?.[0];

  return (
    <div style={containerStyle}>
      <div style={controlsRowStyle}>
        <NoteSelect value={note} onChange={setNote} label="Note" />
      </div>

      <InfoBlock>
        <div style={dataRowStyle}>
          <span style={dataLabelStyle}>Flat (getFlats)</span>
          <div style={dataValueStyle}>{flat}</div>
        </div>
        <div style={dataRowStyle}>
          <span style={dataLabelStyle}>
            Enharmonic label (getEnharmonicLabels)
          </span>
          <div style={dataValueStyle}>{label}</div>
        </div>
        <div style={dataRowStyle}>
          <span style={dataLabelStyle}>Back to sharp (getSharps)</span>
          <div style={dataValueStyle}>{backToSharp}</div>
        </div>
      </InfoBlock>

      <CodeSnippet
        call={[
          `getFlats([Notes.${noteKey}])[0] // '${flat}'`,
          `getEnharmonicLabels([Notes.${noteKey}])[0] // '${label}'`,
          `getSharps(['${flat}'])[0] // '${backToSharp}'`,
        ]}
      />
    </div>
  );
};

export { NoteSpellingExplorer };
export default NoteSpellingExplorer;

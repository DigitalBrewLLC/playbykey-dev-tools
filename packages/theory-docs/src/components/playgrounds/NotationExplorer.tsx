import { useMemo, useState } from 'react';
import { buildNoteMap, Modes, Notes, Notations } from '@playbykey/theory';
import type { ModeName, Note, NotationType } from '@playbykey/theory';
import { CodeSnippet } from '../ui/CodeSnippet';
import { FieldSelect } from '../ui/FieldSelect';
import { InfoBadge, InfoBlock, InfoTitle } from '../ui/InfoBlock';
import { ModeSelect } from '../ui/ModeSelect';
import { NoteSelect } from '../ui/NoteSelect';
import { ResultPanel } from '../ui/ResultPanel';
import { containerStyle, controlsRowStyle } from './playgroundStyles';

const NOTATION_DESCRIPTIONS: Record<NotationType, string> = {
  letter: 'In-scale and out-of-scale notes labeled by name',
  number:
    'In-scale notes labeled by scale degree; out-of-scale notes as empty string',
};

const NotationExplorer = () => {
  const [root, setRoot] = useState<Note>(Notes.C);
  const [mode, setMode] = useState<ModeName>(Modes.Ionian);
  const [notation, setNotation] = useState<NotationType>(Notations.Letter);

  const noteMap = useMemo(
    () => buildNoteMap(root, mode, notation),
    [root, mode, notation]
  );

  const noteKey = Object.entries(Notes).find(([, v]) => v === root)?.[0];
  const modeKey = Object.entries(Modes).find(([, v]) => v === mode)?.[0];
  const notationKey = Object.entries(Notations).find(
    ([, v]) => v === notation
  )?.[0];

  return (
    <div style={containerStyle}>
      <div style={controlsRowStyle}>
        <NoteSelect value={root} onChange={setRoot} />
        <ModeSelect value={mode} onChange={setMode} />
        <FieldSelect
          label="Notation"
          value={notation}
          onChange={(v) => setNotation(v as NotationType)}
        >
          <option value={Notations.Letter}>Letter</option>
          <option value={Notations.Number}>Number</option>
        </FieldSelect>
      </div>

      <InfoBlock>
        <InfoTitle>{notation}</InfoTitle>
        <InfoBadge>{NOTATION_DESCRIPTIONS[notation]}</InfoBadge>
      </InfoBlock>

      <CodeSnippet
        call={`buildNoteMap(Notes.${noteKey}, Modes.${modeKey}, Notations.${notationKey})`}
      />

      <ResultPanel label="buildNoteMap result" value={noteMap} />
    </div>
  );
};

export { NotationExplorer };
export default NotationExplorer;

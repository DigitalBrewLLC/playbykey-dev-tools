import { useMemo, useState } from 'react';
import {
  getModeAlterations,
  getModeNotes,
  Modes,
  MODES,
  MODE_INTERVALS,
  MODE_SEMITONE_OFFSETS,
  Notes,
} from '@playbykey/theory';
import type { ModeName, Note } from '@playbykey/theory';
import { CodeSnippet } from '../ui/CodeSnippet';
import { InfoBadge, InfoBlock, InfoTitle } from '../ui/InfoBlock';
import { ModeSelect } from '../ui/ModeSelect';
import { NoteSelect } from '../ui/NoteSelect';
import {
  containerStyle,
  controlsRowStyle,
  dataLabelStyle,
  dataRowStyle,
  dataValueStyle,
} from './playgroundStyles';

const characterStyle = {
  margin: 0,
  color: 'var(--sl-color-gray-2)',
  lineHeight: 1.5,
};

const ModeExplorer = () => {
  const [root, setRoot] = useState<Note>(Notes.C);
  const [mode, setMode] = useState<ModeName>(Modes.Ionian);

  const modeInfo = useMemo(() => MODES.find((m) => m.id === mode)!, [mode]);
  const intervals = useMemo(() => MODE_INTERVALS[mode], [mode]);
  const offsets = useMemo(() => MODE_SEMITONE_OFFSETS[mode], [mode]);
  const alterations = useMemo(() => getModeAlterations(mode), [mode]);
  const notes = useMemo(() => getModeNotes(root, mode), [root, mode]);

  const noteKey = Object.entries(Notes).find(([, v]) => v === root)?.[0];
  const modeKey = Object.entries(Modes).find(([, v]) => v === mode)?.[0];

  return (
    <div style={containerStyle}>
      <div style={controlsRowStyle}>
        <NoteSelect value={root} onChange={setRoot} />
        <ModeSelect value={mode} onChange={setMode} />
      </div>

      <InfoBlock>
        <InfoTitle>{modeInfo.name}</InfoTitle>
        <InfoBadge>Degree {modeInfo.scaleDegree}</InfoBadge>
        <p style={characterStyle}>{modeInfo.character}</p>
        <div style={dataRowStyle}>
          <span style={dataLabelStyle}>Step intervals</span>
          <span style={dataValueStyle}>[{intervals.join(', ')}]</span>
        </div>
        <div style={dataRowStyle}>
          <span style={dataLabelStyle}>Semitone offsets</span>
          <span style={dataValueStyle}>[{offsets.join(', ')}]</span>
        </div>
        <div style={dataRowStyle}>
          <span style={dataLabelStyle}>Alterations from major</span>
          <span style={dataValueStyle}>{JSON.stringify(alterations)}</span>
        </div>
        <div style={dataRowStyle}>
          <span style={dataLabelStyle}>Notes</span>
          <span style={dataValueStyle}>{notes.join(', ')}</span>
        </div>
      </InfoBlock>

      <CodeSnippet
        call={[
          `MODE_INTERVALS[Modes.${modeKey}]`,
          `MODE_SEMITONE_OFFSETS[Modes.${modeKey}]`,
          `getModeAlterations(Modes.${modeKey})`,
          `getModeNotes(Notes.${noteKey}, Modes.${modeKey})`,
        ]}
      />
    </div>
  );
};

export { ModeExplorer };
export default ModeExplorer;

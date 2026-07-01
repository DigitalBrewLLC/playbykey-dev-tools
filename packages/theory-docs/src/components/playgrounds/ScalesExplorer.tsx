import { useMemo, useState } from 'react';
import {
  SCALE_DEFINITIONS,
  getScaleNotes,
  Notes,
  ScaleTypes,
} from '@playbykey/theory';
import type { Note, ScaleType } from '@playbykey/theory';
import { CodeSnippet } from '../ui/CodeSnippet';
import { InfoBlock, InfoTitle } from '../ui/InfoBlock';
import { NoteSelect } from '../ui/NoteSelect';
import { ResultPanel } from '../ui/ResultPanel';
import { ScaleTypeSelect } from '../ui/ScaleTypeSelect';
import { containerStyle, controlsRowStyle } from './playgroundStyles';

const ScalesExplorer = () => {
  const [root, setRoot] = useState<Note>(Notes.C);
  const [scaleType, setScaleType] = useState<ScaleType>(ScaleTypes.Major);

  const definition = useMemo(() => SCALE_DEFINITIONS[scaleType], [scaleType]);
  const notes = useMemo(
    () => getScaleNotes(root, scaleType),
    [root, scaleType]
  );

  const noteKey = Object.entries(Notes).find(([, v]) => v === root)?.[0];
  const scaleKey = Object.entries(ScaleTypes).find(
    ([, v]) => v === scaleType
  )?.[0];

  return (
    <div style={containerStyle}>
      <div style={controlsRowStyle}>
        <NoteSelect value={root} onChange={setRoot} />
        <ScaleTypeSelect value={scaleType} onChange={setScaleType} />
      </div>

      <InfoBlock>
        <InfoTitle>{definition.label}</InfoTitle>
      </InfoBlock>

      <CodeSnippet
        call={`getScaleNotes(Notes.${noteKey}, ScaleTypes.${scaleKey})`}
      />

      <ResultPanel label="getScaleNotes result" value={notes} />
    </div>
  );
};

export { ScalesExplorer };
export default ScalesExplorer;

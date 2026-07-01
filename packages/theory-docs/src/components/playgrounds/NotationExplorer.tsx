import { useMemo, useState } from 'react';
import { buildNoteMap, Notes, ScaleTypes } from '@playbykey/theory';
import type { Note, ScaleType } from '@playbykey/theory';
import { CodeSnippet } from '../ui/CodeSnippet';
import { NoteSelect } from '../ui/NoteSelect';
import { ResultPanel } from '../ui/ResultPanel';
import { ScaleTypeSelect } from '../ui/ScaleTypeSelect';
import { containerStyle, controlsRowStyle } from './playgroundStyles';

const NotationExplorer = () => {
  const [root, setRoot] = useState<Note>(Notes.C);
  const [scaleType, setScaleType] = useState<ScaleType>(ScaleTypes.Major);

  const noteMap = useMemo(
    () => buildNoteMap(root, scaleType),
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

      <CodeSnippet
        call={`buildNoteMap(Notes.${noteKey}, ScaleTypes.${scaleKey})`}
      />

      <ResultPanel label="buildNoteMap result" value={noteMap} />
    </div>
  );
};

export { NotationExplorer };
export default NotationExplorer;

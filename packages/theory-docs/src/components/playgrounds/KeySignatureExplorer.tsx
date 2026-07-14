import { useMemo, useState } from 'react';
import { getKeySignatureCount, KeyQualities, Notes } from '@playbykey/theory';
import type { KeyQuality, Note } from '@playbykey/theory';
import { CodeSnippet } from '../ui/CodeSnippet';
import { KeyQualitySelect } from '../ui/KeyQualitySelect';
import { NoteSelect } from '../ui/NoteSelect';
import { ResultPanel } from '../ui/ResultPanel';
import { containerStyle, controlsRowStyle } from './playgroundStyles';

const KeySignatureExplorer = () => {
  const [key, setKey] = useState<Note>(Notes.C);
  const [quality, setQuality] = useState<KeyQuality>(KeyQualities.Major);

  const result = useMemo(
    () => getKeySignatureCount(key, quality),
    [key, quality]
  );

  const keyName = Object.entries(Notes).find(([, v]) => v === key)?.[0];
  const qualityName = Object.entries(KeyQualities).find(
    ([, v]) => v === quality
  )?.[0];

  return (
    <div style={containerStyle}>
      <div style={controlsRowStyle}>
        <NoteSelect value={key} onChange={setKey} label="Key" />
        <KeyQualitySelect value={quality} onChange={setQuality} />
      </div>

      <ResultPanel label="Result" value={result} />

      <CodeSnippet
        call={`getKeySignatureCount(Notes.${keyName}, KeyQualities.${qualityName})`}
      />
    </div>
  );
};

export { KeySignatureExplorer };
export default KeySignatureExplorer;

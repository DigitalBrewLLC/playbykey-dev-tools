import { useMemo } from 'react';
import { getCircleOfFifthsOrder } from '@playbykey/theory';
import { CodeSnippet } from '../ui/CodeSnippet';
import { NoteSpellingResults } from '../ui/NoteSpellingResults';
import { ResultPanel } from '../ui/ResultPanel';
import { containerStyle } from './playgroundStyles';

const CircleOfFifthsExplorer = () => {
  const notes = useMemo(() => getCircleOfFifthsOrder(), []);

  return (
    <div style={containerStyle}>
      <ResultPanel label="Result" value={notes} />
      <NoteSpellingResults notes={notes} />
      <CodeSnippet call="getCircleOfFifthsOrder()" />
    </div>
  );
};

export { CircleOfFifthsExplorer };
export default CircleOfFifthsExplorer;

import { useMemo, useState } from 'react';
import {
  INTERVAL_DEFINITIONS,
  Intervals,
  Notes,
  resolveIntervalEndpoints,
} from '@playbykey/theory';
import type { IntervalId, Note } from '@playbykey/theory';
import { CodeSnippet } from '../ui/CodeSnippet';
import { IntervalSelect } from '../ui/IntervalSelect';
import { NoteSelect } from '../ui/NoteSelect';
import { ResultPanel } from '../ui/ResultPanel';
import { containerStyle, controlsRowStyle } from './playgroundStyles';

const IntervalExplorer = () => {
  const [root, setRoot] = useState<Note>(Notes.C);
  const [interval, setInterval] = useState<IntervalId>(Intervals.Perfect5th);

  const definition = useMemo(() => INTERVAL_DEFINITIONS[interval], [interval]);
  const resolved = useMemo(
    () => resolveIntervalEndpoints({ root, interval }),
    [root, interval]
  );

  const noteKey = Object.entries(Notes).find(([, v]) => v === root)?.[0];
  const intervalKey = Object.entries(Intervals).find(
    ([, v]) => v === interval
  )?.[0];

  return (
    <div style={containerStyle}>
      <div style={controlsRowStyle}>
        <NoteSelect value={root} onChange={setRoot} />
        <IntervalSelect value={interval} onChange={setInterval} />
      </div>

      <CodeSnippet
        call={[
          `INTERVAL_DEFINITIONS[Intervals.${intervalKey}]  // { label: '${definition.label}', semitones: ${definition.intervalSpec.semitones} }`,
          `resolveIntervalEndpoints({ root: Notes.${noteKey}, interval: Intervals.${intervalKey} })`,
        ]}
      />

      <ResultPanel label="resolveIntervalEndpoints result" value={resolved} />
    </div>
  );
};

export { IntervalExplorer };
export default IntervalExplorer;

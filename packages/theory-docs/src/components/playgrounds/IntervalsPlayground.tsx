import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  getIntervalSemitones,
  resolveIntervalEndpoints,
} from '@playbykey/theory';
import type { IntervalId, ModeName, Note } from '@playbykey/theory';
import { FunctionCard } from '../ui/FunctionCard';
import { IntervalSelect } from '../ui/IntervalSelect';
import { ModeSelect } from '../ui/ModeSelect';
import { NoteSelect } from '../ui/NoteSelect';

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const IntervalsPlayground = () => {
  const [semitonesInterval, setSemitonesInterval] =
    useState<IntervalId>('perfect_5th');
  const [root, setRoot] = useState<Note>('C');
  const [mode, setMode] = useState<ModeName>('ionian');
  const [resolveInterval, setResolveInterval] =
    useState<IntervalId>('major_3rd');

  const semitonesResult = useMemo(
    () => getIntervalSemitones(semitonesInterval),
    [semitonesInterval]
  );

  const resolvedResult = useMemo(
    () =>
      resolveIntervalEndpoints({
        root,
        mode,
        interval: resolveInterval,
      }),
    [root, mode, resolveInterval]
  );

  return (
    <div style={containerStyle}>
      <FunctionCard
        name="getIntervalSemitones"
        signature="getIntervalSemitones(interval: IntervalId): number"
        description="Returns the semitone distance for a named interval from the catalog."
        result={semitonesResult}
      >
        <IntervalSelect
          value={semitonesInterval}
          onChange={setSemitonesInterval}
        />
      </FunctionCard>

      <FunctionCard
        name="resolveIntervalEndpoints"
        signature="resolveIntervalEndpoints(context: IntervalContext): ResolvedInterval"
        description="Resolves from/to notes for an interval in the context of a root and mode."
        result={resolvedResult}
      >
        <NoteSelect value={root} onChange={setRoot} label="Root" />
        <ModeSelect value={mode} onChange={setMode} />
        <IntervalSelect value={resolveInterval} onChange={setResolveInterval} />
      </FunctionCard>
    </div>
  );
};

export { IntervalsPlayground };
export default IntervalsPlayground;

import { useMemo, useState } from 'react';
import {
  getIntervalSemitones,
  resolveIntervalEndpoints,
} from '@playbykey/theory';
import type { IntervalId, Note } from '@playbykey/theory';
import { FunctionCard } from '../ui/FunctionCard';
import { IntervalSelect } from '../ui/IntervalSelect';
import { NoteSelect } from '../ui/NoteSelect';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.5rem',
};

const IntervalsPlayground = () => {
  const [semitonesInterval, setSemitonesInterval] =
    useState<IntervalId>('perfect_5th');
  const [root, setRoot] = useState<Note>('C');
  const [resolveInterval, setResolveInterval] =
    useState<IntervalId>('major_3rd');

  const semitonesResult = useMemo(
    () => getIntervalSemitones(semitonesInterval),
    [semitonesInterval]
  );

  const resolvedResult = useMemo(
    () => resolveIntervalEndpoints({ root, interval: resolveInterval }),
    [root, resolveInterval]
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
        description="Resolves the from/to notes for an interval anchored at a root, always within the major scale."
        result={resolvedResult}
      >
        <NoteSelect value={root} onChange={setRoot} label="Root" />
        <IntervalSelect value={resolveInterval} onChange={setResolveInterval} />
      </FunctionCard>
    </div>
  );
};

export { IntervalsPlayground };
export default IntervalsPlayground;

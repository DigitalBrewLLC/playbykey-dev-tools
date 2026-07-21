import { useMemo, useState } from 'react';
import {
  getProgressionInKey,
  getRomanNumeral,
  Modes,
  Notes,
  ProgressionIds,
} from '@playbykey/theory';
import type { ModeName, Note, ProgressionId } from '@playbykey/theory';
import { FieldSelect } from '../ui/FieldSelect';
import { FunctionCard } from '../ui/FunctionCard';
import { ModeSelect } from '../ui/ModeSelect';
import { NoteSelect } from '../ui/NoteSelect';
import { ProgressionIdSelect } from '../ui/ProgressionIdSelect';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.5rem',
};

const DEGREES = [1, 2, 3, 4, 5, 6, 7] as const;

const ProgressionsPlayground = () => {
  const [progressionId, setProgressionId] = useState<ProgressionId>(
    ProgressionIds.OneFiveSixFour
  );
  const [progressionRoot, setProgressionRoot] = useState<Note>(Notes.C);

  const [degree, setDegree] = useState<number>(1);
  const [mode, setMode] = useState<ModeName>(Modes.Ionian);

  const progressionChords = useMemo(
    () => getProgressionInKey(progressionId, progressionRoot),
    [progressionId, progressionRoot]
  );

  const romanNumeral = useMemo(
    () => getRomanNumeral(degree, mode),
    [degree, mode]
  );

  return (
    <div style={containerStyle}>
      <FunctionCard
        name="getProgressionInKey"
        signature="getProgressionInKey(progressionId: ProgressionId, root: Note): Chord[]"
        description="Renders a named catalog progression as chords in a given key, in order."
        result={progressionChords}
      >
        <ProgressionIdSelect
          value={progressionId}
          onChange={setProgressionId}
        />
        <NoteSelect
          value={progressionRoot}
          onChange={setProgressionRoot}
          label="Root"
        />
      </FunctionCard>

      <FunctionCard
        name="getRomanNumeral"
        signature="getRomanNumeral(degree: number, mode?: ModeName): string"
        description="Returns the roman numeral for a scale degree in a mode - case and suffix reflect diatonic triad quality."
        result={romanNumeral}
      >
        <FieldSelect
          label="Degree"
          value={String(degree)}
          onChange={(v) => setDegree(Number(v))}
        >
          {DEGREES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </FieldSelect>
        <ModeSelect value={mode} onChange={setMode} />
      </FunctionCard>
    </div>
  );
};

export { ProgressionsPlayground };
export default ProgressionsPlayground;

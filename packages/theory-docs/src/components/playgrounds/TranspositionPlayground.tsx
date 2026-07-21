import { useMemo, useState } from 'react';
import { transpose, Notes } from '@playbykey/theory';
import type { Note } from '@playbykey/theory';
import { FunctionCard } from '../ui/FunctionCard';
import { NoteSelect } from '../ui/NoteSelect';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.5rem',
};

const TRANSPOSE_NOTES: readonly Note[] = ['C', 'E', 'G'];

const TranspositionPlayground = () => {
  const [fromRoot, setFromRoot] = useState<Note>(Notes.C);
  const [toRoot, setToRoot] = useState<Note>(Notes.D);

  const transposedNotes = useMemo(
    () => transpose(TRANSPOSE_NOTES, fromRoot, toRoot),
    [fromRoot, toRoot]
  );

  return (
    <div style={containerStyle}>
      <FunctionCard
        name="transpose"
        signature="transpose(notes: Note[], fromRoot: Note, toRoot: Note): Note[]"
        description={`Transposes a set of notes from one key to another. Always transposes the fixed triad [${TRANSPOSE_NOTES.join(', ')}] here - pick the roots to shift it between keys.`}
        result={transposedNotes}
      >
        <NoteSelect value={fromRoot} onChange={setFromRoot} label="From root" />
        <NoteSelect value={toRoot} onChange={setToRoot} label="To root" />
      </FunctionCard>
    </div>
  );
};

export { TranspositionPlayground };
export default TranspositionPlayground;

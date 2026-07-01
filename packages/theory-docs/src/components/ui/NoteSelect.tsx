import { CHROMATIC_NOTES } from '@playbykey/theory';
import type { Note } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';

interface NoteSelectProps {
  value: Note;
  onChange: (note: Note) => void;
  label?: string;
}

const NoteSelect = ({ value, onChange, label = 'Root' }: NoteSelectProps) => (
  <FieldSelect
    label={label}
    value={value}
    onChange={(v) => onChange(v as Note)}
  >
    {CHROMATIC_NOTES.map((note) => (
      <option key={note} value={note}>
        {note}
      </option>
    ))}
  </FieldSelect>
);

export { NoteSelect };

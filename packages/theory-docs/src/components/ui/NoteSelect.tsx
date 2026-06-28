import { NOTES } from '@playbykey/theory';
import type { Note } from '@playbykey/theory';
import { fieldStyle, labelStyle, selectStyle } from './selectStyles';

interface NoteSelectProps {
  value: Note;
  onChange: (note: Note) => void;
  label?: string;
}

const NoteSelect = ({ value, onChange, label = 'Root' }: NoteSelectProps) => {
  return (
    <div style={fieldStyle}>
      <span style={labelStyle}>{label}</span>
      <select
        style={selectStyle}
        value={value}
        onChange={(event) => onChange(event.target.value as Note)}
      >
        {NOTES.map((note) => (
          <option key={note} value={note}>
            {note}
          </option>
        ))}
      </select>
    </div>
  );
};

export { NoteSelect };

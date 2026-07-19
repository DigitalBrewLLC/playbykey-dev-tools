import { ChordTypes } from '@playbykey/theory';
import type { ChordType } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';

interface ChordTypeSelectProps {
  value: ChordType;
  onChange: (chordType: ChordType) => void;
  label?: string;
}

const formatChordTypeLabel = (chordType: ChordType) =>
  chordType
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const ChordTypeSelect = ({
  value,
  onChange,
  label = 'Chord Type',
}: ChordTypeSelectProps) => (
  <FieldSelect
    label={label}
    value={value}
    onChange={(v) => onChange(v as ChordType)}
  >
    {Object.values(ChordTypes).map((chordType) => (
      <option key={chordType} value={chordType}>
        {formatChordTypeLabel(chordType)}
      </option>
    ))}
  </FieldSelect>
);

export { ChordTypeSelect };

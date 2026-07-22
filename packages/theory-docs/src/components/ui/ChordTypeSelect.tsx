import { ChordTypes } from '@playbykey/theory';
import type { ChordType } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';
import { formatKebabLabel } from './formatKebabLabel';

interface ChordTypeSelectProps {
  value: ChordType;
  onChange: (chordType: ChordType) => void;
  label?: string;
}

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
        {formatKebabLabel(chordType)}
      </option>
    ))}
  </FieldSelect>
);

export { ChordTypeSelect };

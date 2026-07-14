import { Accidentals } from '@playbykey/theory';
import type { AccidentalType } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';

interface AccidentalSelectProps {
  value: AccidentalType;
  onChange: (accidental: AccidentalType) => void;
  label?: string;
}

const ACCIDENTAL_LABELS: Record<AccidentalType, string> = {
  sharp: 'Sharp',
  flat: 'Flat',
  both: 'Both',
};

const AccidentalSelect = ({
  value,
  onChange,
  label = 'Spelling',
}: AccidentalSelectProps) => (
  <FieldSelect
    label={label}
    value={value}
    onChange={(v) => onChange(v as AccidentalType)}
  >
    {Object.values(Accidentals).map((accidental) => (
      <option key={accidental} value={accidental}>
        {ACCIDENTAL_LABELS[accidental]}
      </option>
    ))}
  </FieldSelect>
);

export { AccidentalSelect };

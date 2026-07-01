import { MODES } from '@playbykey/theory';
import type { ModeName } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';

interface ModeSelectProps {
  value: ModeName;
  onChange: (mode: ModeName) => void;
  label?: string;
}

const ModeSelect = ({ value, onChange, label = 'Mode' }: ModeSelectProps) => (
  <FieldSelect
    label={label}
    value={value}
    onChange={(v) => onChange(v as ModeName)}
  >
    {MODES.map((mode) => (
      <option key={mode.id} value={mode.id}>
        {mode.name}
      </option>
    ))}
  </FieldSelect>
);

export { ModeSelect };

import { MelodicMinorModes } from '@playbykey/theory';
import type { MelodicMinorModeName } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';
import { formatKebabLabel } from './formatKebabLabel';

interface MelodicMinorModeSelectProps {
  value: MelodicMinorModeName;
  onChange: (mode: MelodicMinorModeName) => void;
  label?: string;
}

const MelodicMinorModeSelect = ({
  value,
  onChange,
  label = 'Mode',
}: MelodicMinorModeSelectProps) => (
  <FieldSelect
    label={label}
    value={value}
    onChange={(v) => onChange(v as MelodicMinorModeName)}
  >
    {Object.values(MelodicMinorModes).map((mode) => (
      <option key={mode} value={mode}>
        {formatKebabLabel(mode)}
      </option>
    ))}
  </FieldSelect>
);

export { MelodicMinorModeSelect };

import { HarmonicMinorModes } from '@playbykey/theory';
import type { HarmonicMinorModeName } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';
import { formatKebabLabel } from './formatKebabLabel';

interface HarmonicMinorModeSelectProps {
  value: HarmonicMinorModeName;
  onChange: (mode: HarmonicMinorModeName) => void;
  label?: string;
}

const HarmonicMinorModeSelect = ({
  value,
  onChange,
  label = 'Mode',
}: HarmonicMinorModeSelectProps) => (
  <FieldSelect
    label={label}
    value={value}
    onChange={(v) => onChange(v as HarmonicMinorModeName)}
  >
    {Object.values(HarmonicMinorModes).map((mode) => (
      <option key={mode} value={mode}>
        {formatKebabLabel(mode)}
      </option>
    ))}
  </FieldSelect>
);

export { HarmonicMinorModeSelect };

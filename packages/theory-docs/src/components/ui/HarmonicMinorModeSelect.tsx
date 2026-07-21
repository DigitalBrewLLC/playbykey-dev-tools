import { HarmonicMinorModes } from '@playbykey/theory';
import type { HarmonicMinorModeName } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';

interface HarmonicMinorModeSelectProps {
  value: HarmonicMinorModeName;
  onChange: (mode: HarmonicMinorModeName) => void;
  label?: string;
}

const formatHarmonicMinorModeLabel = (mode: HarmonicMinorModeName) =>
  mode
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

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
        {formatHarmonicMinorModeLabel(mode)}
      </option>
    ))}
  </FieldSelect>
);

export { HarmonicMinorModeSelect };

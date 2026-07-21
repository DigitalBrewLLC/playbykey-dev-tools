import { MelodicMinorModes } from '@playbykey/theory';
import type { MelodicMinorModeName } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';

interface MelodicMinorModeSelectProps {
  value: MelodicMinorModeName;
  onChange: (mode: MelodicMinorModeName) => void;
  label?: string;
}

const formatMelodicMinorModeLabel = (mode: MelodicMinorModeName) =>
  mode
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

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
        {formatMelodicMinorModeLabel(mode)}
      </option>
    ))}
  </FieldSelect>
);

export { MelodicMinorModeSelect };

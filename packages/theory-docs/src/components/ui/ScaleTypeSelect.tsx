import { ScaleTypes } from '@playbykey/theory';
import type { ScaleType } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';

interface ScaleTypeSelectProps {
  value: ScaleType;
  onChange: (scaleType: ScaleType) => void;
  label?: string;
}

const formatScaleTypeLabel = (scaleType: ScaleType) =>
  scaleType
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const ScaleTypeSelect = ({
  value,
  onChange,
  label = 'Scale Type',
}: ScaleTypeSelectProps) => (
  <FieldSelect
    label={label}
    value={value}
    onChange={(v) => onChange(v as ScaleType)}
  >
    {Object.values(ScaleTypes).map((scaleType) => (
      <option key={scaleType} value={scaleType}>
        {formatScaleTypeLabel(scaleType)}
      </option>
    ))}
  </FieldSelect>
);

export { ScaleTypeSelect };

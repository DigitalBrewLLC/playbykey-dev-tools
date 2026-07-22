import { ScaleTypes } from '@playbykey/theory';
import type { ScaleType } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';
import { formatKebabLabel } from './formatKebabLabel';

interface ScaleTypeSelectProps {
  value: ScaleType;
  onChange: (scaleType: ScaleType) => void;
  label?: string;
}

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
        {formatKebabLabel(scaleType)}
      </option>
    ))}
  </FieldSelect>
);

export { ScaleTypeSelect };

import { BebopScaleTypes } from '@playbykey/theory';
import type { BebopScaleType } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';
import { formatKebabLabel } from './formatKebabLabel';

interface BebopScaleTypeSelectProps {
  value: BebopScaleType;
  onChange: (type: BebopScaleType) => void;
  label?: string;
}

const BebopScaleTypeSelect = ({
  value,
  onChange,
  label = 'Bebop Scale',
}: BebopScaleTypeSelectProps) => (
  <FieldSelect
    label={label}
    value={value}
    onChange={(v) => onChange(v as BebopScaleType)}
  >
    {Object.values(BebopScaleTypes).map((type) => (
      <option key={type} value={type}>
        {formatKebabLabel(type)}
      </option>
    ))}
  </FieldSelect>
);

export { BebopScaleTypeSelect };

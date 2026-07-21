import { BebopScaleTypes } from '@playbykey/theory';
import type { BebopScaleType } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';

interface BebopScaleTypeSelectProps {
  value: BebopScaleType;
  onChange: (type: BebopScaleType) => void;
  label?: string;
}

const formatBebopScaleTypeLabel = (type: BebopScaleType) =>
  type
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

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
        {formatBebopScaleTypeLabel(type)}
      </option>
    ))}
  </FieldSelect>
);

export { BebopScaleTypeSelect };

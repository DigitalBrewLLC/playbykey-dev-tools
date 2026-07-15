import { KeyQualities } from '@playbykey/theory';
import type { KeyQuality } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';

interface KeyQualitySelectProps {
  value: KeyQuality;
  onChange: (quality: KeyQuality) => void;
  label?: string;
}

const formatKeyQualityLabel = (quality: KeyQuality) =>
  quality.charAt(0).toUpperCase() + quality.slice(1);

const KeyQualitySelect = ({
  value,
  onChange,
  label = 'Quality',
}: KeyQualitySelectProps) => (
  <FieldSelect
    label={label}
    value={value}
    onChange={(v) => onChange(v as KeyQuality)}
  >
    {Object.values(KeyQualities).map((quality) => (
      <option key={quality} value={quality}>
        {formatKeyQualityLabel(quality)}
      </option>
    ))}
  </FieldSelect>
);

export { KeyQualitySelect };

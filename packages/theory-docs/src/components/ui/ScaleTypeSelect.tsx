import { ScaleTypes } from '@playbykey/theory';
import type { ScaleType } from '@playbykey/theory';

interface ScaleTypeSelectProps {
  value: ScaleType;
  onChange: (scaleType: ScaleType) => void;
  label?: string;
}

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.25rem',
};

const labelStyle = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--sl-color-gray-2)',
};

const selectStyle = {
  padding: '0.375rem 0.5rem',
  borderRadius: '0.375rem',
  border: '1px solid var(--sl-color-gray-5)',
  background: 'var(--sl-color-gray-6)',
  color: 'var(--sl-color-gray-1)',
};

const formatScaleTypeLabel = (scaleType: ScaleType) =>
  scaleType
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const ScaleTypeSelect = ({
  value,
  onChange,
  label = 'Scale Type',
}: ScaleTypeSelectProps) => {
  return (
    <label style={fieldStyle}>
      <span style={labelStyle}>{label}</span>
      <select
        style={selectStyle}
        value={value}
        onChange={(event) => onChange(event.target.value as ScaleType)}
      >
        {Object.values(ScaleTypes).map((scaleType) => (
          <option key={scaleType} value={scaleType}>
            {formatScaleTypeLabel(scaleType)}
          </option>
        ))}
      </select>
    </label>
  );
};

export { ScaleTypeSelect };

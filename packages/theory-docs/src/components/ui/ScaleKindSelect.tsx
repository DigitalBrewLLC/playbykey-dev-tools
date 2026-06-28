import { ScaleKinds } from '@playbykey/theory';
import type { ScaleKind } from '@playbykey/theory';

interface ScaleKindSelectProps {
  value: ScaleKind;
  onChange: (kind: ScaleKind) => void;
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

const formatScaleKindLabel = (kind: ScaleKind) =>
  kind
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const ScaleKindSelect = ({
  value,
  onChange,
  label = 'Scale Kind',
}: ScaleKindSelectProps) => {
  return (
    <label style={fieldStyle}>
      <span style={labelStyle}>{label}</span>
      <select
        style={selectStyle}
        value={value}
        onChange={(event) => onChange(event.target.value as ScaleKind)}
      >
        {Object.values(ScaleKinds).map((kind) => (
          <option key={kind} value={kind}>
            {formatScaleKindLabel(kind)}
          </option>
        ))}
      </select>
    </label>
  );
};

export { ScaleKindSelect };

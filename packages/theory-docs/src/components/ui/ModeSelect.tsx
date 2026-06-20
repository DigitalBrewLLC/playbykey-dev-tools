import { MODES } from '@playbykey/theory';
import type { ModeName } from '@playbykey/theory';

interface ModeSelectProps {
  value: ModeName;
  onChange: (mode: ModeName) => void;
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

const ModeSelect = ({ value, onChange, label = 'Mode' }: ModeSelectProps) => {
  return (
    <label style={fieldStyle}>
      <span style={labelStyle}>{label}</span>
      <select
        style={selectStyle}
        value={value}
        onChange={(event) => onChange(event.target.value as ModeName)}
      >
        {MODES.map((mode) => (
          <option key={mode.id} value={mode.id}>
            {mode.name}
          </option>
        ))}
      </select>
    </label>
  );
};

export { ModeSelect };

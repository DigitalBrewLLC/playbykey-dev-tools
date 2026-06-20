import { INTERVAL_ID_VALUES } from '@playbykey/theory';
import type { IntervalId } from '@playbykey/theory';

interface IntervalSelectProps {
  value: IntervalId;
  onChange: (interval: IntervalId) => void;
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

const formatIntervalLabel = (intervalId: IntervalId) =>
  intervalId
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const IntervalSelect = ({
  value,
  onChange,
  label = 'Interval',
}: IntervalSelectProps) => {
  return (
    <label style={fieldStyle}>
      <span style={labelStyle}>{label}</span>
      <select
        style={selectStyle}
        value={value}
        onChange={(event) => onChange(event.target.value as IntervalId)}
      >
        {INTERVAL_ID_VALUES.map((intervalId) => (
          <option key={intervalId} value={intervalId}>
            {formatIntervalLabel(intervalId)}
          </option>
        ))}
      </select>
    </label>
  );
};

export { IntervalSelect };

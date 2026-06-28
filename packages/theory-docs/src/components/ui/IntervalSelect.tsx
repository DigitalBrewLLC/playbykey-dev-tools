import { INTERVAL_ID_VALUES } from '@playbykey/theory';
import type { IntervalId } from '@playbykey/theory';
import { fieldStyle, labelStyle, selectStyle } from './selectStyles';

interface IntervalSelectProps {
  value: IntervalId;
  onChange: (interval: IntervalId) => void;
  label?: string;
}

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

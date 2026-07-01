import { Intervals } from '@playbykey/theory';
import type { IntervalId } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';

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
}: IntervalSelectProps) => (
  <FieldSelect
    label={label}
    value={value}
    onChange={(v) => onChange(v as IntervalId)}
  >
    {Object.values(Intervals).map((intervalId) => (
      <option key={intervalId} value={intervalId}>
        {formatIntervalLabel(intervalId)}
      </option>
    ))}
  </FieldSelect>
);

export { IntervalSelect };

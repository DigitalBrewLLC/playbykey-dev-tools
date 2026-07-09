import { Intervals, INTERVAL_DEFINITIONS } from '@playbykey/theory';
import type { IntervalId } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';

interface IntervalSelectProps {
  value: IntervalId;
  onChange: (interval: IntervalId) => void;
  label?: string;
}

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
        {INTERVAL_DEFINITIONS[intervalId].label}
      </option>
    ))}
  </FieldSelect>
);

export { IntervalSelect };

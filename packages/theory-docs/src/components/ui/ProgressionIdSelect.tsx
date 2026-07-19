import { ProgressionIds } from '@playbykey/theory';
import type { ProgressionId } from '@playbykey/theory';
import { FieldSelect } from './FieldSelect';

interface ProgressionIdSelectProps {
  value: ProgressionId;
  onChange: (progressionId: ProgressionId) => void;
  label?: string;
}

const ProgressionIdSelect = ({
  value,
  onChange,
  label = 'Progression',
}: ProgressionIdSelectProps) => (
  <FieldSelect
    label={label}
    value={value}
    onChange={(v) => onChange(v as ProgressionId)}
  >
    {Object.values(ProgressionIds).map((progressionId) => (
      <option key={progressionId} value={progressionId}>
        {progressionId}
      </option>
    ))}
  </FieldSelect>
);

export { ProgressionIdSelect };

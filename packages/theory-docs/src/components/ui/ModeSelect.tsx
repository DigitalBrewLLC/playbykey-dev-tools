import { MODES } from '@playbykey/theory';
import type { ModeName } from '@playbykey/theory';
import { fieldStyle, labelStyle, selectStyle } from './selectStyles';

interface ModeSelectProps {
  value: ModeName;
  onChange: (mode: ModeName) => void;
  label?: string;
}

const ModeSelect = ({ value, onChange, label = 'Mode' }: ModeSelectProps) => {
  return (
    <div style={fieldStyle}>
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
    </div>
  );
};

export { ModeSelect };

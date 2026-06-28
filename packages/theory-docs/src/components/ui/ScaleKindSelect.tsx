import { SCALE_KIND_VALUES } from '@playbykey/theory';
import type { ScaleKind } from '@playbykey/theory';
import { fieldStyle, labelStyle, selectStyle } from './selectStyles';

interface ScaleKindSelectProps {
  value: ScaleKind;
  onChange: (kind: ScaleKind) => void;
  label?: string;
}

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
        {SCALE_KIND_VALUES.map((kind) => (
          <option key={kind} value={kind}>
            {formatScaleKindLabel(kind)}
          </option>
        ))}
      </select>
    </label>
  );
};

export { ScaleKindSelect };

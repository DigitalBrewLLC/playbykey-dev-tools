import { FieldSelect } from './FieldSelect';

type SpellingPreference = 'sharp' | 'flat';

interface SpellingPreferenceSelectProps {
  value: SpellingPreference;
  onChange: (preference: SpellingPreference) => void;
  label?: string;
}

const SPELLING_PREFERENCES: readonly SpellingPreference[] = ['sharp', 'flat'];

const formatPreferenceLabel = (preference: SpellingPreference) =>
  preference.charAt(0).toUpperCase() + preference.slice(1);

const SpellingPreferenceSelect = ({
  value,
  onChange,
  label = 'Root spelling',
}: SpellingPreferenceSelectProps) => (
  <FieldSelect
    label={label}
    value={value}
    onChange={(v) => onChange(v as SpellingPreference)}
  >
    {SPELLING_PREFERENCES.map((preference) => (
      <option key={preference} value={preference}>
        {formatPreferenceLabel(preference)}
      </option>
    ))}
  </FieldSelect>
);

export { SpellingPreferenceSelect };
export type { SpellingPreference };

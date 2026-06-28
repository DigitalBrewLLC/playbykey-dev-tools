import type { CSSProperties } from 'react';

interface ConstantDisplayProps {
  name: string;
  type: string;
  value: unknown;
}

const blockStyle: CSSProperties = {
  marginBottom: '1.5rem',
};

const nameStyle: CSSProperties = {
  margin: '0 0 0.25rem',
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.9375rem',
  color: 'var(--sl-color-accent)',
};

const typeStyle: CSSProperties = {
  margin: '0 0 0.5rem',
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.8125rem',
  color: 'var(--sl-color-gray-3)',
};

const codeStyle: CSSProperties = {
  display: 'block',
  padding: '0.75rem',
  borderRadius: '0.375rem',
  background: 'var(--sl-color-gray-6)',
  border: '1px solid var(--sl-color-gray-5)',
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.8125rem',
  color: 'var(--sl-color-gray-1)',
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
};

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'number');

const formatValue = (value: unknown): string => {
  if (isStringArray(value) || isNumberArray(value)) {
    return value.join(', ');
  }

  return JSON.stringify(value, null, 2);
};

const ConstantDisplay = ({ name, type, value }: ConstantDisplayProps) => {
  return (
    <div style={blockStyle}>
      <h3 style={nameStyle}>{name}</h3>
      <p style={typeStyle}>{type}</p>
      <code style={codeStyle}>{formatValue(value)}</code>
    </div>
  );
};

export { ConstantDisplay };
export default ConstantDisplay;

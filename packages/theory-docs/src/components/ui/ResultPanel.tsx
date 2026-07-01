interface ResultPanelProps {
  label: string;
  value: unknown;
}

const panelStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.375rem',
  marginTop: '0.75rem',
};

const labelStyle = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--sl-color-gray-2)',
};

const codeStyle = {
  padding: '0.375rem 0.5rem',
  borderRadius: '0.375rem',
  background: 'var(--sl-color-gray-6)',
  border: '1px solid var(--sl-color-gray-5)',
  color: 'var(--sl-color-accent-high)',
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.875rem',
};

const preStyle = {
  margin: 0,
  padding: '0.75rem',
  borderRadius: '0.375rem',
  background: 'var(--sl-color-gray-6)',
  border: '1px solid var(--sl-color-gray-5)',
  overflowX: 'auto' as const,
};

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'number');

const ResultPanel = ({ label, value }: ResultPanelProps) => {
  if (value === null || value === undefined) {
    return null;
  }

  let content: React.ReactNode;

  if (isStringArray(value)) {
    content = <code style={codeStyle}>{value.join(', ')}</code>;
  } else if (isNumberArray(value)) {
    content = <code style={codeStyle}>[{value.join(', ')}]</code>;
  } else if (typeof value === 'number' || typeof value === 'boolean') {
    content = <code style={codeStyle}>{String(value)}</code>;
  } else {
    content = (
      <pre style={preStyle}>
        <code
          style={{ fontFamily: 'var(--sl-font-mono)', fontSize: '0.875rem' }}
        >
          {JSON.stringify(value, null, 2)}
        </code>
      </pre>
    );
  }

  return (
    <div style={panelStyle}>
      <span style={labelStyle}>{label}</span>
      {content}
    </div>
  );
};

export { ResultPanel };

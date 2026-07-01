interface CodeSnippetProps {
  call: string | string[];
}

const wrapperStyle = {
  margin: 0,
  padding: '0.5rem 0.75rem',
  borderRadius: '0.375rem',
  background: 'var(--color-code-bg)',
  border: '1px solid var(--sl-color-gray-5)',
  overflowX: 'auto' as const,
  maxWidth: '100%',
  boxSizing: 'border-box' as const,
};

const lineStyle = {
  display: 'block' as const,
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.8125rem',
  color: 'var(--sl-color-accent-high)',
  whiteSpace: 'pre' as const,
  lineHeight: 1.6,
};

const CodeSnippet = ({ call }: CodeSnippetProps) => {
  const lines = Array.isArray(call) ? call : [call];

  return (
    <pre style={wrapperStyle}>
      {lines.map((line, i) => (
        <code key={i} style={lineStyle}>
          {line}
        </code>
      ))}
    </pre>
  );
};

export { CodeSnippet };

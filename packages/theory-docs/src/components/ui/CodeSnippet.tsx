const snippetStyle = {
  margin: 0,
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.875rem',
  color: 'var(--sl-color-gray-2)',
};

const snippetCallStyle = {
  color: 'var(--sl-color-accent-high)',
  display: 'block' as const,
};

interface CodeSnippetProps {
  call: string | string[];
}

const CodeSnippet = ({ call }: CodeSnippetProps) => {
  const lines = Array.isArray(call) ? call : [call];
  return (
    <pre style={snippetStyle}>
      {lines.map((line, i) => (
        <code key={i} style={snippetCallStyle}>
          {line}
        </code>
      ))}
    </pre>
  );
};

export { CodeSnippet };

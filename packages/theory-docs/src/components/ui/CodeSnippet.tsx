const snippetStyle = {
  margin: 0,
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.875rem',
  color: 'var(--sl-color-gray-2)',
};

const snippetCallStyle = {
  color: 'var(--sl-color-accent-high)',
};

const CodeSnippet = ({ call }: { call: string }) => (
  <p style={snippetStyle}>
    <code style={snippetCallStyle}>{call}</code>
  </p>
);

export { CodeSnippet };

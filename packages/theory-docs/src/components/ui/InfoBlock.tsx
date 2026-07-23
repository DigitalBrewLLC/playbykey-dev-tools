const infoBlockStyle = {
  padding: '1rem',
  borderRadius: '0.5rem',
  border: '1px solid var(--sl-color-gray-5)',
  background: 'var(--sl-color-gray-6)',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.5rem',
};

const infoTitleStyle = {
  margin: 0,
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--sl-color-accent-high)',
};

const infoBadgeStyle = {
  fontSize: '0.875rem',
  color: 'var(--sl-color-gray-2)',
};

const InfoBlock = ({ children }: { children: React.ReactNode }) => (
  <div style={infoBlockStyle}>{children}</div>
);

const InfoTitle = ({ children }: { children: React.ReactNode }) => (
  <p style={infoTitleStyle}>{children}</p>
);

const InfoBadge = ({ children }: { children: React.ReactNode }) => (
  <span style={infoBadgeStyle}>{children}</span>
);

export { InfoBlock, InfoTitle, InfoBadge };

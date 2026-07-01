export const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '1.5rem',
};

export const controlsRowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  alignItems: 'flex-end',
  gap: '0.75rem',
};

export const dataRowStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.25rem',
};

export const dataLabelStyle = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--sl-color-gray-2)',
};

export const dataValueStyle = {
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.8125rem',
  color: 'var(--sl-color-gray-1)',
};

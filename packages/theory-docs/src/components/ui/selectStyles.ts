import type { CSSProperties } from 'react';

export const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  marginTop: 0,
};

export const labelStyle: CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--sl-color-gray-2)',
};

export const selectStyle: CSSProperties = {
  margin: 0,
  padding: '0.375rem 0.5rem',
  borderRadius: '0.375rem',
  border: '1px solid var(--sl-color-gray-5)',
  background: 'var(--sl-color-gray-6)',
  color: 'var(--sl-color-gray-1)',
};

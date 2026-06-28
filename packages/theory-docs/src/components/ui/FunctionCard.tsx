import type { CSSProperties } from 'react';
import { ResultPanel } from './ResultPanel';

interface FunctionCardProps {
  name: string;
  signature: string;
  description: string;
  children: React.ReactNode;
  result: unknown;
}

const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  padding: '1rem',
  borderRadius: '0.5rem',
  border: '1px solid var(--sl-color-gray-5)',
  background: 'var(--sl-color-gray-6)',
  marginBottom: '1rem',
};

const headingStyle: CSSProperties = {
  margin: 0,
  fontSize: '1.125rem',
  color: 'var(--sl-color-accent)',
};

const signatureStyle: CSSProperties = {
  margin: 0,
  padding: '0.5rem 0.75rem',
  borderRadius: '0.375rem',
  background: 'var(--sl-color-black)',
  border: '1px solid var(--sl-color-gray-5)',
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.8125rem',
  color: 'var(--sl-color-gray-1)',
  overflowX: 'auto',
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  color: 'var(--sl-color-gray-2)',
  lineHeight: 1.5,
};

const controlsStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
};

const FunctionCard = ({
  name,
  signature,
  description,
  children,
  result,
}: FunctionCardProps) => {
  return (
    <section style={cardStyle}>
      <h3 style={headingStyle}>{name}</h3>
      <pre style={signatureStyle}>
        <code>{signature}</code>
      </pre>
      <p style={descriptionStyle}>{description}</p>
      <div style={controlsStyle}>{children}</div>
      <ResultPanel label="Result" value={result} />
    </section>
  );
};

export { FunctionCard };

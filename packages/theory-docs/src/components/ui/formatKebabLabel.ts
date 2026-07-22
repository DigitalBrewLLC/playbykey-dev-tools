/** Formats a kebab-case (or snake_case) string literal value as a Title Case display label, e.g. 'major-triad' -> 'Major Triad'. */
const formatKebabLabel = (value: string): string =>
  value
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export { formatKebabLabel };

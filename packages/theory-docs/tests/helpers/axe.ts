import { AxeBuilder } from '@axe-core/playwright';
import type { Page } from '@playwright/test';

export const checkAccessibility = async (page: Page) => {
  const results = await new AxeBuilder({ page })
    .include('.sl-markdown-content')
    .analyze();
  const violations = results.violations.filter(
    (v) =>
      v.impact === 'critical' ||
      v.impact === 'serious' ||
      v.impact === 'moderate'
  );
  if (violations.length === 0) return;
  const report = violations
    .map(
      (v) =>
        `[${v.impact}] "${v.id}" - ${v.description}\n` +
        v.nodes.map((n) => `    ${n.html}`).join('\n')
    )
    .join('\n\n');
  throw new Error(`axe found ${violations.length} violation(s):\n\n${report}`);
};

import type { Page } from '@playwright/test';

export const setStarlightTheme = async (
  page: Page,
  theme: 'light' | 'dark'
) => {
  await page.addInitScript((t) => {
    localStorage.setItem('starlight-theme', t);
  }, theme);
};

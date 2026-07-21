import { test } from '@playwright/test';
import { checkAccessibility } from '../helpers/axe';
import { setStarlightTheme } from '../helpers/theme';

const PAGES = [
  { name: 'Overview', path: '/' },
  { name: 'Engine', path: '/theory/engine/' },
  { name: 'Intervals', path: '/theory/intervals/' },
  { name: 'Scales', path: '/theory/scales/' },
  { name: 'Chords', path: '/theory/chords/' },
  { name: 'Progressions', path: '/theory/progressions/' },
  { name: 'Transposition', path: '/theory/transposition/' },
  { name: 'MIDI & Frequency', path: '/theory/midi-frequency/' },
  { name: 'Constants', path: '/theory/constants/' },
];

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

for (const vp of VIEWPORTS) {
  test.describe(`[${vp.name}]`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const theme of ['light', 'dark'] as const) {
      for (const pg of PAGES) {
        test(`[${theme}] ${pg.name} passes axe`, async ({ page }) => {
          await setStarlightTheme(page, theme);
          await page.goto(pg.path);
          await page.waitForLoadState('networkidle');
          await checkAccessibility(page);
        });
      }
    }
  });
}

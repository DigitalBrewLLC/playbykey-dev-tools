import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Theory Engine',
      description: 'API reference and playground for @playbykey/theory',
      sidebar: [
        {
          label: 'Getting Started',
          items: [{ label: 'Overview', slug: '' }],
        },
        {
          label: 'Theory Engine',
          items: [
            { label: 'Engine Functions', slug: 'theory/engine' },
            { label: 'Intervals', slug: 'theory/intervals' },
            { label: 'Scales', slug: 'theory/scales' },
            { label: 'Constants', slug: 'theory/constants' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
    react(),
  ],
});

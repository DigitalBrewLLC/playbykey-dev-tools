import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://theory-engine.docs.playbykey.com',
  integrations: [
    starlight({
      title: 'Theory Engine',
      description: 'API reference and playground for @playbykey/theory',
      titleDelimiter: '-',
      favicon: '/favicon.svg',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/DigitalBrewLLC/playbykey-dev-tools',
        },
      ],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: 'anonymous',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&display=swap',
          },
        },
      ],
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

import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://theory-engine.docs.playbykey.com',
  integrations: [
    starlight({
      title: 'Theory Engine',
      description:
        'TypeScript-first music theory engine for scales, modal relationships, key signatures, and interval resolution. Zero dependencies, full type safety, MCP server support.',
      titleDelimiter: ' | ',
      favicon: '/favicon.svg',
      logo: {
        src: './src/assets/logo.svg',
        alt: '',
        replacesTitle: false,
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/DigitalBrewLLC/playbykey-dev-tools',
        },
        {
          icon: 'external',
          label: 'npm',
          href: 'https://www.npmjs.com/package/@playbykey/theory',
        },
        {
          icon: 'external',
          label: 'PlayByKey',
          href: 'https://playbykey.com',
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
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        {
          tag: 'meta',
          attrs: {
            property: 'og:site_name',
            content: 'Theory Engine | PlayByKey',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://theory-engine.docs.playbykey.com/og.svg',
          },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image',
            content: 'https://theory-engine.docs.playbykey.com/og.svg',
          },
        },
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          content: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: '@playbykey/theory',
            description:
              'TypeScript-first music theory engine for scales, modal relationships, key signatures, and interval resolution. Zero dependencies, full type safety, MCP server support.',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            url: 'https://theory-engine.docs.playbykey.com',
            author: {
              '@type': 'Organization',
              name: 'PlayByKey',
            },
          }),
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
            { label: 'Keys & Modes', slug: 'theory/engine' },
            { label: 'Intervals', slug: 'theory/intervals' },
            { label: 'Scales', slug: 'theory/scales' },
            { label: 'Constants', slug: 'theory/constants' },
          ],
        },
        {
          label: 'playbykey/mcp',
          items: [{ label: 'Setup & Tools', slug: 'mcp' }],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
    react(),
  ],
});

# theory-docs

Documentation site for [`@playbykey/theory`](../theory) — the PlayByKey music theory engine.

Live at **[theory-engine.docs.playbykey.com](https://theory-engine.docs.playbykey.com)**.

---

## What this is

`theory-docs` is an [Astro Starlight](https://starlight.astro.build) site that documents the public API of `@playbykey/theory`. It includes:

- Full function reference for every exported function and constant
- Live interactive playgrounds that call `@playbykey/theory` directly in the browser
- TypeScript type documentation and usage examples
- AI-agent context block for LLM-assisted development

---

## Docs structure

| Page         | Path                 | Contents                                                             |
| ------------ | -------------------- | -------------------------------------------------------------------- |
| Overview     | `/`                  | Install, quickstart, package map, notation notes                     |
| Keys & Modes | `/theory/engine/`    | Scale/mode functions, key relationships, note utilities, type guards |
| Intervals    | `/theory/intervals/` | `IntervalId`, `resolveIntervalEndpoints`, `INTERVAL_DEFINITIONS`     |
| Scales       | `/theory/scales/`    | Blues, pentatonic, harmonic minor, derived scale functions           |
| Constants    | `/theory/constants/` | All exported constants with live explorers                           |

---

## Local development

```sh
# From the monorepo root
pnpm install

# Run the docs site
pnpm --filter theory-docs dev
```

Or from this directory:

```sh
pnpm dev
```

The docs site consumes `@playbykey/theory` as a workspace dependency (`workspace:*`), so any changes to the theory package are reflected immediately without a separate build step.

---

## Stack

- **Framework:** [Astro 7](https://astro.build) + [Starlight](https://starlight.astro.build)
- **Interactivity:** React 19 (playground islands)
- **Language:** TypeScript (strict)
- **Deployment:** Cloudflare Pages (static)
- **Search:** Starlight built-in Pagefind

---

## Deployment

The site is deployed to Cloudflare Pages at `theory-engine.docs.playbykey.com`. Build command:

```sh
pnpm --filter theory-docs build
```

Output directory: `dist/`

---

## Related

- [`@playbykey/theory`](../theory) — the npm package this site documents
- [PlayByKey](https://playbykey.com) — the app that uses this engine
- [playbykey-dev-tools](../../) — the monorepo

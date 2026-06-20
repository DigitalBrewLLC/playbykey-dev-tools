# PlayByKey Developers

Documentation site for all PlayByKey developer tooling: `@playbykey/theory`
(displayed as **Theory Engine**), `@playbykey/songs`, `playbykey-mcp`, and the
`playbykey` CLI. Also home for FAQ content aimed at developers building music
tools.

---

## Status

Planning. This package reserves the workspace location for the site. The
Astro Starlight scaffold, site structure, and content are tracked as a
follow-up task once `@playbykey/theory` has a stable public API to document.

---

## Planned stack

- **Framework:** Astro + Starlight
- **Language:** TypeScript
- **Deployment:** Cloudflare Pages (static)
- **Search:** Starlight's built-in Pagefind

---

## Planned structure

```
docs.playbykey.com/
├── /                Getting started
├── /theory/         Theory Engine (@playbykey/theory)
├── /songs/          @playbykey/songs
├── /mcp/            MCP server
├── /cli/            CLI
└── /faq/            Music theory FAQ for developers
```

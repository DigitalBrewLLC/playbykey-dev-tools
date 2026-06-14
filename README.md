# PlayByKey Developer Tools

Monorepo for PlayByKey's developer-facing packages: the music theory engine,
the song dataset, an MCP server, a CLI, and the PlayByKey Developers
documentation site.

---

## Packages

| Package                                  | Description                                                                                                           | Status         |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------- |
| [`@playbykey/theory`](./packages/theory) | Music theory engine - scales, modes, intervals, and key relationships. Displayed on the docs site as "Theory Engine". | In development |
| [`docs`](./packages/docs)                | PlayByKey Developers - documentation site for all PlayByKey developer tooling (`docs.playbykey.com`).                 | Planning       |

More packages (`@playbykey/songs`, `playbykey-mcp`, `playbykey` CLI) will be
added as the Developer Tooling epic progresses.

---

## Requirements

- Node.js
- pnpm 10.13.1 (see `packageManager` in `package.json`)

---

## Commands

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `pnpm install`    | Install all workspace dependencies |
| `pnpm test`       | Run all Vitest unit tests          |
| `pnpm test:watch` | Run Vitest in watch mode           |
| `pnpm lint`       | Run ESLint across the workspace    |
| `pnpm format`     | Run Prettier across the workspace  |

---

## License

MIT for the repository tooling and `@playbykey/theory`. See [LICENSE](./LICENSE).
Individual packages may declare their own license in their `package.json`.

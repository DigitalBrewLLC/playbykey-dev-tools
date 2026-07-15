<a href="https://playbykey.com"><img src="assets/logo.svg" alt="PlayByKey" width="220" height="42" /></a>

# PlayByKey Developer Tools

Developer-facing packages for PlayByKey. The first shipped package is **[@playbykey/theory](https://www.npmjs.com/package/@playbykey/theory)**, a zero-dependency TypeScript music theory engine for scales, modes, intervals, key relationships, and note display maps.

- **npm:** [npmjs.com/package/@playbykey/theory](https://www.npmjs.com/package/@playbykey/theory)
- **Documentation:** [theory-engine.docs.playbykey.com](https://theory-engine.docs.playbykey.com) - interactive playgrounds
- **Changelog:** [GitHub Releases](https://github.com/DigitalBrewLLC/playbykey-dev-tools/releases)

---

## Install

```sh
npm install @playbykey/theory
pnpm add @playbykey/theory
yarn add @playbykey/theory
bun add @playbykey/theory
```

Quickstart and API examples: [packages/theory/README.md](./packages/theory)

---

## Why @playbykey/theory

- **Foundation music theory engine:** music theory as code. Modes, keys, intervals, and scale relationships resolved deterministically; one source of truth every app, notation tool, or AI agent can build on.
- **Zero dependencies:** no transitive baggage; safe for agents, edge runtimes, and tight bundles
- **TypeScript-first:** strict types exported alongside every function, no `any`
- **Agent-ready:** copy-paste LLM context prompt and [interactive docs](https://theory-engine.docs.playbykey.com)
- **Sharps-only notation:** one canonical spelling per note (`C#`, not `Db`) keeps the `Note` type safe and unambiguous. Flats are fully supported for both input (`parseNote`/`parseNoteToken` accept `Db`, `Eb`, `Gb`, `Ab`, `Bb`) and output (`getFlats`/`getEnharmonicLabels`), without extending `Note` itself.

---

## Packages

| Package                                          | Description                                                    | Links                                                                                                                                                                                   |
| ------------------------------------------------ | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@playbykey/theory`](./packages/theory)         | Music theory engine (Theory Engine on the docs site)           | [npm](https://www.npmjs.com/package/@playbykey/theory) · [docs](https://theory-engine.docs.playbykey.com) · [changelog](https://github.com/DigitalBrewLLC/playbykey-dev-tools/releases) |
| [`@playbykey/theory-mcp`](./packages/theory-mcp) | MCP server that exposes the theory engine as AI-callable tools | [npm](https://www.npmjs.com/package/@playbykey/theory-mcp) · [README](./packages/theory-mcp)                                                                                            |
| [`theory-docs`](./packages/theory-docs)          | Starlight documentation site (private workspace package)       | [live site](https://theory-engine.docs.playbykey.com) · [README](./packages/theory-docs)                                                                                                |

---

## License

MIT for the repository tooling and `@playbykey/theory`. See [LICENSE](./LICENSE).
Individual packages may declare their own license in their `package.json`.

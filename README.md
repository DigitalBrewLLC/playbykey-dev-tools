# PlayByKey Developer Tools

Developer-facing packages for [PlayByKey](https://playbykey.com). The first shipped package is **[@playbykey/theory](https://www.npmjs.com/package/@playbykey/theory)**, a zero-dependency TypeScript music theory engine for scales, modes, intervals, key relationships, and note display maps.

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

- **Zero dependencies:** no transitive baggage; safe for agents, edge runtimes, and tight bundles
- **TypeScript-first:** strict types exported alongside functions
- **Agent-ready:** copy-paste LLM context prompt and [interactive docs](https://theory-engine.docs.playbykey.com)
- **Sharps-only notation:** predictable API contract (`C#` not `Db`)
- **Scale types beyond diatonic:** major, chromatic, pentatonic major/minor, blues, harmonic minor

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

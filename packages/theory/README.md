# @playbykey/theory

Music theory engine for scales, modes, intervals, and key relationships.
Referenced on the PlayByKey Developers docs site (`docs.playbykey.com`) as
**Theory Engine**.

---

## Status

In development. This package is being extracted from the PlayByKey web app's
internal `src/shared/music-theory/` module as part of the Engine Review and
Expansion pre-work. The public API is not yet locked, and this package is not
yet published to npm.

---

## Structure

```
packages/theory/
├── src/
│   ├── index.ts       barrel export - the public API
│   ├── types.ts        domain types (Note, ModeName, ModeInfo, etc.)
│   ├── constants.ts    notes, modes, frameworks, and other constant tables
│   ├── engine.ts        core computation functions
│   ├── intervals.ts     interval definitions and semitone mappings
│   └── scales.ts         scale derivation functions
└── tests/                Vitest unit tests, one file per function
```

---

## Testing

From the repository root:

```bash
pnpm test
```

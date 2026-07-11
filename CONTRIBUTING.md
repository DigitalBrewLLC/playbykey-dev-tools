# Contributing

This repository is a pnpm workspace monorepo. All packages live under
`packages/`.

---

## Setup

```bash
pnpm install
```

---

## Workflow

- `pnpm test` runs all Vitest unit tests across the workspace.
- `pnpm lint` runs ESLint across the workspace.
- `pnpm format` runs Prettier across the workspace.
- Husky runs `lint-staged` on `pre-commit`, applying `eslint --fix` and
  `prettier --write` to staged TypeScript files, and `prettier --write` to
  staged JSON, CSS, YAML, and Markdown files.

---

## Conventions

- TypeScript strict mode (`strict: true`, `noUncheckedIndexedAccess: true`)
  via `tsconfig.base.json`. No `any`, no `as any`, no type assertion bypasses.
- `export type` for type-only exports.
- Each package's public API is exported from a single barrel file
  (`src/index.ts`).
- Do not use em-dashes (`—`) in prose, comments, or string literals - use
  `-` instead.

---

## Git

- Each PR should represent a single functional change.
- Do not make changes directly on `main` - use a feature branch and open a PR.

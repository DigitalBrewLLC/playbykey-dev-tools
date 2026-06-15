# Rename "Theory"-prefixed interval and scale-kind identifiers to generic names

## Outcome

The following identifiers are renamed throughout `@playbykey/theory`:

| Current name            | New name             |
| ----------------------- | -------------------- |
| `TheoryIntervalId`      | `IntervalId`         |
| `TheoryScaleKind`       | `ScaleKind`          |
| `TheoryIntervalContext` | `IntervalContext`    |
| `THEORY_INTERVAL_IDS`   | `INTERVAL_ID_VALUES` |
| `THEORY_SCALE_KINDS`    | `SCALE_KIND_VALUES`  |
| `isTheoryIntervalId`    | `isIntervalId`       |

Every reference to these identifiers in `packages/theory/src/`, `packages/theory/tests/`, and `packages/theory/docs/` is updated to the new name. No identifier keeps its old name as an alias or re-export. `pnpm typecheck` and `pnpm test` pass for `@playbykey/theory` after the change.

## Why

`@playbykey/theory` is being published as a standalone music theory engine for any developer to use - it is not a PlayByKey-website-specific module, even though its implementation is ported from and inspired by the PlayByKey website's internal engine. The "Theory" prefix on these six identifiers is a holdover from the PlayByKey website, where it referred to that site's "Theory" content section (`src/pages/theory/`, `src/data/theory/`) - the subtopics, diagrams, and scale strips shown on those pages. Inside a package that is _itself_ named `@playbykey/theory`, a type called `TheoryIntervalId` reads as redundant ("theory" inside "theory") and signals a coupling to the PlayByKey website's content structure that does not actually exist in this engine.

Renaming these to `IntervalId`, `ScaleKind`, and `IntervalContext` makes the public API read naturally for an external consumer who has never heard of PlayByKey's website - "an interval id" and "a scale kind" are self-explanatory engine concepts, while "a theory interval id" implies a relationship to some external "theory" system the consumer would need to look up. This is a pure rename with no behavioral change, done now while the v1 API is still unlocked (renames after publishing are breaking changes).

## Context

`@playbykey/theory` lives at `packages/theory/` in this repo (`playbykey-dev-tools`, a pnpm workspace monorepo). Its public API is exported from `packages/theory/src/index.ts` (the barrel file). Source modules:

- `src/types.ts` - domain type definitions
- `src/constants.ts` - named constant maps and derived arrays
- `src/intervals.ts` - interval catalog and resolution functions
- `src/scales.ts` - scale-kind definitions and derivation functions
- `src/engine.ts` - core note/scale/key computation functions
- `src/index.ts` - barrel export

### Current definitions of the six identifiers

In `src/types.ts`:

```ts
/** Theory interval subtopic ids used in the interval catalog and diagrams. */
type TheoryIntervalId =
  | 'half_step'
  | 'whole_step'
  | 'major_2nd'
  | 'minor_3rd'
  | 'major_3rd'
  | 'perfect_4th'
  | 'tritone'
  | 'perfect_5th'
  | 'minor_6th'
  | 'major_6th'
  | 'minor_7th'
  | 'major_7th'
  | 'octave';

/** Scale kinds used in theory diagrams and scale strips. */
type TheoryScaleKind =
  | 'mode'
  | 'chromatic'
  | 'pentatonic'
  | 'blues'
  | 'harmonic-minor';
```

Both types are listed in `types.ts`'s `export type { ... }` block.

In `src/constants.ts`:

```ts
/** Named constants for each theory interval id, validated against TheoryIntervalId. */
const INTERVAL_IDS = {
  HALF_STEP: 'half_step',
  // ... through OCTAVE
} as const satisfies Record<string, TheoryIntervalId>;

/** All theory interval ids derived from INTERVAL_IDS. */
const THEORY_INTERVAL_IDS = Object.values(
  INTERVAL_IDS
) as readonly TheoryIntervalId[];

/** Named constants for each theory scale kind, validated against TheoryScaleKind. */
const SCALE_KIND_IDS = {
  MODE: 'mode',
  // ... through HARMONIC_MINOR
} as const satisfies Record<string, TheoryScaleKind>;

/** All theory scale kinds derived from SCALE_KIND_IDS. */
const THEORY_SCALE_KINDS = Object.values(
  SCALE_KIND_IDS
) as readonly TheoryScaleKind[];
```

`INTERVAL_IDS` and `SCALE_KIND_IDS` (the named-constant maps) are **not** being renamed - only `THEORY_INTERVAL_IDS` and `THEORY_SCALE_KINDS` (the derived arrays of all values) are. This means a naive "strip the `THEORY_` prefix" would produce `INTERVAL_IDS` and `SCALE_KINDS`, which either collides with (`INTERVAL_IDS`) or is inconsistent with (`SCALE_KIND_IDS` -> `SCALE_KINDS`) the existing map names. `INTERVAL_ID_VALUES` / `SCALE_KIND_VALUES` were chosen instead: `*_IDS` (or `*_KIND_IDS`) is always the named-constant map, `*_ID_VALUES` / `*_KIND_VALUES` is always the derived array of all values - a consistent, non-colliding pair.

In `src/intervals.ts`:

```ts
import { INTERVAL_IDS, THEORY_INTERVAL_IDS } from './constants';
import { getNoteIndex, getScaleNotes, noteAtIndex } from './engine';
import type { ModeName, Note, TheoryIntervalId } from './types';

interface TheoryIntervalContext {
  root: Note;
  mode: ModeName;
  interval: TheoryIntervalId;
}
// ...
const INTERVAL_DEFINITIONS: Record<TheoryIntervalId, IntervalDefinition> = {
  /* ... */
};

const isTheoryIntervalId = (value: string): value is TheoryIntervalId =>
  (THEORY_INTERVAL_IDS as readonly string[]).includes(value);

// ...
const intervalUsesChromaticTo = (interval: TheoryIntervalId): boolean =>
  INTERVAL_DEFINITIONS[interval].intervalSpec.chromaticTo === true;

const resolveIntervalEndpoints = (
  context: TheoryIntervalContext
): ResolvedInterval => {
  /* ... */
};

export type {
  TheoryIntervalContext,
  IntervalSpec,
  IntervalDefinition,
  ResolvedInterval,
};

export {
  INTERVAL_DEFINITIONS,
  isTheoryIntervalId,
  intervalUsesChromaticTo,
  resolveIntervalEndpoints,
};
```

In `src/scales.ts`, `TheoryScaleKind` is used as the parameter type for `SCALE_DEFINITIONS`, `getScaleEmphasisDegrees`, `getDerivedScaleNotes`, and `getKeyboardContextNotes`:

```ts
import type { ModeName, Note, TheoryScaleKind } from './types';

const SCALE_DEFINITIONS: Record<TheoryScaleKind, ScaleDefinition> = {
  /* ... */
};

const getScaleEmphasisDegrees = (
  scaleKind: TheoryScaleKind
): readonly number[] => {
  /* ... */
};

const getDerivedScaleNotes = (
  root: Note,
  mode: ModeName,
  scaleKind: TheoryScaleKind
): Note[] => {
  /* ... */
};

const getKeyboardContextNotes = (
  root: Note,
  mode: ModeName,
  scaleKind: TheoryScaleKind
): Note[] => {
  /* ... */
};
```

In `src/index.ts`, the barrel file re-exports all six identifiers:

```ts
export type {
  // ...
  TheoryIntervalId,
  TheoryScaleKind,
  // ...
} from './types';

export {
  // ...
  THEORY_INTERVAL_IDS,
  // ...
  THEORY_SCALE_KINDS,
  // ...
} from './constants';

export type {
  TheoryIntervalContext,
  // ...
} from './intervals';

export {
  // ...
  isTheoryIntervalId,
  // ...
} from './intervals';
```

### Documentation references

`packages/theory/docs/api-reference.md` documents `TheoryIntervalId`, `TheoryScaleKind`, `TheoryIntervalContext`, `THEORY_INTERVAL_IDS`, `THEORY_SCALE_KINDS`, and `isTheoryIntervalId` in its Types table, Constants table, and function-reference sections for `engine.ts`, `intervals.ts`, and `scales.ts`.

`packages/theory/docs/open-questions.md`, section "3. `getIntervalSemitones` signature", uses `TheoryIntervalId` and `TheoryIntervalContext` in its discussion of a not-yet-implemented function.

### Test files

No test file in `packages/theory/tests/` references any of the six identifiers by name (confirmed by search). `tests/scales.test.ts` imports `SCALE_KIND_IDS` (the named-constant map, unchanged by this task) and uses scale-kind string literals (`'mode'`, `'chromatic'`, etc., also unchanged) - it does not need to change.

## Scope

- `packages/theory/src/types.ts` - rename the two type declarations and their entries in `export type { ... }`. Reword their JSDoc comments to remove "theory ... subtopic ids" / "theory diagrams and scale strips" framing (e.g. `/** Interval identifiers used in the interval catalog. */` and `/** Scale kinds supported by the scale-derivation functions. */`).
- `packages/theory/src/constants.ts` - update the `import type { ... } from './types'` block, the two `satisfies Record<string, ...>` clauses, rename `THEORY_INTERVAL_IDS` -> `INTERVAL_ID_VALUES` and `THEORY_SCALE_KINDS` -> `SCALE_KIND_VALUES` (declaration, JSDoc comment, and `export { ... }` entry).
- `packages/theory/src/intervals.ts` - update the import from `./constants` (`THEORY_INTERVAL_IDS` -> `INTERVAL_ID_VALUES`), the import from `./types` (`TheoryIntervalId` -> `IntervalId`), the `TheoryIntervalContext` interface (rename to `IntervalContext`), every use of `TheoryIntervalId` as a type annotation (in `INTERVAL_DEFINITIONS`, `isTheoryIntervalId`, `intervalUsesChromaticTo`), rename `isTheoryIntervalId` -> `isIntervalId` (declaration and `export { ... }` entry), and `TheoryIntervalContext` -> `IntervalContext` everywhere (including `export type { ... }`).
- `packages/theory/src/scales.ts` - update the import from `./types` (`TheoryScaleKind` -> `ScaleKind`) and every parameter/type annotation using `TheoryScaleKind` (in `SCALE_DEFINITIONS`, `getScaleEmphasisDegrees`, `getDerivedScaleNotes`, `getKeyboardContextNotes`).
- `packages/theory/src/index.ts` - update all six identifiers in the re-export blocks from `./types`, `./constants`, and `./intervals`.
- `packages/theory/docs/api-reference.md` - replace every occurrence of the six old names with their new names in the Types table, Constants table, and the `engine.ts`, `intervals.ts`, and `scales.ts` function-reference sections.
- `packages/theory/docs/open-questions.md` - replace `TheoryIntervalId` and `TheoryIntervalContext` with `IntervalId` and `IntervalContext` in section 3 ("`getIntervalSemitones` signature").

## Out of Scope

- `intervalUsesChromaticTo` and `getKeyboardContextNotes` are also expected to change as part of a separate "tighten the public API surface" task (removing/renaming PlayByKey-app-specific exports). This task only renames their `TheoryIntervalId`/`TheoryScaleKind`-typed parameters if those functions still exist after this task lands - it does not remove or rename the functions themselves.
- No new functions, types, or constants are added. This is a rename only.
- `INTERVAL_IDS` and `SCALE_KIND_IDS` (the named-constant maps) keep their current names - only the derived "all values" arrays (`THEORY_INTERVAL_IDS`, `THEORY_SCALE_KINDS`) are renamed.
- The website repo (`website/src/shared/music-theory/`) is not touched. It will be updated separately, after `@playbykey/theory`'s API is stable.
- `Note`, `ModeName`, `ModeInfo`, `NotationType`, `AccidentalType`, and all other types/constants not listed in the rename table are unchanged.

## Acceptance Criteria

- `grep -r "TheoryIntervalId\|TheoryScaleKind\|TheoryIntervalContext\|THEORY_INTERVAL_IDS\|THEORY_SCALE_KINDS\|isTheoryIntervalId" packages/theory/` returns no matches.
- `IntervalId`, `ScaleKind`, `IntervalContext`, `INTERVAL_ID_VALUES`, `SCALE_KIND_VALUES`, and `isIntervalId` each appear in `packages/theory/src/index.ts`'s exports, in place of their old-named counterparts.
- `pnpm --filter @playbykey/theory typecheck` passes with no errors.
- `pnpm --filter @playbykey/theory test` passes with no failures (no test file required changes, but the full suite must still pass after the rename).
- `packages/theory/docs/api-reference.md` and `packages/theory/docs/open-questions.md` contain no remaining references to the six old names.

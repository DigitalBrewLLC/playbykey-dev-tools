# Remove PlayByKey-app-specific types and constants from the public API

## Outcome

`@playbykey/theory`'s public API (everything exported from `packages/theory/src/index.ts`) no longer includes any type or constant whose purpose is to describe PlayByKey website content or UI state. Specifically, after this task:

- These types are deleted from `src/types.ts` (definition and `export type { ... }` entry): `FrameworkId`, `FrameworkInfo`, `HowItWorksContent`, `CategoryInfo`, `CategoryLevel`, `CategoryLevelLabel`, `VisualizationType`, `VisualizationState`, `RelativePerspective`.
- These constants are deleted from `src/constants.ts` (definition and `export { ... }` entry): `FRAMEWORK_IDS`, `FRAMEWORKS`, `CATEGORIES`, `VALID_FRAMEWORK_IDS`, `VISUALIZATION_IDS`, `PERSPECTIVE_IDS`.
- `intervalUsesChromaticTo` is deleted from `src/intervals.ts` entirely (definition and export).
- `getKeyboardContextNotes` in `src/scales.ts` is renamed to `getScaleContextNotes`, and its JSDoc comment is reworded to remove "keyboard/fretboard" framing.
- `packages/theory/src/index.ts` no longer re-exports any of the removed identifiers, and re-exports `getScaleContextNotes` in place of `getKeyboardContextNotes`.
- `packages/theory/tests/scales.test.ts` is updated to use `getScaleContextNotes`.
- `packages/theory/docs/api-reference.md` no longer documents any of the removed identifiers, and documents `getScaleContextNotes` in place of `getKeyboardContextNotes`.
- `pnpm --filter @playbykey/theory typecheck` and `pnpm --filter @playbykey/theory test` both pass.

Everything else - `Note`, `ModeName`, `ModeInfo`, `NotationType`, `AccidentalType`, `NoteDisplayInfo`, `NOTES`, `MODES`, `MODE_NAMES`, `MODE_IDS`, `NOTATION_IDS`, `ACCIDENTAL_IDS`, `ENHARMONIC_LABELS`, the interval/scale-kind types and constants, and every function in `engine.ts`, `intervals.ts`, and `scales.ts` other than the two named above - is unchanged.

## Why

`packages/theory/docs/.claude-source/engine-review.md`-style review (the "Engine Review" pre-work, documented in the website repo's epics as "Pre-work: Engine Review and Expansion") set out two goals for this package before its v1 API is locked: **tighten** the public surface (remove anything that's an implementation detail or a PlayByKey-app concern) and **expand** it (add missing generic theory functions). That review's own type audit explicitly called out:

- `VisualizationType` - "is this useful outside a UI context, or is it PlayByKey-specific? Candidate for exclusion."
- `FRAMEWORK_IDS` - "is this a library concern or an app concern? Candidate for exclusion."
- `Note`, `ModeName`, `ModeInfo`, `AccidentalType` - "these are domain types. Include."

`FrameworkInfo`, `FRAMEWORKS`, `CategoryInfo`, `CATEGORIES`, `CategoryLevel`, `CategoryLevelLabel`, `HowItWorksContent`, `FRAMEWORK_IDS`, `FrameworkId`, and `VALID_FRAMEWORK_IDS` are PlayByKey website page content and routing data (the five "practice frameworks" - Modal System, Major Scale System, etc. - and their three "practice category" levels, with full marketing/explainer copy). None of this is music theory; it's PlayByKey product content that happens to live in the same source tree this package was copied from. `VisualizationType`, `VisualizationState`, `VISUALIZATION_IDS`, `RelativePerspective`, and `PERSPECTIVE_IDS` describe PlayByKey's UI state (which instrument view is selected, which "framework" filter is active) and aren't consumed by any computation function in this package.

`intervalUsesChromaticTo` and `getKeyboardContextNotes` are implementation-detail / naming issues rather than content issues: `intervalUsesChromaticTo` only restates information already available via the exported `INTERVAL_DEFINITIONS` catalog (`INTERVAL_DEFINITIONS[interval].intervalSpec.chromaticTo`), so exporting it as a separate function is redundant; and `getKeyboardContextNotes` bakes in a "keyboard" framing for a function that just returns a `Note[]` - any consumer (keyboard, fretboard, sheet music, etc.) can use it, so the name should not imply one specific visualization.

This is part of making `@playbykey/theory` an honestly standalone, PlayByKey-agnostic music theory engine - inspired by and ported from the PlayByKey website's internal engine, but not bundling that website's product content or UI vocabulary.

## Context

`@playbykey/theory` lives at `packages/theory/` in this repo (`playbykey-dev-tools`, a pnpm workspace monorepo). Its public API is exported from `packages/theory/src/index.ts`. Source modules: `src/types.ts`, `src/constants.ts`, `src/intervals.ts`, `src/scales.ts`, `src/engine.ts`, `src/index.ts`.

### Types to remove from `src/types.ts`

These nine type/interface declarations exist in `src/types.ts` and are each listed in its `export type { ... }` block:

```ts
/** Identifier for each of the five practice frameworks. */
type FrameworkId =
  | 'modal'
  | 'major-scale'
  | 'minor-scale'
  | 'relative-key'
  | 'circle-of-fifths';

/** Available instrument/visualization views. */
type VisualizationType = 'keyboard' | 'fretboard';

/** Which tonal center to highlight in the Relative Key framework view. */
type RelativePerspective = 'major' | 'minor';

/** Practice category level corresponding to the three progressive stages. */
type CategoryLevel = 1 | 2 | 3;

/** Player-facing difficulty label for a practice category level. */
type CategoryLevelLabel = 'Beginner' | 'Intermediate' | 'Advanced';

/** "How it works" content block for a framework's explainer section. */
interface HowItWorksContent {
  paragraphs: string[];
  example?: string;
}

/** Display metadata for a framework. */
interface FrameworkInfo {
  id: FrameworkId;
  name: string;
  subtitle: string;
  description: string;
  howItWorks?: HowItWorksContent;
}

/** Display metadata for a practice category. */
interface CategoryInfo {
  level: CategoryLevel;
  levelLabel: CategoryLevelLabel;
  name: string;
  timeRange: string;
  focus: string;
}

/** The complete filter state driving all visualizations. */
interface VisualizationState {
  key: Note;
  mode: ModeName;
  notation: NotationType;
  view: VisualizationType;
  accidental: AccidentalType;
}
```

All nine are deleted (declaration plus JSDoc comment), and removed from the `export type { ... }` block at the bottom of the file. Types that remain in `types.ts` after this change: `Note`, `ModeName`, `TheoryIntervalId`/`IntervalId`, `TheoryScaleKind`/`ScaleKind`, `NotationType`, `AccidentalType`, `ModeInfo`, `NoteDisplayInfo`. (`NoteDisplayInfo` does not reference any of the removed types and is unaffected.)

### Constants to remove from `src/constants.ts`

```ts
/** Named constants for each relative perspective ID, validated against RelativePerspective. */
const PERSPECTIVE_IDS = {
  MAJOR: 'major',
  MINOR: 'minor',
} as const satisfies Record<string, RelativePerspective>;

/** Named constants for each visualization view, validated against VisualizationType. */
const VISUALIZATION_IDS = {
  KEYBOARD: 'keyboard',
  FRETBOARD: 'fretboard',
} as const satisfies Record<string, VisualizationType>;

/** Named constants for each framework ID, validated against FrameworkId. */
const FRAMEWORK_IDS = {
  MODAL: 'modal',
  MAJOR_SCALE: 'major-scale',
  MINOR_SCALE: 'minor-scale',
  RELATIVE_KEY: 'relative-key',
  CIRCLE_OF_FIFTHS: 'circle-of-fifths',
} as const satisfies Record<string, FrameworkId>;

/** The five frameworks with metadata for display and routing. */
const FRAMEWORKS: readonly FrameworkInfo[] = [
  // ... 5 entries, each with id, name, subtitle, description, and a
  // howItWorks block containing multiple paragraphs of explainer copy
  // about PlayByKey's "Modal System", "Major Scale System",
  // "Minor Scale System", "Relative Key System", and "Circle of Fifths
  // System" practice frameworks.
] as const;

/** The three practice category levels shared across all frameworks. */
const CATEGORIES: readonly CategoryInfo[] = [
  // ... 3 entries (Beginner / Foundation & Orientation,
  // Intermediate / Controlled Improvisation, Advanced / Free Application)
  // with timeRange and focus copy for PlayByKey's practice pages.
] as const;

/** Set of valid framework IDs for route validation. */
const VALID_FRAMEWORK_IDS = new Set(FRAMEWORKS.map((fw) => fw.id));
```

All six are deleted (definitions plus JSDoc comments), and removed from the `export { ... }` block at the bottom of the file. Also remove `HowItWorksContent`, `FrameworkInfo`, `CategoryInfo`, `FrameworkId`, `RelativePerspective`, `VisualizationType` from the `import type { ... } from './types'` block at the top of `constants.ts` (they are only used by the constants being removed). Constants that remain in `constants.ts` after this change: `NOTES`, `NOTATION_IDS`, `MODE_IDS`, `MODE_NAMES`, `INTERVAL_IDS`, `THEORY_INTERVAL_IDS`/`INTERVAL_ID_VALUES`, `SCALE_KIND_IDS`, `THEORY_SCALE_KINDS`/`SCALE_KIND_VALUES`, `ACCIDENTAL_IDS`, `MODES`, `ENHARMONIC_LABELS`.

### `intervalUsesChromaticTo` to remove from `src/intervals.ts`

```ts
const intervalUsesChromaticTo = (interval: TheoryIntervalId): boolean =>
  INTERVAL_DEFINITIONS[interval].intervalSpec.chromaticTo === true;
```

(Note: depending on whether the "drop Theory prefix" rename task has landed first, this parameter may already read `IntervalId` instead of `TheoryIntervalId` - either way, delete the whole function.) Nothing else in `intervals.ts` calls this function - `resolveEndpointsFromSpec` checks `intervalSpec.chromaticTo === true` directly. Remove the function definition and its entry in `intervals.ts`'s `export { ... }` block.

### `getKeyboardContextNotes` to rename in `src/scales.ts`

```ts
/**
 * Returns the wider note set used as keyboard/strip context behind a scale kind
 * (e.g. aeolian for blues, parent mode for pentatonic).
 */
const getKeyboardContextNotes = (
  root: Note,
  mode: ModeName,
  scaleKind: TheoryScaleKind
): Note[] => {
  if (scaleKind === 'chromatic') {
    return [...NOTES];
  }
  if (scaleKind === 'blues') {
    return getScaleNotes(root, MODE_IDS.AEOLIAN);
  }
  if (scaleKind === 'harmonic-minor') {
    return getHarmonicMinorNotes(root);
  }
  return getScaleNotes(root, mode);
};
```

Rename the function to `getScaleContextNotes` (the function body and its `scaleKind` parameter type are unchanged - leave `TheoryScaleKind`/`ScaleKind` as whatever the rename task has or hasn't done). Reword the JSDoc comment to remove the "keyboard/strip" framing, e.g.:

```ts
/**
 * Returns the wider note set used as harmonic context around a scale kind
 * (e.g. aeolian for blues, parent mode for pentatonic).
 */
```

Update its entry in `scales.ts`'s `export { ... }` block from `getKeyboardContextNotes` to `getScaleContextNotes`.

### `src/index.ts` barrel updates

Remove from the `export type { ... } from './types'` block: `FrameworkId`, `VisualizationType`, `CategoryLevel`, `CategoryLevelLabel`, `FrameworkInfo`, `CategoryInfo`, `VisualizationState`. (`HowItWorksContent` and `RelativePerspective` are not currently in this block, so nothing to remove there for those two - they are only removed from `types.ts` itself per above.)

Remove from the `export { ... } from './constants'` block: `PERSPECTIVE_IDS`, `VISUALIZATION_IDS`, `FRAMEWORK_IDS`, `FRAMEWORKS`, `CATEGORIES`, `VALID_FRAMEWORK_IDS`.

Remove `intervalUsesChromaticTo` from the `export { ... } from './intervals'` block.

In the `export { ... } from './scales'` block, replace `getKeyboardContextNotes` with `getScaleContextNotes`.

### `packages/theory/tests/scales.test.ts`

This file currently imports and tests `getKeyboardContextNotes`:

```ts
import {
  BLUES_SEMITONE_OFFSETS,
  getBluesNotes,
  getDerivedScaleNotes,
  getHarmonicMinorNotes,
  getKeyboardContextNotes,
  getPentatonicDegrees,
  getScaleEmphasisDegrees,
  PENTATONIC_DEGREES,
  SCALE_DEFINITIONS,
} from '../src/scales';
// ...
describe('getKeyboardContextNotes', () => {
  it('uses aeolian parent for blues keyboard context', () => {
    expect(getKeyboardContextNotes('A', MODE_IDS.AEOLIAN, 'blues')).toEqual(
      getScaleNotes('A', MODE_IDS.AEOLIAN)
    );
  });

  it('uses parent mode for pentatonic keyboard context', () => {
    expect(getKeyboardContextNotes('C', MODE_IDS.IONIAN, 'pentatonic')).toEqual(
      getScaleNotes('C', MODE_IDS.IONIAN)
    );
  });
});
```

Rename the import and both usages to `getScaleContextNotes`, and rename the `describe` block to `'getScaleContextNotes'`. Test bodies and assertions are otherwise unchanged. No other test file references any of the removed identifiers, `intervalUsesChromaticTo`, or `getKeyboardContextNotes` (confirmed by search).

### `packages/theory/docs/api-reference.md`

This file documents the current public API. Remove:

- From the "Core types" table: the rows for `FrameworkId`, `VisualizationType`, `CategoryLevel`, `CategoryLevelLabel`, `FrameworkInfo`, `CategoryInfo`, `VisualizationState`.
- From the "Constants" table: the rows for `PERSPECTIVE_IDS`, `VISUALIZATION_IDS`, `FRAMEWORK_IDS`, `FRAMEWORKS`, `CATEGORIES`, `VALID_FRAMEWORK_IDS`.
- From the "Intervals (`src/intervals.ts`)" section: the entire `#### intervalUsesChromaticTo` subsection.
- The "Scales (`src/scales.ts`)" section's `#### getKeyboardContextNotes` subsection: rename the heading to `#### getScaleContextNotes`, update the `**Signature:**` line to `getScaleContextNotes(root: Note, mode: ModeName, scaleKind: ...): Note[]` (keeping whatever `TheoryScaleKind`/`ScaleKind` the rename task has produced), and reword the description/use-case bullets to drop "keyboard/fretboard" framing (e.g. "Returns the wider note set used as harmonic context around `scaleKind`" and "Use case: determining which notes to render as backdrop around the emphasized notes from `getDerivedScaleNotes`, for any visualization - keyboard, fretboard, or otherwise.").

## Scope

- `packages/theory/src/types.ts`
- `packages/theory/src/constants.ts`
- `packages/theory/src/intervals.ts`
- `packages/theory/src/scales.ts`
- `packages/theory/src/index.ts`
- `packages/theory/tests/scales.test.ts`
- `packages/theory/docs/api-reference.md`

## Out of Scope

- The "drop Theory prefix" rename (`TheoryIntervalId` -> `IntervalId`, `TheoryScaleKind` -> `ScaleKind`, etc.) is a separate task. This task does not depend on it and does not perform it - if it has already landed, use the new names where this task references `TheoryScaleKind`/`TheoryIntervalId`; if not, leave those names as-is.
- `Note`, `ModeName`, `ModeInfo`, `NotationType`, `AccidentalType`, `ACCIDENTAL_IDS`, `NOTATION_IDS`, `NoteDisplayInfo`, and `buildNoteMap` are kept as-is - they are generic domain types/functions, not PlayByKey-app concerns, per the Engine Review's type audit.
- `getScaleEmphasisDegrees` and `getDerivedScaleNotes` are not renamed or modified by this task (only `getKeyboardContextNotes` -> `getScaleContextNotes`).
- No new types, constants, or functions are added by this task.
- The website repo (`website/src/shared/music-theory/`) is not touched - it keeps its own copies of `FRAMEWORKS`, `CATEGORIES`, etc. for the website's own use. Migrating the website to import from `@playbykey/theory` is separate, later work.
- Do not attempt to "preserve" the removed content anywhere in `packages/theory` (e.g. as comments, a `_legacy` file, or a different export name) - it is PlayByKey website content with no role in this package, and the website repo remains its source of truth.

## Acceptance Criteria

- `grep -r "FrameworkId\|FrameworkInfo\|HowItWorksContent\|CategoryInfo\|CategoryLevel\|VisualizationType\|VisualizationState\|RelativePerspective\|FRAMEWORK_IDS\|FRAMEWORKS\|CATEGORIES\|VALID_FRAMEWORK_IDS\|VISUALIZATION_IDS\|PERSPECTIVE_IDS\|intervalUsesChromaticTo\|getKeyboardContextNotes" packages/theory/` returns no matches.
- `getScaleContextNotes` is exported from `packages/theory/src/index.ts` and used in `packages/theory/tests/scales.test.ts`.
- `pnpm --filter @playbykey/theory typecheck` passes with no errors.
- `pnpm --filter @playbykey/theory test` passes with no failures.
- `packages/theory/docs/api-reference.md` contains no rows/sections for the removed identifiers and documents `getScaleContextNotes`.

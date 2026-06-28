# Create IntervalExplorer Component

## Outcome

A new file exists at `packages/theory-docs/src/components/playgrounds/IntervalExplorer.tsx`. It is a self-contained interactive React component. Selecting a root, mode, and interval immediately shows the interval's label and semitone count from `INTERVAL_DEFINITIONS`, the resolved `from` and `to` notes from `resolveIntervalEndpoints`, and a live code snippet. A `ResultPanel` shows the full `ResolvedInterval` object.

## Why

The Intervals section currently shows a static table of 13 interval IDs, labels, and semitone counts. A developer cannot tell from that table how `INTERVAL_DEFINITIONS` is actually used — what it means to "resolve" an interval, or which notes a half step spans in a given key. The `IntervalExplorer` makes this concrete: pick a root, mode, and interval and immediately see the two notes that bound it.

## Context

**Repository:** `playbykey-dev-tools` — a pnpm monorepo.

**Package:** `packages/theory-docs` — an Astro Starlight documentation site for `@playbykey/theory`. React components are used as interactive islands with `client:load` in MDX pages.

**Component location convention:** Interactive playground components live in `packages/theory-docs/src/components/playgrounds/`. Reference implementation: `ModeExplorer.tsx`. All follow the same pattern: inline styles, `useState` + `useMemo`, named + default export.

**Styling convention:** All styling uses inline style objects with Starlight CSS custom properties (`--sl-color-*`, `--sl-font`, `--sl-font-mono`). No CSS modules, no Tailwind, no `className`. See `ModeExplorer.tsx` for the exact style object shapes to replicate.

**UI primitives available** (import from `'../ui/<Name>'`):

- `NoteSelect` — `import { NoteSelect } from '../ui/NoteSelect'`. Props: `value: Note`, `onChange: (note: Note) => void`, `label?: string` (default `'Root'`).
- `ModeSelect` — `import { ModeSelect } from '../ui/ModeSelect'`. Props: `value: ModeName`, `onChange: (mode: ModeName) => void`, `label?: string` (default `'Mode'`).
- `IntervalSelect` — `import { IntervalSelect } from '../ui/IntervalSelect'`. Props: `value: IntervalId`, `onChange: (interval: IntervalId) => void`, `label?: string` (default `'Interval'`).
- `ResultPanel` — `import { ResultPanel } from '../ui/ResultPanel'`. Props: `label: string`, `value: unknown`.

**Theory package exports** (import from `'@playbykey/theory'`):

Types:

```typescript
type Note =
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'A'
  | 'A#'
  | 'B';
type ModeName =
  | 'ionian'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'aeolian'
  | 'locrian';
type IntervalId =
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

interface ResolvedInterval {
  from: Note;
  to: Note;
  semitones: number;
  label: string;
}

interface IntervalDefinition {
  label: string;
  intervalSpec: {
    fromDegree: number;
    toDegree?: number;
    semitones: number;
    chromaticTo?: boolean;
  };
}
```

Constants:

```typescript
// Maps each IntervalId to its label and intervalSpec
const INTERVAL_DEFINITIONS: Record<IntervalId, IntervalDefinition>;
// e.g. INTERVAL_DEFINITIONS['perfect_5th'] === { label: 'Perfect 5th', intervalSpec: { fromDegree: 1, toDegree: 5, semitones: 7 } }
```

Functions:

```typescript
// Resolves an interval to its actual from/to notes in a given root and mode context
resolveIntervalEndpoints(context: { root: Note; mode: ModeName; interval: IntervalId }): ResolvedInterval;
```

**TypeScript config:** strict mode. `INTERVAL_DEFINITIONS` is `Record<IntervalId, IntervalDefinition>` (not Partial), so access with a valid `IntervalId` does not require undefined narrowing.

## Scope

**New file:**

- `packages/theory-docs/src/components/playgrounds/IntervalExplorer.tsx`

No other files change in this task.

## Out of Scope

- Do not modify `constants.mdx` — that is Task 5.
- Do not modify any existing component in `ui/` or `playgrounds/`.
- Do not add any new npm dependencies.

## Acceptance Criteria

1. File exists at `packages/theory-docs/src/components/playgrounds/IntervalExplorer.tsx`.
2. `pnpm --filter theory-docs build` passes without errors.
3. `pnpm lint` passes with no new errors.
4. Component exports both `IntervalExplorer` (named) and `default`.
5. Component has three pieces of state: `root: Note` ('C'), `mode: ModeName` ('ionian'), `interval: IntervalId` ('perfect_5th').
6. Controls row renders `NoteSelect`, `ModeSelect`, and `IntervalSelect`.
7. An info block shows the selected interval's `label` and `semitones` from `INTERVAL_DEFINITIONS[interval]`.
8. A code snippet line reads `resolveIntervalEndpoints({ root: 'C', mode: 'ionian', interval: 'perfect_5th' })` on initial render and updates to reflect current state.
9. A `ResultPanel` with `label="resolveIntervalEndpoints result"` shows the `ResolvedInterval` object (`{ from, to, semitones, label }`).
10. No `any` types, no unsafe type assertions, no lint suppressions.

---

## Implementation notes

**State and derived values:**

```typescript
const [root, setRoot] = useState<Note>('C');
const [mode, setMode] = useState<ModeName>('ionian');
const [interval, setInterval] = useState<IntervalId>('perfect_5th');

const definition = useMemo(() => INTERVAL_DEFINITIONS[interval], [interval]);
const resolved = useMemo(
  () => resolveIntervalEndpoints({ root, mode, interval }),
  [root, mode, interval]
);
```

Both `definition` and `resolved` are always defined — `Record<IntervalId, ...>` access with a valid key never returns undefined.

**Info block** — show label and semitones from the definition:

```tsx
<div style={infoBlockStyle}>
  <p style={modeNameStyle}>{definition.label}</p>
  <span style={degreeBadgeStyle}>
    {definition.intervalSpec.semitones} semitones
  </span>
</div>
```

Use `modeNameStyle` (amber, monospace) for the interval label and `degreeBadgeStyle` (gray, small) for the semitone count — matching the info block pattern in `ModeExplorer.tsx`.

**Code snippet:**

```tsx
<p style={snippetStyle}>
  <code style={snippetCallStyle}>
    {`resolveIntervalEndpoints({ root: '${root}', mode: '${mode}', interval: '${interval}' })`}
  </code>
</p>
```

**Style objects** — follow `ModeExplorer.tsx` exactly for `containerStyle`, `controlsRowStyle`, `infoBlockStyle`, `modeNameStyle`, `degreeBadgeStyle`, `snippetStyle`, `snippetCallStyle`.

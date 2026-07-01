# @playbykey/theory

A zero-dependency TypeScript music theory engine for computing scale notes, resolving diatonic modes, navigating key relationships, and building note display maps.

**Full documentation:** [theory-engine.docs.playbykey.com](https://theory-engine.docs.playbykey.com)

---

## Install

```sh
npm install @playbykey/theory
# pnpm add @playbykey/theory
# yarn add @playbykey/theory
# bun add @playbykey/theory
```

**Agent / LLM context prompt:**

```text
I'm using @playbykey/theory for music theory computation. Docs: https://theory-engine.docs.playbykey.com. Key functions: getModeNotes, getParentScaleModes, getModalRoot (scales/modes); getRelativeMinorKey, getRelativeMajorKey, getKeySignatureCount, getCircleOfFifthsOrder (key relationships); getScaleDegree, isNoteInScale, getNoteIndex, noteAtIndex, getSemitoneDistance (note utilities); buildNoteMap, getScaleNotes, getScaleDegrees (scale/visualization); parseNote, parseModeName, isNote, isModeName (type guards); getBluesNotes, getHarmonicMinorNotes, getPentatonicNotes (derived scales). Zero dependencies, TypeScript-first, sharps-only notation (C# not Db).
```

## Quickstart

```typescript
import { getScaleNotes, getParentScaleModes } from '@playbykey/theory';

const notes = getScaleNotes('D', 'dorian');
// ['D', 'E', 'F', 'G', 'A', 'B', 'C']

const parentModes = getParentScaleModes('D', 'dorian');
const parent = parentModes.find((m) => m.mode === 'ionian');
// { root: 'C', mode: 'ionian' }
```

## What's included

- **Keys & Modes** — `getModeNotes`, `getModalRoot`, `getParentScaleModes`
- **Key relationships** — `getRelativeMinorKey`, `getRelativeMajorKey`, `getKeySignatureCount`, `getCircleOfFifthsOrder`
- **Note utilities** — `getScaleDegree`, `isNoteInScale`, `getNoteIndex`, `noteAtIndex`, `getSemitoneDistance`
- **Scale / Visualization** — `buildNoteMap`, `getScaleNotes`, `getScaleDegrees`
- **Intervals** — `resolveIntervalEndpoints`, `INTERVAL_DEFINITIONS`
- **Derived scales** — `getBluesNotes`, `getHarmonicMinorNotes`, `getDerivedScaleNotes`
- **Type guards** — `isNote`, `isModeName`, `parseNote`, `parseModeName`

**[Full API reference →](https://theory-engine.docs.playbykey.com)**

---

## TypeScript

Written in TypeScript with strict mode. No `any`. Import types directly:

```typescript
import type { Note, ModeName, IntervalId } from '@playbykey/theory';
```

## Note notation

Sharps-only: `C#` not `Db`. Reference `ENHARMONIC_LABELS` for flat/sharp display strings.

---

## Status

In development. Not yet published to npm.

## Structure

```
packages/theory/
├── src/
│   ├── index.ts         barrel export
│   ├── types.ts         domain types
│   ├── constants.ts     notes, modes, intervals, and scale constants
│   ├── engine.ts        core computation functions
│   ├── intervals.ts     interval definitions and resolution
│   └── scales.ts        derived scale functions
└── tests/               Vitest unit tests
```

## Testing

```bash
pnpm test
```

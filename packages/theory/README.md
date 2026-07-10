# @playbykey/theory

[![npm version](https://img.shields.io/npm/v/@playbykey/theory)](https://www.npmjs.com/package/@playbykey/theory)

A zero-dependency TypeScript music theory engine for computing scale notes, resolving diatonic modes, navigating key relationships, and building note display maps.

Built for music apps, education tools, notation UIs, and AI agents.

- **npm:** [npmjs.com/package/@playbykey/theory](https://www.npmjs.com/package/@playbykey/theory)
- **Documentation:** [theory-engine.docs.playbykey.com](https://theory-engine.docs.playbykey.com)

---

## Why @playbykey/theory

- **Zero dependencies:** no transitive baggage
- **TypeScript-first:** strict types exported (`Note`, `ModeName`, `ScaleType`, `IntervalId`, …)
- **Agent/LLM-ready:** [interactive docs](https://theory-engine.docs.playbykey.com) with copy-paste context prompt below
- **Sharps-only notation:** predictable API; use `ENHARMONIC_LABELS` for flat/sharp display strings
- **Six scale types:** `major`, `chromatic`, `pentatonic-major`, `pentatonic-minor`, `blues`, `harmonic-minor`
- **Interval catalog clarity:** `half_step` / `whole_step` (scale motion) vs `minor_2nd` / `major_2nd` (from root)

---

## Install

```sh
npm install @playbykey/theory
pnpm add @playbykey/theory
yarn add @playbykey/theory
bun add @playbykey/theory
```

**Agent / LLM context prompt:**

```text
I'm using @playbykey/theory for music theory computation. Docs: https://theory-engine.docs.playbykey.com. Key functions: getModeNotes, getParentScaleModes, getModalRoot (modes); getRelativeMinorKey, getRelativeMajorKey, getKeySignatureCount, getCircleOfFifthsOrder (key relationships); getSemitoneDistance (note utilities); getScaleNotes, getScaleDegrees, getScaleDegree, isNoteInScale, buildNoteMap (scales); resolveIntervalEndpoints, getIntervalSemitones, INTERVAL_DEFINITIONS (intervals - half_step/whole_step are scale motion, minor_2nd/major_2nd are from root); parseNote, parseModeName, isNote, isModeName (type guards, case-insensitive); getBluesNotes, getHarmonicMinorNotes, getPentatonicNotes (derived scales). Zero dependencies, TypeScript-first, sharps-only notation (C# not Db).
```

## Quickstart

**Modes**

```typescript
import { getModeNotes, getParentScaleModes } from '@playbykey/theory';

const notes = getModeNotes('D', 'dorian');
// ['D', 'E', 'F', 'G', 'A', 'B', 'C']

const parentModes = getParentScaleModes('D', 'dorian');
const parent = parentModes.find((m) => m.mode === 'ionian');
// { root: 'C', mode: 'ionian' }
```

**Scales and UI maps**

```typescript
import { getScaleNotes, buildNoteMap } from '@playbykey/theory';

const blues = getScaleNotes('C', 'blues');
// ['C', 'D#', 'F', 'F#', 'G', 'A#']

const noteMap = buildNoteMap('C', 'major');
// [{ note: 'C', scaleDegree: 1, semitoneOffset: 0 }, { note: 'D', scaleDegree: 2, semitoneOffset: 2 }, ...]
```

## What's included

- **Keys & Modes:** `getModeNotes`, `getModalRoot`, `getParentScaleModes`
- **Key relationships:** `getRelativeMinorKey`, `getRelativeMajorKey`, `getKeySignatureCount`, `getCircleOfFifthsOrder`
- **Note utilities:** `getSemitoneDistance`
- **Scales:** `getScaleNotes`, `getScaleDegrees`, `getScaleDegree`, `isNoteInScale`, `buildNoteMap`
- **Intervals:** `resolveIntervalEndpoints`, `getIntervalSemitones`, `INTERVAL_DEFINITIONS` (14 intervals; scale motion vs from-root 2nds)
- **Derived scales:** `getBluesNotes`, `getHarmonicMinorNotes`, `getPentatonicNotes`
- **Type guards:** `isNote`, `isModeName`, `parseNote`, `parseModeName` (case-insensitive)

**[Full API reference →](https://theory-engine.docs.playbykey.com)**

---

## Design notes

Written in TypeScript with strict mode. No `any`. Import types directly:

```typescript
import type { Note, ModeName, IntervalId } from '@playbykey/theory';
```

Sharps-only: `C#` not `Db`. Reference `ENHARMONIC_LABELS` for flat/sharp display strings.

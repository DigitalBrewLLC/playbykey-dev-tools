# API Reference

Public API of `@playbykey/theory`, as exported from `src/index.ts`.

---

## Types

### Core types

| Type              | Description                                                                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Note`            | The 12 chromatic notes, sharps only: `'C' \| 'C#' \| 'D' \| 'D#' \| 'E' \| 'F' \| 'F#' \| 'G' \| 'G#' \| 'A' \| 'A#' \| 'B'`.                                     |
| `ModeName`        | The 7 diatonic modes: `'ionian' \| 'dorian' \| 'phrygian' \| 'lydian' \| 'mixolydian' \| 'aeolian' \| 'locrian'`.                                                 |
| `ScaleType`       | Scale types supported by `getScaleNotes` and `buildNoteMap`: `'major' \| 'chromatic' \| 'pentatonic-major' \| 'pentatonic-minor' \| 'blues' \| 'harmonic-minor'`. |
| `PentatonicType`  | Pentatonic variant: `'pentatonic-major' \| 'pentatonic-minor'`.                                                                                                   |
| `IntervalId`      | Identifiers for the 14 intervals in the catalog, from `'half_step'` to `'octave'`.                                                                                |
| `NotationType`    | Display notation: `'letter'` (note names) or `'number'` (scale degrees).                                                                                          |
| `AccidentalType`  | Accidental display: `'sharp' \| 'flat' \| 'both'`.                                                                                                                |
| `ModeInfo`        | Mode metadata: `{ id: ModeName; name: string; scaleDegree: number; character: string }`.                                                                          |
| `NoteDisplayInfo` | In-scale note data from `buildNoteMap`: `{ note: Note; scaleDegree: number; semitoneOffset: number }`.                                                            |

### Interval and scale types

| Type                 | Description                                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `IntervalContext`    | Input to `resolveIntervalEndpoints`: `{ root: Note; interval: IntervalId }`.                                                      |
| `IntervalSpec`       | Interval endpoint and size spec: `{ fromDegree: number; toDegree?: number; semitones: number; chromaticTo?: boolean }`.           |
| `IntervalDefinition` | A catalog entry: `{ label: string; intervalSpec: IntervalSpec }`.                                                                 |
| `ResolvedInterval`   | Output of `resolveIntervalEndpoints`: `{ from: Note; to: Note; semitones: number; label: string }`.                               |
| `ScaleDefinition`    | A scale type's definition: `{ label: string; semitoneOffsets?: readonly number[]; parentMode?: ModeName; raiseDegree?: number }`. |

---

## Constants

| Constant                   | Description                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `Notes`                    | Typed constant map for `Note` values (e.g. `Notes.C`, `Notes.FSharp`).                                              |
| `CHROMATIC_NOTES`          | `readonly Note[]` - all 12 chromatic notes in ascending order from C.                                               |
| `Modes`                    | Typed constant map for `ModeName` values (e.g. `Modes.Ionian`, `Modes.Dorian`).                                     |
| `ScaleTypes`               | Typed constant map for `ScaleType` values (e.g. `ScaleTypes.Major`, `ScaleTypes.Blues`).                            |
| `PentatonicTypes`          | Typed constant map for `PentatonicType` values: `PentatonicTypes.Major`, `PentatonicTypes.Minor`.                   |
| `Intervals`                | Typed constant map for `IntervalId` values (e.g. `Intervals.Perfect5th`, `Intervals.Major3rd`).                     |
| `Notations`                | Typed constant map for `NotationType` values: `Notations.Letter`, `Notations.Number`.                               |
| `Accidentals`              | Typed constant map for `AccidentalType` values: `Accidentals.Sharp`, `Accidentals.Flat`, `Accidentals.Both`.        |
| `MODES`                    | `readonly ModeInfo[]` - all 7 modes with name, scale degree, and character description.                             |
| `ModeInfoById`             | `Record<ModeName, ModeInfo>` - O(1) lookup of mode metadata by id.                                                  |
| `ENHARMONIC_LABELS`        | `Partial<Record<Note, string>>` - flat/sharp display labels for the 5 black-key notes (e.g. `'C#': 'Db/C#'`).       |
| `MODE_INTERVALS`           | `Record<ModeName, readonly number[]>` - step intervals (semitones) between consecutive scale degrees for each mode. |
| `MODE_SEMITONE_OFFSETS`    | `Record<ModeName, readonly number[]>` - absolute semitone offsets from root for each scale degree, per mode.        |
| `INTERVAL_DEFINITIONS`     | `Record<IntervalId, IntervalDefinition>` - the full interval catalog (label + spec) for all 14 intervals.           |
| `SCALE_DEFINITIONS`        | `Record<ScaleType, ScaleDefinition>` - definitions for each scale type (label + derivation strategy).               |
| `BLUES_SEMITONE_OFFSETS`   | `readonly number[]` - `[0, 3, 5, 6, 7, 10]`, semitone offsets for the 6-note blues scale.                           |
| `PENTATONIC_MAJOR_DEGREES` | `readonly number[]` - `[1, 2, 3, 5, 6]`, scale degrees in the major pentatonic subset.                              |
| `PENTATONIC_MINOR_DEGREES` | `readonly number[]` - `[1, 3, 4, 5, 7]`, scale degrees in the minor pentatonic subset.                              |
| `FULL_SCALE_DEGREES`       | `readonly number[]` - `[1, 2, 3, 4, 5, 6, 7]`, all 7 diatonic scale degrees.                                        |

---

## Engine functions

### Note utilities

#### `getSemitoneDistance`

- **Signature:** `getSemitoneDistance(from: Note, to: Note): number`
- **Returns:** Ascending semitone distance between two notes (0–11).

### Scale and mode functions

#### `getModeNotes`

- **Signature:** `getModeNotes(root: Note, mode: ModeName): Note[]`
- **Returns:** The 7 notes of a diatonic mode for a given root, in scale-degree order.
- **Example:** `getModeNotes('C', 'ionian')` → `['C','D','E','F','G','A','B']`

#### `getModalRoot`

- **Signature:** `getModalRoot(parentKey: Note, mode: ModeName): Note`
- **Returns:** The note at `mode`'s scale degree position within `parentKey`'s major scale.
- **Example:** `getModalRoot('C', 'dorian')` → `'D'`

#### `getParentScaleModes`

- **Signature:** `getParentScaleModes(key: Note, mode: ModeName): Array<{ root: Note; mode: ModeName }>`
- **Returns:** All 7 modal rotations of the parent major scale, in scale-degree order.

### Key relationship functions

#### `getRelativeMinorKey`

- **Signature:** `getRelativeMinorKey(majorKey: Note): Note`
- **Returns:** The relative natural minor root (9 semitones up from major root).

#### `getRelativeMajorKey`

- **Signature:** `getRelativeMajorKey(minorKey: Note): Note`
- **Returns:** The relative major root (3 semitones up from minor root).

#### `getKeySignatureCount`

- **Signature:** `getKeySignatureCount(key: Note): { sharps: number } | { flats: number }`
- **Returns:** The sharp or flat count for the key signature.

#### `getCircleOfFifthsOrder`

- **Signature:** `getCircleOfFifthsOrder(): readonly Note[]`
- **Returns:** All 12 notes in ascending-fifth order starting from C.

### Type guards and parsers

#### `isNote`

- **Signature:** `isNote(value: string): value is Note`
- **Returns:** `true` when `value` is a recognized note. Case-insensitive (`'c'`, `'f#'`).

#### `isModeName`

- **Signature:** `isModeName(value: string): value is ModeName`
- **Returns:** `true` when `value` is a recognized mode slug. Case-insensitive (`'Ionian'`).

#### `parseNote`

- **Signature:** `parseNote(value: string): Note | null`
- **Returns:** First token of `value` parsed as a canonical `Note`, or `null`. Case-insensitive input.

#### `parseModeName`

- **Signature:** `parseModeName(value: string): ModeName | null`
- **Returns:** First token of `value` parsed as a `ModeName`, or `null`. Case-insensitive input.

---

## Interval functions

The catalog contains 14 intervals. `half_step` and `whole_step` resolve **scale motion** between adjacent degrees in the major scale. `minor_2nd` and `major_2nd` are **named intervals from the root** with the same semitone distances (1 and 2). All other entries resolve from the root using diatonic degree targets, except `minor_7th` which uses a chromatic upper note.

#### `isIntervalId`

- **Signature:** `isIntervalId(value: string): value is IntervalId`

#### `getIntervalSemitones`

- **Signature:** `getIntervalSemitones(interval: IntervalId): number`
- **Returns:** The semitone count for the given interval.

#### `resolveIntervalEndpoints`

- **Signature:** `resolveIntervalEndpoints(context: IntervalContext): ResolvedInterval`
- **Parameters:** `context` - `{ root: Note; interval: IntervalId }`.
- **Returns:** `{ from, to, semitones, label }` - the two notes bounding the interval, plus the catalog label.

---

## Scale functions

#### `getScaleNotes`

- **Signature:** `getScaleNotes(root: Note, scaleType: ScaleType): Note[]`
- **Returns:** The notes of any scale type for a given root, in scale-degree order.
- **Example:** `getScaleNotes('C', 'blues')` → `['C','D#','F','F#','G','A#']`

#### `getScaleDegrees`

- **Signature:** `getScaleDegrees(scaleType: ScaleType): readonly number[]`
- **Returns:** The active scale-degree numbers for a given scale type - the numeric parallel to `getScaleNotes`.

#### `getScaleDegree`

- **Signature:** `getScaleDegree(root: Note, scaleType: ScaleType, note: Note): number | null`
- **Returns:** The 1-based position of `note` within the scale, or `null` if absent.
- **Example:** `getScaleDegree('C', 'major', 'E')` → `3`

#### `isNoteInScale`

- **Signature:** `isNoteInScale(root: Note, scaleType: ScaleType, note: Note): boolean`
- **Returns:** `true` when `note` is present in the given root + scale type.

#### `buildNoteMap`

- **Signature:** `buildNoteMap(root: Note, scaleType: ScaleType): NoteDisplayInfo[]`
- **Returns:** One `NoteDisplayInfo` per in-scale note, in scale-degree order. Each entry: `{ note, scaleDegree, semitoneOffset }`. Notation is left to the consumer - use `entry.note` for letter labels or `String(entry.scaleDegree)` for numeric.
- **Use case:** Driving keyboard, fretboard, or degree-grid visualizations.

#### `getBluesNotes`

- **Signature:** `getBluesNotes(root: Note): Note[]`
- **Returns:** The 6 notes of the blues scale on `root`.

#### `getHarmonicMinorNotes`

- **Signature:** `getHarmonicMinorNotes(root: Note): Note[]`
- **Returns:** The 7 notes of the harmonic minor scale on `root` (Aeolian with raised 7th).

#### `getPentatonicNotes`

- **Signature:** `getPentatonicNotes(root: Note, type: PentatonicType): Note[]`
- **Returns:** The 5 notes of a major or minor pentatonic scale on `root`.
- **Example:** `getPentatonicNotes('C', 'pentatonic-major')` → `['C','D','E','G','A']`

#### `getFullScaleDegrees`

- **Signature:** `getFullScaleDegrees(): readonly number[]`
- **Returns:** `[1, 2, 3, 4, 5, 6, 7]` - a convenience alias for `FULL_SCALE_DEGREES`.

#### `notesFromSemitoneOffsets`

- **Signature:** `notesFromSemitoneOffsets(root: Note, offsets: readonly number[]): Note[]`
- **Returns:** Notes built from arbitrary semitone offsets relative to `root`. Useful for defining custom scale patterns.

#### `elementAt`

- **Signature:** `elementAt<T>(array: readonly T[], index: number): T`
- **Returns:** Array element at `index`, satisfying `noUncheckedIndexedAccess` without `!`. Throws `RangeError` if out of bounds.

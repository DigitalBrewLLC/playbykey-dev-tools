# API Reference

This document covers the current public API of `@playbykey/theory`, as
exported from `src/index.ts`. It is a direct port of
`src/shared/music-theory` from the PlayByKey website, organized by source
module.

For unresolved design questions about functions that may be added or
changed before v1, see [open-questions.md](./open-questions.md).

---

## Types

### Core types

| Type              | Description                                                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Note`            | The 12 chromatic notes, sharps only (no flats/enharmonics): `'C' \| 'C#' \| 'D' \| 'D#' \| 'E' \| 'F' \| 'F#' \| 'G' \| 'G#' \| 'A' \| 'A#' \| 'B'`. |
| `ModeName`        | The 7 modes of the major scale, ordered by brightness: `'ionian' \| 'dorian' \| 'phrygian' \| 'lydian' \| 'mixolydian' \| 'aeolian' \| 'locrian'`.   |
| `IntervalId`      | Identifiers for the 13 intervals in the interval catalog, from `'half_step'` to `'octave'`.                                                          |
| `ScaleKind`       | Scale kinds used in theory diagrams and scale strips: `'mode' \| 'chromatic' \| 'pentatonic' \| 'blues' \| 'harmonic-minor'`.                        |
| `NotationType`    | Scale degree notation: `'number'` (1-7) or `'letter'` (note names).                                                                                  |
| `AccidentalType`  | Accidental display preference: `'sharp' \| 'flat' \| 'both'`.                                                                                        |
| `ModeInfo`        | Display metadata for a mode: `{ id: ModeName; name: string; scaleDegree: number; character: string }`.                                               |
| `NoteDisplayInfo` | Computed display data for a single chromatic note: `{ note: Note; inScale: boolean; scaleDegree: number \| null; label: string; isRoot: boolean }`.  |

### Interval and scale types

| Type                 | Description                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IntervalContext`    | Input to `resolveIntervalEndpoints`: `{ root: Note; mode: ModeName; interval: IntervalId }`.                                                                  |
| `IntervalSpec`       | How an interval's endpoints and size are computed: `{ fromDegree: number; toDegree?: number; semitones: number; chromaticTo?: boolean }`.                     |
| `IntervalDefinition` | A catalog entry: `{ label: string; intervalSpec: IntervalSpec }`.                                                                                             |
| `ResolvedInterval`   | Output of `resolveIntervalEndpoints`: `{ from: Note; to: Note; semitones: number; label: string }`.                                                           |
| `ScaleDefinition`    | A scale kind's definition: `{ label: string; semitoneOffsets?: readonly number[]; parentMode?: ModeName; raiseDegree?: number; pentatonicSubset?: boolean }`. |

---

## Constants

| Constant                 | Description                                                                                                                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NOTES`                  | `readonly Note[]` - all 12 chromatic notes in ascending order from C.                                                                                                                          |
| `MODES`                  | `readonly ModeInfo[]` - the 7 modes with display name, scale degree, and a one-line character description (e.g. Ionian: "Bright and resolved - the familiar major sound").                     |
| `MODE_NAMES`             | `readonly ModeName[]` - all mode name values, derived from `MODE_IDS`.                                                                                                                         |
| `MODE_IDS`               | Named constant map for `ModeName` values (`IONIAN`, `DORIAN`, `PHRYGIAN`, `LYDIAN`, `MIXOLYDIAN`, `AEOLIAN`, `LOCRIAN`).                                                                       |
| `NOTATION_IDS`           | Named constant map for `NotationType` values (`LETTER`, `NUMBER`).                                                                                                                             |
| `ACCIDENTAL_IDS`         | Named constant map for `AccidentalType` values (`SHARP`, `FLAT`, `BOTH`).                                                                                                                      |
| `INTERVAL_IDS`           | Named constant map for `IntervalId` values (`HALF_STEP` through `OCTAVE`).                                                                                                                     |
| `INTERVAL_ID_VALUES`     | `readonly IntervalId[]` - all 13 interval ids, derived from `INTERVAL_IDS`.                                                                                                                    |
| `SCALE_KIND_IDS`         | Named constant map for `ScaleKind` values (`MODE`, `CHROMATIC`, `PENTATONIC`, `BLUES`, `HARMONIC_MINOR`).                                                                                      |
| `SCALE_KIND_VALUES`      | `readonly ScaleKind[]` - all scale kinds, derived from `SCALE_KIND_IDS`.                                                                                                                       |
| `ENHARMONIC_LABELS`      | `Partial<Record<Note, string>>` - display labels for the 5 black-key notes, e.g. `'C#': 'Db/C#'`. See [open-questions.md #2](./open-questions.md#2-getenharmonicequivalent-and-the-note-type). |
| `INTERVAL_DEFINITIONS`   | `Record<IntervalId, IntervalDefinition>` - the interval catalog: label and `IntervalSpec` for each of the 13 intervals.                                                                        |
| `SCALE_DEFINITIONS`      | `Record<ScaleKind, ScaleDefinition>` - definitions for each scale kind (mode, chromatic, pentatonic, blues, harmonic minor).                                                                   |
| `BLUES_SEMITONE_OFFSETS` | `readonly number[]` - `[0, 3, 5, 6, 7, 10]`, the semitone offsets for the 6-note blues scale.                                                                                                  |
| `PENTATONIC_DEGREES`     | `readonly number[]` - `[1, 2, 3, 5, 6]`, the scale degrees in major/minor pentatonic subsets.                                                                                                  |
| `FULL_SCALE_DEGREES`     | `readonly number[]` - `[1, 2, 3, 4, 5, 6, 7]`, all 7 diatonic scale degrees.                                                                                                                   |
| `MODE_INTERVALS`         | `Record<ModeName, readonly number[]>` - the interval step pattern (in semitones) between consecutive scale degrees, for each mode.                                                             |
| `MODE_SEMITONE_OFFSETS`  | `Record<ModeName, readonly number[]>` - the absolute semitone offset from the root for each scale degree, for each mode.                                                                       |

---

## Functions

### Core engine (`src/engine.ts`)

#### `getNoteIndex`

- **Signature:** `getNoteIndex(note: Note): number`
- **Parameters:** `note` - a chromatic note.
- **Returns:** The note's chromatic index, 0-11 (C = 0, C# = 1, ... B = 11).
- **Description:** Looks up `note`'s position in `NOTES`.
- **Use case:** Converting a note to a numeric position for semitone
  arithmetic, e.g. transposition or interval calculations.

#### `noteAtIndex`

- **Signature:** `noteAtIndex(index: number): Note`
- **Parameters:** `index` - a chromatic index; may be negative or >= 12.
- **Returns:** The note at `index`, wrapping modulo 12.
- **Description:** The inverse of `getNoteIndex`, with wraparound for
  out-of-range indices.
- **Use case:** Computing the note that results from transposing by N
  semitones, e.g. `noteAtIndex(getNoteIndex('C') + 7) => 'G'`.

#### `getSemitoneDistance`

- **Signature:** `getSemitoneDistance(from: Note, to: Note): number`
- **Parameters:** `from`, `to` - chromatic notes.
- **Returns:** The ascending semitone distance from `from` to `to`, 0-11.
- **Description:** `((getNoteIndex(to) - getNoteIndex(from)) % 12 + 12) % 12`.
- **Use case:** Determining how many semitones up you'd need to move from
  one note to reach another, e.g. for interval identification.

#### `getScaleNotes`

- **Signature:** `getScaleNotes(root: Note, mode: ModeName): Note[]`
- **Parameters:** `root` - the scale's root note; `mode` - the mode to
  apply.
- **Returns:** The 7 notes of the scale, starting from `root`.
- **Description:** Maps `MODE_SEMITONE_OFFSETS[mode]` onto `root`.
- **Example:** `getScaleNotes('C', 'ionian') => ['C','D','E','F','G','A','B']`;
  `getScaleNotes('D', 'dorian') => ['D','E','F','G','A','B','C']`.
- **Use case:** Building the note set for any key/mode combination - the
  foundation for scale visualizations and scale-degree lookups.

#### `getScaleDegree`

- **Signature:** `getScaleDegree(root: Note, mode: ModeName, note: Note): number | null`
- **Parameters:** `root`, `mode` - the key/mode context; `note` - the note
  to look up.
- **Returns:** The 1-7 scale degree of `note` within the `root`/`mode`
  scale, or `null` if `note` is not in that scale.
- **Example:** `getScaleDegree('C', 'ionian', 'E') => 3`;
  `getScaleDegree('C', 'ionian', 'F#') => null`.
- **Use case:** Labeling a note with its functional scale-degree number
  for a given key/mode (number notation).

#### `isNoteInScale`

- **Signature:** `isNoteInScale(root: Note, mode: ModeName, note: Note): boolean`
- **Parameters:** `root`, `mode`, `note`.
- **Returns:** `true` if `note` belongs to the `root`/`mode` scale.
- **Description:** Equivalent to `getScaleDegree(root, mode, note) !== null`.
- **Use case:** Highlighting in-scale vs. out-of-scale notes on a keyboard
  or fretboard.

#### `getNoteLabel`

- **Signature:** `getNoteLabel(note: Note, root: Note, mode: ModeName, notation: NotationType): string`
- **Parameters:** `note` - the note to label; `root`, `mode` - the active
  key/mode context; `notation` - `'letter'` or `'number'`.
- **Returns:** For `'letter'`, `note`'s own name (e.g. `'C#'`). For
  `'number'`, `note`'s scale degree as a string (`'1'`-`'7'`), or `''` if
  `note` is out of scale.
- **Use case:** Rendering note labels on visualizations that toggle
  between letter-name and scale-degree-number display.

#### `buildNoteMap`

- **Signature:** `buildNoteMap(root: Note, scaleType: ScaleType, notation: NotationType): NoteDisplayInfo[]`
- **Parameters:** `root`, `scaleType`, `notation`.
- **Returns:** An array of 12 `NoteDisplayInfo` objects (one per chromatic
  note, in `NOTES` order), each with `note`, `inScale`, `scaleDegree`,
  `label`, and `isRoot`.
- **Description:** The primary data structure consumed by visualization
  views — produces display-ready note info for every chromatic pitch for
  any scale type and notation mode.
- **Use case:** Driving a keyboard or fretboard visualization where every
  note needs to know whether it's in the active scale, what its label is,
  and whether it's the root.

#### `getParentScaleModes`

- **Signature:** `getParentScaleModes(key: Note, mode: ModeName): Array<{ root: Note; mode: ModeName }>`
- **Parameters:** `key` - any root note; `mode` - the mode `key` is being
  interpreted in.
- **Returns:** All 7 `{ root, mode }` rotation pairs of the parent Ionian
  (major) key, in scale-degree order (Ionian, Dorian, Phrygian, Lydian,
  Mixolydian, Aeolian, Locrian).
- **Example:** `getParentScaleModes('D', 'dorian')` finds the parent key C
  major and returns
  `[{root:'C',mode:'ionian'}, {root:'D',mode:'dorian'}, {root:'E',mode:'phrygian'}, ...]`.
- **Use case:** Letting a user pivot from one mode to any other mode that
  shares the same key signature (the "Major Scale System" framework).

#### `getModalRoot`

- **Signature:** `getModalRoot(parentKey: Note, mode: ModeName): Note`
- **Parameters:** `parentKey` - the Ionian (major) key; `mode` - the
  target mode.
- **Returns:** The note within `parentKey`'s major scale that serves as
  the root of `mode`.
- **Example:** `getModalRoot('C', 'dorian') => 'D'`;
  `getModalRoot('C', 'phrygian') => 'E'`;
  `getModalRoot('C', 'ionian') => 'C'`.
- **Use case:** Given a major key signature and a chosen mode, finding
  which note to treat as "home" for that mode.

#### `getRelativeMinorKey`

- **Signature:** `getRelativeMinorKey(majorKey: Note): Note`
- **Parameters:** `majorKey`.
- **Returns:** The relative minor root - 9 semitones up (equivalently, 3
  semitones down) from `majorKey`.
- **Example:** `getRelativeMinorKey('C') => 'A'`.
- **Use case:** The "Relative Key System" framework - given a major key,
  finding its relative minor.

#### `getRelativeMajorKey`

- **Signature:** `getRelativeMajorKey(minorKey: Note): Note`
- **Parameters:** `minorKey`.
- **Returns:** The relative major root - 3 semitones up from `minorKey`.
- **Example:** `getRelativeMajorKey('A') => 'C'`.
- **Use case:** The inverse of `getRelativeMinorKey` - given a minor key,
  finding its relative major.

#### `getCircleOfFifthsOrder`

- **Signature:** `getCircleOfFifthsOrder(): readonly Note[]`
- **Parameters:** none.
- **Returns:** All 12 chromatic notes in ascending-fifths order, starting
  from C: `['C','G','D','A','E','B','F#','C#','G#','D#','A#','F']`.
- **Use case:** Laying out keys around a circle-of-fifths visualization.

#### `getKeySignatureCount`

- **Signature:** `getKeySignatureCount(key: Note): { sharps: number } | { flats: number }`
- **Parameters:** `key`.
- **Returns:** The number of sharps or flats in `key`'s major key
  signature.
- **Example:** `getKeySignatureCount('G') => { sharps: 1 }`;
  `getKeySignatureCount('F') => { flats: 1 }`.
- **Description:** Backed by a fixed lookup table covering all 12 `Note`
  values.
- **Use case:** Labeling keys on a circle-of-fifths visualization with
  their accidental count.

#### `isNote`

- **Signature:** `isNote(value: string): value is Note`
- **Parameters:** `value` - an arbitrary string.
- **Returns:** `true` if `value` is one of the 12 `Note` values; narrows
  the type to `Note`.
- **Use case:** Validating untrusted string input (URL params, user input)
  before treating it as a `Note`.

#### `isModeName`

- **Signature:** `isModeName(value: string): value is ModeName`
- **Parameters:** `value`.
- **Returns:** `true` if `value` is one of the 7 `ModeName` values;
  narrows the type to `ModeName`.
- **Use case:** Validating untrusted string input before treating it as a
  `ModeName`.

#### `parseNote`

- **Signature:** `parseNote(value: string): Note | null`
- **Parameters:** `value` - a display string, e.g. `"C ionian"` or
  `"F#, dorian"`.
- **Returns:** The `Note` parsed from the first token of `value` (up to
  the first space or comma), or `null` if that token is not a valid
  `Note`.
- **Use case:** Extracting a root note from a combined "key + mode"
  display string or URL slug.

#### `parseModeName`

- **Signature:** `parseModeName(value: string): ModeName | null`
- **Parameters:** `value` - a display string or slug.
- **Returns:** The `ModeName` parsed from the first token of `value`
  (lowercased), or `null` if that token is not a valid `ModeName`.
- **Use case:** Extracting a mode from a combined "key + mode" display
  string or URL slug.

---

### Intervals (`src/intervals.ts`)

#### `isIntervalId`

- **Signature:** `isIntervalId(value: string): value is IntervalId`
- **Parameters:** `value`.
- **Returns:** `true` if `value` is one of the 13 `IntervalId`
  values; narrows the type.
- **Use case:** Validating untrusted string input before treating it as a
  `IntervalId`.

#### `resolveIntervalEndpoints`

- **Signature:** `resolveIntervalEndpoints(context: IntervalContext): ResolvedInterval`
- **Parameters:** `context: { root: Note; mode: ModeName; interval: IntervalId }`.
- **Returns:** `{ from: Note; to: Note; semitones: number; label: string }`
  - the two notes bounding `interval` within `root`/`mode`, the interval's
    semitone size, and its display label.
- **Description:** Looks up `interval` in `INTERVAL_DEFINITIONS`, then
  resolves `from`/`to` either by scale degree (`fromDegree`/`toDegree`) or,
  for `chromaticTo: true` intervals, by semitone offset from `root`.
- **Use case:** Driving interval diagrams - given a key, mode, and
  interval choice, finding the two notes to highlight and the label to
  display.

---

### Scales (`src/scales.ts`)

#### `notesFromSemitoneOffsets`

- **Signature:** `notesFromSemitoneOffsets(root: Note, offsets: readonly number[]): Note[]`
- **Parameters:** `root`; `offsets` - semitone offsets from `root`.
- **Returns:** The notes at each offset from `root`, wrapping at the
  octave.
- **Use case:** Building a scale's note set directly from a fixed
  semitone pattern (e.g. blues, chromatic).

#### `getHarmonicMinorNotes`

- **Signature:** `getHarmonicMinorNotes(root: Note): Note[]`
- **Parameters:** `root`.
- **Returns:** The 7 notes of the harmonic minor scale on `root` - the
  Aeolian (natural minor) scale with its 7th degree raised by a semitone.
- **Use case:** Rendering the `'harmonic-minor'` scale kind in theory
  diagrams.

#### `getBluesNotes`

- **Signature:** `getBluesNotes(root: Note): Note[]`
- **Parameters:** `root`.
- **Returns:** The 6 notes of the blues scale on `root`, using
  `BLUES_SEMITONE_OFFSETS`.
- **Use case:** Rendering the `'blues'` scale kind in theory diagrams.

#### `getPentatonicDegrees`

- **Signature:** `getPentatonicDegrees(): readonly number[]`
- **Parameters:** none.
- **Returns:** `PENTATONIC_DEGREES`, i.e. `[1, 2, 3, 5, 6]`.
- **Use case:** Identifying which scale degrees belong to the
  major/minor pentatonic subset of a mode.

#### `getFullScaleDegrees`

- **Signature:** `getFullScaleDegrees(): readonly number[]`
- **Parameters:** none.
- **Returns:** `FULL_SCALE_DEGREES`, i.e. `[1, 2, 3, 4, 5, 6, 7]`.
- **Use case:** A default "all degrees" reference for scale kinds that
  use the full diatonic set.

#### `getScaleEmphasisDegrees`

- **Signature:** `getScaleEmphasisDegrees(scaleKind: ScaleKind): readonly number[]`
- **Parameters:** `scaleKind`.
- **Returns:** The scale-degree positions to visually emphasize for
  `scaleKind`: `PENTATONIC_DEGREES` for `'pentatonic'`, `[1..6]` for
  `'blues'`, `[1..12]` for `'chromatic'`, and `FULL_SCALE_DEGREES` for
  everything else (`'mode'`, `'harmonic-minor'`).
- **Use case:** Telling a scale-strip or keyboard view which positions to
  highlight for a given scale kind.

#### `getDerivedScaleNotes`

- **Signature:** `getDerivedScaleNotes(root: Note, mode: ModeName, scaleKind: ScaleKind): Note[]`
- **Parameters:** `root`, `mode`, `scaleKind`.
- **Returns:** The notes for `scaleKind` built from `root` (and `mode`,
  where relevant):
  - semitone-offset scales (`'chromatic'`, `'blues'`) via
    `notesFromSemitoneOffsets`
  - `'harmonic-minor'` via `getHarmonicMinorNotes`
  - `'pentatonic'` filters `getScaleNotes(root, mode)` down to
    `PENTATONIC_DEGREES`
  - `'mode'` returns `getScaleNotes(root, mode)` unchanged
- **Use case:** The single entry point for "the notes of this scale kind",
  used by scale visualizations that support multiple scale kinds.

#### `getScaleContextNotes`

- **Signature:** `getScaleContextNotes(root: Note, mode: ModeName, scaleKind: ScaleKind): Note[]`
- **Parameters:** `root`, `mode`, `scaleKind`.
- **Returns:** The wider note set used as harmonic context around
  `scaleKind`:
  - all 12 notes for `'chromatic'`
  - the Aeolian scale on `root` for `'blues'`
  - harmonic minor notes for `'harmonic-minor'`
  - `getScaleNotes(root, mode)` otherwise
- **Use case:** Determining which notes to render as backdrop around the
  emphasized notes from `getDerivedScaleNotes`, for any visualization -
  keyboard, fretboard, or otherwise.

# Open Questions

This document captures unresolved API design decisions for `@playbykey/theory`
that came out of the Engine Review pre-work. Each item below should be
discussed and resolved as part of this pull request before the package's
public API is considered stable for v1.

---

## 1. Chord functions

**Question:** Should `@playbykey/theory` v1 include chord-construction
functions (e.g. `getChordNotes(root, chordType)`)?

**Context:**

- The current API covers notes, scales, modes, and intervals
  (`engine.ts`, `scales.ts`, `intervals.ts`), but has no chord-related
  functions.
- The website repo has chord _content_ at `src/data/theory/chords.ts` -
  an array of `SubtopicEntry` objects (title, explanation paragraphs,
  example, cross-reference) used to render the Theory pages. This is
  descriptive text for display, not computable engine logic, and it was
  not copied into this package.
- There is currently no existing implementation anywhere in the codebase
  that derives the notes of a chord (triad, seventh, etc.) from a root and
  chord quality.

**Options:**

1. **Include in v1** - add a small `chords.ts` module with a `ChordType`
   union and a function such as `getChordNotes(root, chordType)` (and
   possibly `getDiatonicChords(root, mode)` for scale-degree chord
   qualities). This would meaningfully increase the package's usefulness
   for downstream tools (MCP server, CLI), but it is new functionality
   that needs its own design, implementation, and tests - not a port of
   existing code.
2. **Defer to a later release** - ship v1 as a direct port of the
   existing, tested scale/mode/interval engine, and revisit chords once a
   concrete consumer needs them.
3. **Out of scope** - treat chords as content only (as `chords.ts` does
   today) and let consumers derive chord tones themselves from
   `getScaleNotes` / scale degrees.

No code in this PR depends on the outcome; this is a roadmap/scoping
decision.

---

## 2. `getEnharmonicEquivalent` and the `Note` type

**Question:** Can `getEnharmonicEquivalent` exist with the current `Note`
type, and if so, what should it return?

**Context:**

- `Note` (`src/types.ts`) is sharps-only:
  `'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'`.
  There are no flat spellings (`Db`, `Eb`, etc.) anywhere in the type
  system.
- `ENHARMONIC_LABELS` (`src/constants.ts`) already maps the 5 black-key
  notes to a combined display string, e.g. `'C#': 'Db/C#'`. This returns a
  `string` for display purposes, not a `Note`.
- A `getEnharmonicEquivalent(note)` function was proposed during the
  Engine Review. Read literally - "the enharmonic spelling of this note" -
  it implies a flat-spelled result (`C#` -> `Db`), which the `Note` type
  cannot represent.

**Options:**

1. **Return a display string** - `getEnharmonicEquivalent(note: Note): string`,
   built on (or returning a half of) `ENHARMONIC_LABELS`. Needs a defined
   behavior for the 7 white-key notes, which have no enharmonic entry
   (return `null`? return the note itself?).
2. **Extend `Note` to include flats** - add flat spellings to the `Note`
   union so `getEnharmonicEquivalent(note: Note): Note` can return a true
   `Note`. This is a large, cross-cutting change: `NOTES`, `getNoteIndex`,
   `noteAtIndex`, and every function built on the 12-element chromatic
   array assume the current sharps-only set.
3. **Defer** - drop `getEnharmonicEquivalent` from v1 until the
   `Note`/spelling model is revisited as its own task.

---

## 3. `getIntervalSemitones` signature

**Question:** Should `getIntervalSemitones` take just an interval id, or a
full `(root, mode, interval)` context like `resolveIntervalEndpoints`?

**Context:**

- `INTERVAL_DEFINITIONS` (`src/intervals.ts`) already stores a fixed
  `semitones` value per `IntervalId`, independent of root or mode
  (e.g. `major_3rd` -> 4, `minor_7th` -> 10).
- `resolveIntervalEndpoints(context: IntervalContext)` takes
  `{ root, mode, interval }` and returns `{ from, to, semitones, label }`.
  It needs `root`/`mode` to resolve the `from`/`to` notes, but the
  `semitones` it returns is read straight from `INTERVAL_DEFINITIONS` -
  root and mode don't affect it.
- A `getIntervalSemitones` function was proposed during the Engine Review
  (status: "Check").

**Options:**

1. **`getIntervalSemitones(interval: IntervalId): number`** - a
   direct lookup (`INTERVAL_DEFINITIONS[interval].intervalSpec.semitones`).
   Simple, and accurately reflects that the semitone count does not depend
   on root or mode.
2. **`getIntervalSemitones(context: IntervalContext): number`** -
   mirrors `resolveIntervalEndpoints`'s signature for consistency, even
   though `root`/`mode` would be unused.

**Why this matters beyond this one function:** the same question applies
to a related proposed function, `getNoteAtInterval(root, interval)`. Most
intervals are `toDegree`-based and need `mode` (in addition to `root`) to
resolve the target note via scale degrees - only the one
`chromaticTo: true` interval (`minor_7th`) is mode-independent. So:

- If `getIntervalSemitones` takes a bare `interval`, it and
  `getNoteAtInterval(root, mode, interval)` end up with different shaped
  signatures.
- If `getIntervalSemitones` takes an `IntervalContext`, both
  functions share a consistent context-based signature, at the cost of an
  unused `mode` field for `getIntervalSemitones`.

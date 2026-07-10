# Open Questions

All three questions from the Engine Review pre-work are resolved. Decisions recorded below.

---

## 1. Chord functions — DEFERRED

**Decision:** Defer to v1.1.

No implementation exists in the codebase. v1 is a direct port of the proven, tested engine. Adding net-new chord logic before any downstream consumer exists risks getting the API shape wrong and delays the publish. When Tonic or the website needs `getChordNotes`, that concrete use case will inform the right design.

---

## 2. `getEnharmonicEquivalent` and the `Note` type — DEFERRED

**Decision:** Do not add this function. Document the constraint instead.

The sharps-only `Note` type is a deliberate design choice that flows through every function in the engine. Extending it to include flat spellings is a cross-cutting breaking change. A JSDoc comment on `Note` in `src/types.ts` now explains the constraint and points to `ENHARMONIC_LABELS` for display purposes.

---

## 3. `getIntervalSemitones` signature — RESOLVED

**Decision:** `getIntervalSemitones(interval: IntervalId): number`

The semitone count is a fixed property of the interval, not of root or mode. A context-based signature would actively mislead callers. Added to `src/intervals.ts` as a direct lookup into `INTERVAL_DEFINITIONS` and exported from `src/index.ts`.

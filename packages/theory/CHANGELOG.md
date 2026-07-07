# Changelog

All notable changes to `@playbykey/theory` will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

> Changes accumulated since extraction from the PlayByKey website codebase.
> Will be tagged as `v0.1.0` on first npm publish.

### Added

- `ScaleTypes` constant map (`Major`, `Chromatic`, `PentatonicMajor`, `PentatonicMinor`, `Blues`, `HarmonicMinor`)
- `PentatonicTypes` constant map (`Major`, `Minor`)
- `getScaleNotes(root, scaleType)` — general-purpose entry point for any scale type
- `getScaleDegrees(scaleType)` — numeric parallel to `getScaleNotes`, returns active degree numbers
- `getPentatonicNotes(root, type)` — major and minor pentatonic variants with explicit `PentatonicType` param
- `PENTATONIC_MAJOR_DEGREES` and `PENTATONIC_MINOR_DEGREES` constants
- `getModeNotes(root, mode)` — renamed from the original `getScaleNotes` to clarify it is diatonic-mode-only
- `buildNoteMap(root, scaleType)` — returns `NoteDisplayInfo[]` for all in-scale notes; includes `semitoneOffset` per entry

### Changed

- `buildNoteMap` parameter changed from `ModeName` → `ScaleType`; notation param removed (presentation left to consumer)
- `NoteDisplayInfo` simplified to `{ note, scaleDegree, semitoneOffset }` — removed `inScale`, `label`, `isRoot`
- `IntervalContext` — removed `mode: ModeName` field (mode was not needed for interval resolution)
- `ScaleType` renamed the `'mode'` variant to `'major'` for clarity
- `buildNoteMap` moved from `engine.ts` to `scales.ts` to avoid circular dependency

### Removed

- `getModeAlterations` (had a correctness bug; concept dropped)
- Old `getScaleNotes(root, mode)` — replaced by `getModeNotes` (diatonic) and the new `getScaleNotes(root, scaleType)` (all types)
- `getDerivedScaleNotes`, `getScaleContextNotes` — consolidated into `getScaleNotes`
- `getPentatonicDegrees` — replaced by explicit `PENTATONIC_MAJOR_DEGREES` / `PENTATONIC_MINOR_DEGREES` constants
- `getScaleEmphasisDegrees` — renamed to `getScaleDegrees`
- `ScaleType: 'pentatonic'` — replaced by `'pentatonic-major'` and `'pentatonic-minor'`

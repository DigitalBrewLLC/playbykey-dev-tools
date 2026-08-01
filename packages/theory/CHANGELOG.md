# Changelog

All notable changes to `@playbykey/theory` will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.1](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-v2.0.0...theory-v2.0.1) (2026-08-01)


### Bug Fixes

* adopt ChordTypes/ProgressionIds typed constants in chords and progressions tests ([4f57478](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/4f5747810592fff736d5c6197726d7d22bef27cb))

## [2.0.0](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-v1.5.0...theory-v2.0.0) (2026-08-01)


### ⚠ BREAKING CHANGES

* **theory,theory-mcp:** detectChord no longer exists; detect_chord MCP tool no longer exists. Both are pre-release (this PR hasn't merged yet), so there are no external consumers to migrate.

### Features

* **theory,theory-mcp:** rename detectChord to detectChords, return all matching roots ([6512d9a](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/6512d9a2b0a474f0877d1dbc41fcf988e115de69))
* **theory:** add 11 new chord types to CHORD_DEFINITIONS ([c3d124f](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/c3d124f0262125987008b73db2d54672c0522055))
* **theory:** add 2 new catalog progressions ([e365207](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/e365207503cbc879ff0071b226d1c92e6b439e78))
* **theory:** add detectChord for notes-to-chord reverse lookup ([77538ab](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/77538abe8b7e52a04563c7e58b4d8ec0235f89bf))
* **theory:** widen ChordInversion to support up to 7-note chords ([b51a57f](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/b51a57f4e54bd5033ce2e317a786c71c89e25538))


### Bug Fixes

* clarify detectChords description and show explicit input in playground demo ([f573603](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/f5736030b4ca56754c23a0ad044e502a064885ff))
* **theory-mcp,theory:** correct detectChord's ambiguity claim, accept flats in detect_chord ([4d74483](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/4d744839e390c93adbd3faf94260e4c66254c2f4))
* **theory,theory-mcp,theory-docs:** fix doc staleness found in code review ([88a1097](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/88a10973a32fcced0f51afeb160613d5928d0ff3))
* **theory:** clarify the mod-12 dedup comment in detectChords ([8a748cb](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/8a748cb0868cc058dd52a06809cc87de8ddfb6b6))
* **theory:** remove invalid out-of-type-range assertion in the 13th-chord inversion test ([cae72b8](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/cae72b81384ede079c5572a76a99fa9cef5c63cb))
* **theory:** remove low-value comment on detectChords' mod-12 matching ([12c66b3](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/12c66b3d11f98b755a2e0a4b5e1f5b42e409b1af))

## [1.5.0](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-v1.4.0...theory-v1.5.0) (2026-07-23)


### Features

* **theory:** add transpose, MIDI/frequency conversion, and expanded scales ([244fbb2](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/244fbb2283bc1f09a48d9915c478cc1a9c08ea44))


### Bug Fixes

* **theory:** remove duplicate scale-derivation sources of truth ([d228c90](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/d228c90e3f3b8624c03343762602926a0f6787dc))

## [1.4.0](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-v1.3.0...theory-v1.4.0) (2026-07-21)


### Features

* **theory:** add chords and progressions modules ([bde446c](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/bde446cf749171df95a3ca56ecf46b6bae018782))


### Bug Fixes

* **theory:** use elementAt for degree bounds checks, expand test coverage ([e4aeee2](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/e4aeee2be4690f906e888c6e0f2862241ed725c1))

## [1.3.0](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-v1.2.0...theory-v1.3.0) (2026-07-15)


### Features

* **theory:** add key-signature quality, flat-name input, and note-spelling functions ([0330e81](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/0330e81775a28ab349a7e08cbfd9bdd94b856dac))


### Bug Fixes

* **theory:** remove flats keyword, keep enharmonic ([19a5b63](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/19a5b634446f7d22dfe919ffc7bc94f86beccb8a))

## [1.2.0](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-v1.1.0...theory-v1.2.0) (2026-07-11)


### Features

* cross-link playbykey.com from theory-docs and npm README ([#63](https://github.com/DigitalBrewLLC/playbykey-dev-tools/issues/63)) ([614e78e](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/614e78e5a86cab382786421f5f2b1d024d57dd9f))

## [1.1.0](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-v1.0.1...theory-v1.1.0) (2026-07-10)


### Features

* add @playbykey/theory-mcp MCP server ([5407632](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/5407632ba83454bdeb97b8caae443ca3790ec102))
* add @playbykey/theory-mcp MCP server ([5407632](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/5407632ba83454bdeb97b8caae443ca3790ec102))


### Bug Fixes

* **theory:** remove em dashes from interval label strings ([195f28c](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/195f28cc2db1e90a9971eb9e496d8fb507820b7a))

## 1.0.1 (2026-07-09)

### Bug Fixes

- **theory:** improve README for npm and monorepo landing ([2adcff3](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/2adcff32185e9588480a11559400fa5fb5b0ff35))
- **theory:** update README for npm and include in published files ([7704082](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/77040827005312fab88d5f8b3d8bb97f043df93c))

## 1.0.0 (2026-07-09)

### Features

- **task-01-theory-build-step:** add tsup build step to @playbykey/theory ([#6](https://github.com/DigitalBrewLLC/playbykey-dev-tools/issues/6)) ([2e1957a](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/2e1957af5d564ecd2be7f46c5d4fc308fefb8340))
- **theory-docs:** content SEO tighten ([8b0e6ce](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/8b0e6ce8cb74c1ba5bed0eb5a48e126640d73790))
- **theory-docs:** SEO polish — OG tags, H2 keywords, internal links, npm metadata ([3a6ad04](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/3a6ad04f8a97ad8f5fb4a9fa6c09173a55056984))
- **theory:** add PentatonicTypes constants and update getPentatonicDegrees function to use them ([3074da5](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/3074da5566ed64e0285bf5b737f6ca990e1ed62c))
- **theory:** pentatonic-major/minor — explicit ScaleTypes, PentatonicType, and note-returning getPentatonicDegrees ([2d1a3f1](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/2d1a3f18966300bf846ebb7b75f5142d0e9db45f))
- **theory:** remove mode from interval/scale APIs; rename ScaleType 'mode' to 'major' ([2104ab2](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/2104ab26b1b80a686a7e650ed1686bfb867932d0))
- **theory:** rename ScaleType 'mode' to 'major'; remove mode param from interval and scale derived functions ([4c76164](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/4c7616408146221f3e3e79e0ee30927d7e3d82e6))
- **theory:** split pentatonic into major/minor — new ScaleType, PentatonicType, updated degree constants and function signatures ([438081c](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/438081c6b4c615d4f5d66f63acb0f04dc1a79900))
- **theory:** tighten public API surface, resolve open questions, add getIntervalSemitones ([1cef124](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/1cef12453cad8c2ac9c911e281f92fe57ec43b33))

### Bug Fixes

- **theory:** export PentatonicTypes; update all docs components for getModeNotes/getScaleNotes rename ([4e36851](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/4e368512764aba45e992f81951fe5500831561b4))
- **theory:** remove UTF-8 BOM from package.json ([#38](https://github.com/DigitalBrewLLC/playbykey-dev-tools/issues/38)) ([4e32da0](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/4e32da08a60cc14d9e12e2a6e459b7d14f03feab))

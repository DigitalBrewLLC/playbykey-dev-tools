# Changelog

## [2.0.0](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-mcp-v1.6.1...theory-mcp-v2.0.0) (2026-08-01)


### ⚠ BREAKING CHANGES

* **theory,theory-mcp:** detectChord no longer exists; detect_chord MCP tool no longer exists. Both are pre-release (this PR hasn't merged yet), so there are no external consumers to migrate.

### Features

* **theory-mcp:** add detect_chord tool ([2b80597](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/2b805973172d706a8720c7667525a85f7a67ed88))
* **theory-mcp:** widen chord inversion validation to match the engine's 0-6 range ([04116b8](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/04116b83649457b6da2835bfa16113f6b0affd7b))
* **theory,theory-mcp:** rename detectChord to detectChords, return all matching roots ([6512d9a](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/6512d9a2b0a474f0877d1dbc41fcf988e115de69))


### Bug Fixes

* clarify detectChords description and show explicit input in playground demo ([f573603](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/f5736030b4ca56754c23a0ad044e502a064885ff))
* **theory-mcp,theory:** correct detectChord's ambiguity claim, accept flats in detect_chord ([4d74483](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/4d744839e390c93adbd3faf94260e4c66254c2f4))
* **theory-mcp:** correct stale 0-4 range in validateInversion's error message ([bf00947](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/bf0094706a2420ccb365f9a9c795efc53571f08a))
* **theory-mcp:** rewrite server.json title/description as real sentences ([b6e8fdc](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/b6e8fdc7c639f00b17793a39bfa12769927d876d))
* **theory-mcp:** trim detect_chords tool description to 2 sentences ([54f38da](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/54f38da7758efb0488f2c4e9cc0ea292f6b698ee))
* **theory,theory-mcp,theory-docs:** fix doc staleness found in code review ([88a1097](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/88a10973a32fcced0f51afeb160613d5928d0ff3))

## [1.6.1](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-mcp-v1.6.0...theory-mcp-v1.6.1) (2026-07-28)


### Bug Fixes

* **theory-docs:** footer links, homepage rebrand, and header logo ([d32fa62](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/d32fa6293758e9d896d9d2ca7f5a15b0057210ad))
* **theory-docs:** rebrand homepage hero and swap header logo ([2270e06](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/2270e060f3bd62ec916ebf7248fd8e1ebaec6896))

## [1.6.0](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-mcp-v1.5.0...theory-mcp-v1.6.0) (2026-07-27)


### Features

* **theory-mcp:** add title and keyword-dense description for registry SEO ([30d21b3](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/30d21b30cc2c6e142742a26ad4348a562c81a57f))

## [1.5.0](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-mcp-v1.4.2...theory-mcp-v1.5.0) (2026-07-27)


### Features

* **theory-mcp:** switch registry namespace to domain-based auth ([28f1e21](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/28f1e215d332e8f4f0e7489fbf2de1d9e938a39b))

## [1.4.2](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-mcp-v1.4.1...theory-mcp-v1.4.2) (2026-07-27)


### Bug Fixes

* **theory-mcp:** shorten server.json description under registry limit ([ecc324f](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/ecc324f815ddace03ef522293a003e0e8bf22f86))

## [1.4.1](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-mcp-v1.4.0...theory-mcp-v1.4.1) (2026-07-27)


### Bug Fixes

* **theory-mcp:** sync server.json version with published package ([b15c923](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/b15c923032836ac3355ea4d22b6fa3722b18c5d6))

## [1.4.0](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-mcp-v1.3.0...theory-mcp-v1.4.0) (2026-07-27)


### Features

* **theory-mcp:** add official MCP registry manifest ([694edfb](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/694edfb5a77424407bd9934d93cbf65dbf8ccce8))

## [1.3.0](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-mcp-v1.2.0...theory-mcp-v1.3.0) (2026-07-23)


### Features

* **theory-mcp:** add MCP tools for transpose, MIDI/frequency, and expanded scales ([63deff6](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/63deff68023deba22c1f6f519803d592767577f1))


### Bug Fixes

* **theory-mcp:** fix MIDI range bug, unsafe casts, hardcoded enums ([402ca67](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/402ca67b035be5a7555c471b0114c7b7a8e9f273))

## [1.2.0](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-mcp-v1.1.1...theory-mcp-v1.2.0) (2026-07-21)


### Features

* **theory-mcp:** add chords and progressions MCP tools ([5a1aed3](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/5a1aed3a2b28bfe4a651f8f7f48c5315dd6e3e99))


### Bug Fixes

* **theory-mcp:** make mode optional to match engine defaults ([29639c6](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/29639c694f04a56402c6d671dc290ebe6643aa4e))
* **theory-mcp:** simplify chord/progression tool summaries ([0646f31](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/0646f31dde5dd6d950c8fd1b4c51205ef3818370))

## [1.1.1](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-mcp-v1.1.0...theory-mcp-v1.1.1) (2026-07-15)


### Bug Fixes

* **theory-mcp:** include CHANGELOG.md in published npm package ([1cb5a1c](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/1cb5a1c8260a037d1c7db00d57160841316ccf9e))

## [1.1.0](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-mcp-v1.0.1...theory-mcp-v1.1.0) (2026-07-15)


### Features

* **theory-mcp:** accept flat-spelled note names and add note-spelling tools ([3d8e642](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/3d8e642ae82dd5ae367d39ccf95ad81ec18c1090))

## [1.0.1](https://github.com/DigitalBrewLLC/playbykey-dev-tools/compare/theory-mcp-v1.0.0...theory-mcp-v1.0.1) (2026-07-11)


### Bug Fixes

* register theory-mcp for Claude Code via project-scoped .mcp.json ([#69](https://github.com/DigitalBrewLLC/playbykey-dev-tools/issues/69)) ([4004034](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/4004034e9ee73cd09d3e505c73925afc111f71fd))

## 1.0.0 (2026-07-10)


### Features

* add @playbykey/theory-mcp MCP server ([5407632](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/5407632ba83454bdeb97b8caae443ca3790ec102))
* add @playbykey/theory-mcp MCP server ([5407632](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/5407632ba83454bdeb97b8caae443ca3790ec102))
* add entry point, wire stdio transport, update build config ([6181f8a](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/6181f8a589e6be57feaf00e9a2d1dda9741dcc0e))
* implement circle and key signature tool handlers for theory-mcp ([0eb1c70](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/0eb1c70f306143550d98db2687d469806bcf153c))
* implement circle and key signature tool handlers for theory-mcp ([5e6a24a](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/5e6a24a6d6861d05629199a7f413929b62260de3))
* implement input validators for theory-mcp ([30bfb57](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/30bfb571cee63aafff17a4f2c656963fd5cbb28a))
* implement input validators for theory-mcp ([ddd358b](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/ddd358b982f8913882e741a44af29c875a00a11f))
* implement interval tool handlers for theory-mcp ([b0bc65b](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/b0bc65b45fe24d7a0ca8a4d1221d0abf54f8361a))
* implement interval tool handlers for theory-mcp ([fb23b62](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/fb23b626f2f819afb6402d6d44a5e059f2049a63))
* implement MCP server with all 12 tools registered ([cd462b9](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/cd462b904e3fc694b2f69133aa32fd2627c2d1a1))
* implement MCP server with all 12 tools registered ([73b50ec](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/73b50ec1a900e7e82a8639ec5664d7192398e0ef))
* implement mode tool handlers for theory-mcp ([3d539ef](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/3d539ef7dc3ca1c1e310f80766ec8491f8cc3fd2))
* implement mode tool handlers for theory-mcp ([7896bec](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/7896bec8b4012822f2a5e5f4c2bbffa409b6ab25))
* implement scale tool handlers for theory-mcp ([45780f3](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/45780f326278c370e2935b506f00fb0769cfdc6e))
* implement scale tool handlers for theory-mcp ([a7db997](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/a7db9974f2e23b1ecd5ee2614603d77672a475bf))
* scaffold @playbykey/theory-mcp package ([5e5176a](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/5e5176a697f0345b5401d7bf801f9b1f3bd89bc8))
* scaffold @playbykey/theory-mcp package ([771a7b5](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/771a7b592b6277d4c3af90bf05597de5b9bbe31b))
* **theory-mcp:** add get_scale_degree and is_note_in_scale tools ([dc6cc71](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/dc6cc714547d4b968b2800e3773e7311e44757c2))
* **theory-mcp:** add get_scale_degree and is_note_in_scale tools ([ac8f49c](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/ac8f49c992b6ee48b4280faddfb936a34cb1e94f))
* **theory-mcp:** Task 8 — entry point and stdio transport ([85de9d6](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/85de9d67511e8de0014120d2379dd8516e157b20))


### Bug Fixes

* add typeof string guards before calling isNote, isModeName, isIntervalId ([3308b2c](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/3308b2c2c8728e51a8d612f0b0fdc36f7c3c097d))
* use .js extension on @modelcontextprotocol/sdk/types import ([458cffb](https://github.com/DigitalBrewLLC/playbykey-dev-tools/commit/458cffb2a4a07f45a09d2740565bba29692db0f8))

# @playbykey/theory-mcp

An MCP server that exposes [@playbykey/theory](https://www.npmjs.com/package/@playbykey/theory) as AI-callable music theory tools.

Ask Claude (or any MCP-compatible AI) questions like "what notes are in D Dorian?" or "what key has 3 sharps?" and get exact, computed answers backed by the theory engine - no hallucination.

## Installation

Add to your Claude Desktop config at `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "theory": {
      "command": "npx",
      "args": ["-y", "@playbykey/theory-mcp"]
    }
  }
}
```

Restart Claude Desktop after saving.

## Tools

### Modes

**`get_mode_notes`** - Returns the 7 notes of a diatonic mode.  
Input: `root` (note), `mode` (mode name)  
Example: `get_mode_notes("D", "dorian")` → D, E, F, G, A, B, C

**`get_parent_scale_modes`** - Returns all 7 modal rotations of the parent key.  
Input: `root` (note), `mode` (mode name)  
Example: `get_parent_scale_modes("D", "dorian")` → C ionian, D dorian, E phrygian, F lydian, G mixolydian, A aeolian, B locrian

**`get_modal_root`** - Returns the root note of a mode within a parent (major) key.  
Input: `parent_key` (note), `mode` (mode name)  
Example: `get_modal_root("C", "dorian")` → D

**`get_relative_minor`** - Returns the relative minor root for a major key.  
Input: `major_key` (note)  
Example: `get_relative_minor("C")` → A

**`get_relative_major`** - Returns the relative major root for a minor key.  
Input: `minor_key` (note)  
Example: `get_relative_major("A")` → C

**`get_mode_info`** - Returns display metadata for a mode: name, scale degree, and characteristic description.  
Input: `mode` (mode name)  
Example: `get_mode_info("dorian")` → Dorian, degree 2, "Minor with a raised 6th"

### Circle and Key Signatures

**`get_circle_of_fifths`** - Returns all 12 chromatic notes in ascending-fifths order starting from C.  
Input: none  
Example → C, G, D, A, E, B, F#, C#, G#, D#, A#, F

**`get_key_signature`** - Returns the sharp or flat count for a given key.  
Input: `key` (note)  
Example: `get_key_signature("D")` → 2 sharps

### Scales

**`get_scale_notes`** - Returns the notes of a scale by type.  
Input: `root` (note), `scale_type` (one of: `major`, `blues`, `pentatonic-major`, `pentatonic-minor`, `harmonic-minor`, `chromatic`)  
Example: `get_scale_notes("A", "blues")` → A, C, D, D#, E, G

**`build_note_map`** - Returns structured per-note data: note name, scale degree (1-based), and semitone offset from root.  
Input: `root` (note), `scale_type`  
Example: `build_note_map("C", "major")` → `[{note:"C", scaleDegree:1, semitoneOffset:0}, {note:"D", scaleDegree:2, semitoneOffset:2}, ...]`

### Intervals

**`resolve_interval`** - Returns the from-note and to-note for a named interval within a root context.  
Input: `root` (note), `interval` (interval ID, e.g. `major_3rd`, `perfect_5th`)  
Example: `resolve_interval("C", "major_3rd")` → C to E (4 semitones)

**`get_semitone_distance`** - Returns the ascending semitone distance between two notes (0-11).  
Input: `from` (note), `to` (note)  
Example: `get_semitone_distance("C", "E")` → 4

## Out of scope

- Chord tools - deferred to v1.1 when `@playbykey/theory` adds chord support
- Song data queries - separate feature
- Remote/SSE transport - v1 is stdio only

## License

MIT

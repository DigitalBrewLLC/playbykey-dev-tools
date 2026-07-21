# @playbykey/theory-mcp

An MCP server that exposes [@playbykey/theory](https://www.npmjs.com/package/@playbykey/theory) as AI-callable music theory tools.

MCP lets an AI assistant call the theory engine directly as tools instead of reasoning about scales, modes, and key relationships from training data. Answers are computed, not guessed.

See the [playbykey/mcp](https://theory-engine.docs.playbykey.com/mcp/) page for the same setup instructions and full tool reference.

## Installation

No global install needed - `npx` fetches and runs the package on demand.

### Claude Desktop

Config file: `claude_desktop_config.json`

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

### Cursor

Config file location:

- **Global (all projects):** `~/.cursor/mcp.json`
- **Project only:** `.cursor/mcp.json` in your project root

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

Restart Cursor after saving.

### Claude Code

**Project scope (recommended)** - commit an `.mcp.json` at your repo root so the server is
available to every contributor after `git clone`:

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

**Local scope** - register the server for yourself in this project only, without committing anything:

```sh
claude mcp add theory npx -y @playbykey/theory-mcp
```

**Global scope** - register the server for yourself across every project on this machine:

```sh
claude mcp add theory npx -y @playbykey/theory-mcp --scope user
```

Run `claude mcp list` to confirm `theory` shows as connected.

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

### Circle of Fifths

**`get_circle_of_fifths`** - Returns all 12 chromatic notes in ascending-fifths order starting from C.  
Input: none  
Example → C, G, D, A, E, B, F#, C#, G#, D#, A#, F

### Key Signatures

**`get_key_signature`** - Returns the sharp or flat count for a given key, treated as a major-key tonic (minor-key signatures are not exposed by this tool).  
Input: `key` (note)  
Example: `get_key_signature("D")` → 2 sharps

### Scales

**`get_scale_notes`** - Returns the notes of a scale by type.  
Input: `root` (note), `scale_type` (one of: `major`, `blues`, `pentatonic-major`, `pentatonic-minor`, `harmonic-minor`, `chromatic`)  
Example: `get_scale_notes("A", "blues")` → A, C, D, D#, E, G

**`build_note_map`** - Returns structured per-note data: note name, scale degree (1-based), and semitone offset from root.  
Input: `root` (note), `scale_type`  
Example: `build_note_map("C", "major")` → `[{note:"C", scaleDegree:1, semitoneOffset:0}, {note:"D", scaleDegree:2, semitoneOffset:2}, ...]`

**`get_scale_degree`** - Returns the 1-based scale degree of a note within a scale, or null if the note is not in the scale.  
Input: `root` (note), `scale_type`, `note` (note)  
Example: `get_scale_degree("C", "major", "E")` → 3

**`is_note_in_scale`** - Returns whether a note belongs to a given scale.  
Input: `root` (note), `scale_type`, `note` (note)  
Example: `is_note_in_scale("C", "major", "F#")` → false

### Intervals

**`resolve_interval`** - Returns the from-note and to-note for a named interval within a root context.  
Input: `root` (note), `interval` (interval ID, e.g. `major_3rd`, `perfect_5th`)  
Example: `resolve_interval("C", "major_3rd")` → C to E (4 semitones)

**`get_semitone_distance`** - Returns the ascending semitone distance between two notes (0-11).  
Input: `from` (note), `to` (note)  
Example: `get_semitone_distance("C", "E")` → 4

### Note Spelling

**`get_sharps`** - Respells a list of notes to canonical sharp spelling. Most tools accept flat-spelled input directly, but `get_flats` and `get_enharmonic_labels` require sharp-spelled input - use this to normalize flat-spelled notes before calling those two.  
Input: `notes` (sharp or flat)  
Example: `get_sharps(["Db", "C#", "D"])` → C#, C#, D

**`get_flats`** - Respells a list of sharp-spelled notes as flats. Natural notes are unaffected.  
Input: `notes` (must be sharp-spelled)  
Example: `get_flats(["C#", "D"])` → Db, D

**`get_enharmonic_labels`** - Returns combined sharp/flat display labels for a list of sharp-spelled notes. Natural notes are unaffected.  
Input: `notes` (must be sharp-spelled)  
Example: `get_enharmonic_labels(["C#", "D"])` → Db/C#, D

### Chords

**`get_chord_notes`** - Returns the notes of a chord given a root and chord type.  
Input: `root` (note), `chord_type` (one of the 11 chord types, e.g. `major-triad`, `dominant-7th`, `major-9th`)  
Example: `get_chord_notes("C", "major-triad")` → C, E, G

**`get_diatonic_chords`** - Returns the 7 diatonic triads for a key/mode, one per scale degree, in degree order.  
Input: `root` (note), `mode` (mode name, optional - defaults to ionian)  
Example: `get_diatonic_chords("C", "ionian")` → C major-triad, D minor-triad, E minor-triad, F major-triad, G major-triad, A minor-triad, B diminished-triad

**`get_chord_by_degree`** - Returns the diatonic chord at a specific scale degree (1-7) for a key/mode.  
Input: `degree` (integer 1-7), `root` (note), `mode` (mode name, optional - defaults to ionian)  
Example: `get_chord_by_degree(5, "C", "ionian")` → G major-triad

**`get_available_inversions`** - Returns the valid inversion numbers for a chord type, based on its note count.  
Input: `chord_type`  
Example: `get_available_inversions("major-9th")` → 0, 1, 2, 3, 4

**`get_chord_inversion`** - Reorders a chord's notes so the given inversion's chord tone is lowest.  
Input: `root` (note), `chord_type`, `inversion` (integer, valid range depends on chord type)  
Example: `get_chord_inversion("C", "major-triad", 1)` → E, G, C

### Progressions

**`get_progression_in_key`** - Renders a named catalog progression as chords in a given key, in order.  
Input: `progression_id` (one of `I-V-vi-IV`, `ii-V-I`, `I-IV-V`, `vi-IV-I-V`, `12-bar-blues`), `root` (note)  
Example: `get_progression_in_key("I-V-vi-IV", "C")` → C major-triad, G major-triad, A minor-triad, F major-triad

**`get_roman_numeral`** - Returns the roman numeral for a scale degree in a mode - case and suffix reflect diatonic triad quality.  
Input: `degree` (integer 1-7), `mode` (mode name, optional - defaults to ionian)  
Example: `get_roman_numeral(7, "ionian")` → vii°

## License

MIT

import { Server } from '@modelcontextprotocol/sdk/server';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  handleGetModeNotes,
  handleGetParentScaleModes,
  handleGetModalRoot,
  handleGetRelativeMinor,
  handleGetRelativeMajor,
  handleGetModeInfo,
} from './tools/modes.js';
import {
  handleGetCircleOfFifths,
  handleGetKeySignature,
} from './tools/circle.js';
import {
  handleGetScaleNotes,
  handleBuildNoteMap,
  handleGetScaleDegree,
  handleIsNoteInScale,
  handleGetMelodicMinorNotes,
  handleGetMelodicMinorModeNotes,
  handleGetHarmonicMinorModeNotes,
  handleGetBebopScaleNotes,
} from './tools/scales.js';
import {
  handleResolveInterval,
  handleGetSemitoneDistance,
} from './tools/intervals.js';
import {
  handleGetSharps,
  handleGetFlats,
  handleGetEnharmonicLabels,
} from './tools/spelling.js';
import {
  handleGetChordNotes,
  handleGetDiatonicChords,
  handleGetChordByDegree,
  handleGetAvailableInversions,
  handleGetChordInversion,
  handleDetectChords,
} from './tools/chords.js';
import {
  handleGetProgressionInKey,
  handleGetRomanNumeral,
} from './tools/progressions.js';
import { handleTranspose } from './tools/transpose.js';
import {
  handleNoteToMidi,
  handleMidiToNote,
  handleNoteToFrequency,
} from './tools/midi.js';
import {
  CHROMATIC_NOTES,
  FlatNotes,
  MelodicMinorModes,
  HarmonicMinorModes,
  BebopScaleTypes,
  ChordTypes,
  ProgressionIds,
} from '@playbykey/theory';

const SHARP_NOTE_ENUM = CHROMATIC_NOTES;

const NOTE_ENUM = [...SHARP_NOTE_ENUM, ...Object.values(FlatNotes)] as const;

const MODE_ENUM = [
  'ionian',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'aeolian',
  'locrian',
] as const;

const SCALE_TYPE_ENUM = [
  'major',
  'chromatic',
  'pentatonic-major',
  'pentatonic-minor',
  'blues',
  'harmonic-minor',
  'melodic-minor',
] as const;

const MELODIC_MINOR_MODE_ENUM = [...Object.values(MelodicMinorModes)] as const;

const HARMONIC_MINOR_MODE_ENUM = [
  ...Object.values(HarmonicMinorModes),
] as const;

const BEBOP_SCALE_TYPE_ENUM = [...Object.values(BebopScaleTypes)] as const;

const INTERVAL_ID_ENUM = [
  'half_step',
  'whole_step',
  'minor_2nd',
  'major_2nd',
  'minor_3rd',
  'major_3rd',
  'perfect_4th',
  'tritone',
  'perfect_5th',
  'minor_6th',
  'major_6th',
  'minor_7th',
  'major_7th',
  'octave',
] as const;

const CHORD_TYPE_ENUM = [...Object.values(ChordTypes)] as const;

const PROGRESSION_ID_ENUM = [...Object.values(ProgressionIds)] as const;

const TOOLS = [
  {
    name: 'get_mode_notes',
    description:
      'Returns the 7 notes of a diatonic mode for a given root.\n\nExample: get_mode_notes({ root: "D", mode: "dorian" }) → ["D","E","F","G","A","B","C"]',
    inputSchema: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note',
        },
        mode: {
          type: 'string',
          enum: [...MODE_ENUM],
          description: 'Mode name',
        },
      },
      required: ['root', 'mode'],
    },
  },
  {
    name: 'get_parent_scale_modes',
    description:
      'Returns all 7 modal rotations of the parent major key for a root and mode.\n\nExample: get_parent_scale_modes({ root: "D", mode: "dorian" }) → [{"root":"C","mode":"ionian"},{"root":"D","mode":"dorian"},...]',
    inputSchema: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note of the mode',
        },
        mode: {
          type: 'string',
          enum: [...MODE_ENUM],
          description: 'Mode name',
        },
      },
      required: ['root', 'mode'],
    },
  },
  {
    name: 'get_modal_root',
    description:
      'Returns the natural root note of a mode within a parent major key.\n\nExample: get_modal_root({ parent_key: "C", mode: "dorian" }) → "D"',
    inputSchema: {
      type: 'object',
      properties: {
        parent_key: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root of the parent major key',
        },
        mode: {
          type: 'string',
          enum: [...MODE_ENUM],
          description: 'Mode name',
        },
      },
      required: ['parent_key', 'mode'],
    },
  },
  {
    name: 'get_relative_minor',
    description:
      'Returns the relative minor root for a major key.\n\nExample: get_relative_minor({ major_key: "C" }) → "A"',
    inputSchema: {
      type: 'object',
      properties: {
        major_key: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root of the major key',
        },
      },
      required: ['major_key'],
    },
  },
  {
    name: 'get_relative_major',
    description:
      'Returns the relative major root for a minor key.\n\nExample: get_relative_major({ minor_key: "A" }) → "C"',
    inputSchema: {
      type: 'object',
      properties: {
        minor_key: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root of the minor key',
        },
      },
      required: ['minor_key'],
    },
  },
  {
    name: 'get_mode_info',
    description:
      'Returns display metadata for a mode: name, scale degree, and character description.\n\nExample: get_mode_info({ mode: "dorian" }) → { "id": "dorian", "name": "Dorian", "scaleDegree": 2, "character": "Smooth and soulful - minor with a bright 6th" }',
    inputSchema: {
      type: 'object',
      properties: {
        mode: {
          type: 'string',
          enum: [...MODE_ENUM],
          description: 'Mode name',
        },
      },
      required: ['mode'],
    },
  },
  {
    name: 'get_circle_of_fifths',
    description:
      'Returns all 12 chromatic notes in ascending-fifths order starting from C. No input.\n\nExample: get_circle_of_fifths({}) → ["C","G","D","A","E","B","F#","C#","G#","D#","A#","F"]',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_key_signature',
    description:
      'Returns the sharp or flat count for a key, treated as a major-key tonic (minor-key signatures are not exposed by this tool).\n\nExample: get_key_signature({ key: "F" }) → { "flats": 1 }',
    inputSchema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Key root note',
        },
      },
      required: ['key'],
    },
  },
  {
    name: 'get_scale_notes',
    description:
      'Returns the notes of a scale by type - major, blues, pentatonic-major, pentatonic-minor, harmonic-minor, melodic-minor, or chromatic.\n\nExample: get_scale_notes({ root: "A", scale_type: "blues" }) → ["A","C","D","D#","E","G"]',
    inputSchema: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note',
        },
        scale_type: {
          type: 'string',
          enum: [...SCALE_TYPE_ENUM],
          description: 'Scale type',
        },
      },
      required: ['root', 'scale_type'],
    },
  },
  {
    name: 'build_note_map',
    description:
      'Returns per-note scale data: note name, scale degree (1-based), and semitone offset from root.\n\nExample: build_note_map({ root: "C", scale_type: "major" }) → [{"note":"C","scaleDegree":1,"semitoneOffset":0},{"note":"D","scaleDegree":2,"semitoneOffset":2},...]',
    inputSchema: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note',
        },
        scale_type: {
          type: 'string',
          enum: [...SCALE_TYPE_ENUM],
          description: 'Scale type',
        },
      },
      required: ['root', 'scale_type'],
    },
  },
  {
    name: 'resolve_interval',
    description:
      'Returns the from-note and to-note for a named interval within a root context.\n\nExample: resolve_interval({ root: "C", interval: "major_3rd" }) → { "from": "C", "to": "E", "semitones": 4, "label": "Major 3rd" }',
    inputSchema: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note',
        },
        interval: {
          type: 'string',
          enum: [...INTERVAL_ID_ENUM],
          description: 'Interval ID',
        },
      },
      required: ['root', 'interval'],
    },
  },
  {
    name: 'get_semitone_distance',
    description:
      'Returns the ascending semitone distance between two notes (0-11).\n\nExample: get_semitone_distance({ from: "C", to: "E" }) → 4',
    inputSchema: {
      type: 'object',
      properties: {
        from: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Starting note',
        },
        to: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Target note',
        },
      },
      required: ['from', 'to'],
    },
  },
  {
    name: 'get_scale_degree',
    description:
      'Returns the 1-based scale degree of a note within a scale, or null if not present.\n\nExample: get_scale_degree({ root: "C", scale_type: "major", note: "E" }) → 3',
    inputSchema: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note of the scale',
        },
        scale_type: {
          type: 'string',
          enum: [...SCALE_TYPE_ENUM],
          description: 'Scale type',
        },
        note: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Note to locate within the scale',
        },
      },
      required: ['root', 'scale_type', 'note'],
    },
  },
  {
    name: 'is_note_in_scale',
    description:
      'Returns true if a note is present in a scale, false otherwise.\n\nExample: is_note_in_scale({ root: "C", scale_type: "major", note: "F#" }) → false',
    inputSchema: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note of the scale',
        },
        scale_type: {
          type: 'string',
          enum: [...SCALE_TYPE_ENUM],
          description: 'Scale type',
        },
        note: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Note to check',
        },
      },
      required: ['root', 'scale_type', 'note'],
    },
  },
  {
    name: 'get_sharps',
    description:
      'Respells notes to canonical sharp spelling. Accepts sharp or flat input. Most other tools accept flat input directly, but get_flats and get_enharmonic_labels require sharp-spelled input - use this to normalize first.\n\nExample: get_sharps({ notes: ["Db", "C#", "D"] }) → ["C#","C#","D"]',
    inputSchema: {
      type: 'object',
      properties: {
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...NOTE_ENUM] },
          description:
            'Notes to normalize to sharps (sharp or flat input accepted)',
        },
      },
      required: ['notes'],
    },
  },
  {
    name: 'get_flats',
    description:
      'Respells sharp-spelled notes as flats. Natural notes are unaffected. Input must already be sharp-spelled - use get_sharps first if it might be flat-spelled.\n\nExample: get_flats({ notes: ["C#", "D"] }) → ["Db","D"]',
    inputSchema: {
      type: 'object',
      properties: {
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
          description: 'Sharp-spelled notes to convert to flats',
        },
      },
      required: ['notes'],
    },
  },
  {
    name: 'get_enharmonic_labels',
    description:
      'Returns combined sharp/flat display labels for sharp-spelled notes. Natural notes are unaffected. Input must already be sharp-spelled - use get_sharps first if it might be flat-spelled.\n\nExample: get_enharmonic_labels({ notes: ["C#", "D"] }) → ["Db/C#","D"]',
    inputSchema: {
      type: 'object',
      properties: {
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
          description: 'Sharp-spelled notes to label',
        },
      },
      required: ['notes'],
    },
  },
  {
    name: 'get_chord_notes',
    description:
      'Returns the notes of a chord given a root and chord type.\n\nExample: get_chord_notes({ root: "C", chord_type: "major-triad" }) → ["C","E","G"]',
    inputSchema: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note',
        },
        chord_type: {
          type: 'string',
          enum: [...CHORD_TYPE_ENUM],
          description: 'Chord type',
        },
      },
      required: ['root', 'chord_type'],
    },
  },
  {
    name: 'get_diatonic_chords',
    description:
      'Returns the 7 diatonic triads for a key/mode, in degree order.\n\nExample: get_diatonic_chords({ root: "C", mode: "ionian" }) → [{"root":"C","type":"major-triad"},{"root":"D","type":"minor-triad"},...]',
    inputSchema: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note',
        },
        mode: {
          type: 'string',
          enum: [...MODE_ENUM],
          description: 'Mode name (defaults to ionian if omitted)',
        },
      },
      required: ['root'],
    },
  },
  {
    name: 'get_chord_by_degree',
    description:
      'Returns the diatonic chord at a specific scale degree (1-7) for a key/mode.\n\nExample: get_chord_by_degree({ degree: 5, root: "C", mode: "ionian" }) → { "root": "G", "type": "major-triad" }',
    inputSchema: {
      type: 'object',
      properties: {
        degree: { type: 'integer', description: 'Scale degree (1-7)' },
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note',
        },
        mode: {
          type: 'string',
          enum: [...MODE_ENUM],
          description: 'Mode name (defaults to ionian if omitted)',
        },
      },
      required: ['degree', 'root'],
    },
  },
  {
    name: 'get_available_inversions',
    description:
      'Returns every valid value for a chord type\'s inversion parameter. 0 is root position, not itself an inversion.\n\nExample: get_available_inversions({ chord_type: "major-9th" }) → [0,1,2,3,4]',
    inputSchema: {
      type: 'object',
      properties: {
        chord_type: {
          type: 'string',
          enum: [...CHORD_TYPE_ENUM],
          description: 'Chord type',
        },
      },
      required: ['chord_type'],
    },
  },
  {
    name: 'get_chord_inversion',
    description:
      'Reorders a chord\'s notes so the given inversion\'s tone is lowest.\n\nExample: get_chord_inversion({ root: "C", chord_type: "major-triad", inversion: 1 }) → ["E","G","C"]',
    inputSchema: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note',
        },
        chord_type: {
          type: 'string',
          enum: [...CHORD_TYPE_ENUM],
          description: 'Chord type',
        },
        inversion: {
          type: 'integer',
          description:
            'Inversion value, 0-6 (0 = root position, not itself an inversion; valid upper bound depends on chord type)',
        },
      },
      required: ['root', 'chord_type', 'inversion'],
    },
  },
  {
    name: 'detect_chords',
    description:
      'Identifies every chord (root, type) reading of a set of notes, keyed by root. No exact match means the root is omitted, never guessed. Many note sets have more than one valid root - all are returned, not collapsed to one.\n\nExample: detect_chords({ notes: ["E", "C", "G"] }) → { "C": ["major-triad"] }\nExample (symmetric chord, 4 valid roots): detect_chords({ notes: ["C", "D#", "F#", "A"] }) → { "C": ["diminished-7th"], "D#": ["diminished-7th"], "F#": ["diminished-7th"], "A": ["diminished-7th"] }',
    inputSchema: {
      type: 'object',
      properties: {
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...NOTE_ENUM] },
          description:
            'Notes to identify as a chord - flat-spelled input accepted',
        },
      },
      required: ['notes'],
    },
  },
  {
    name: 'get_progression_in_key',
    description:
      'Renders a named catalog progression as chords in a given key, in order.\n\nExample: get_progression_in_key({ progression_id: "I-V-vi-IV", root: "C" }) → [{"root":"C","type":"major-triad"},{"root":"G","type":"major-triad"},{"root":"A","type":"minor-triad"},{"root":"F","type":"major-triad"}]',
    inputSchema: {
      type: 'object',
      properties: {
        progression_id: {
          type: 'string',
          enum: [...PROGRESSION_ID_ENUM],
          description: 'Catalog progression ID',
        },
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note',
        },
      },
      required: ['progression_id', 'root'],
    },
  },
  {
    name: 'get_roman_numeral',
    description:
      'Returns the roman numeral for a scale degree in a mode - case and suffix reflect diatonic triad quality.\n\nExample: get_roman_numeral({ degree: 7, mode: "ionian" }) → "vii°"',
    inputSchema: {
      type: 'object',
      properties: {
        degree: { type: 'integer', description: 'Scale degree (1-7)' },
        mode: {
          type: 'string',
          enum: [...MODE_ENUM],
          description: 'Mode name (defaults to ionian if omitted)',
        },
      },
      required: ['degree'],
    },
  },
  {
    name: 'transpose',
    description:
      'Transposes notes from one key to another by the semitone distance between the two roots.\n\nExample: transpose({ notes: ["C","E","G"], from_root: "C", to_root: "D" }) → ["D","F#","A"]',
    inputSchema: {
      type: 'object',
      properties: {
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...NOTE_ENUM] },
          description: 'Notes to transpose',
        },
        from_root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root the notes are currently in',
        },
        to_root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root to transpose the notes into',
        },
      },
      required: ['notes', 'from_root', 'to_root'],
    },
  },
  {
    name: 'note_to_midi',
    description:
      'Returns the MIDI note number for a note at a given octave (C4 = middle C = MIDI 60).\n\nExample: note_to_midi({ note: "C", octave: 4 }) → 60',
    inputSchema: {
      type: 'object',
      properties: {
        note: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Note',
        },
        octave: {
          type: 'integer',
          description: 'Octave (scientific pitch notation, typically -1 to 9)',
        },
      },
      required: ['note', 'octave'],
    },
  },
  {
    name: 'midi_to_note',
    description:
      'Returns the note and octave for a MIDI note number - the inverse of note_to_midi.\n\nExample: midi_to_note({ midi_number: 60 }) → { "note": "C", "octave": 4 }',
    inputSchema: {
      type: 'object',
      properties: {
        midi_number: {
          type: 'integer',
          description: 'MIDI note number (0-127)',
        },
      },
      required: ['midi_number'],
    },
  },
  {
    name: 'note_to_frequency',
    description:
      'Returns the frequency in Hz for a note at a given octave, equal temperament, A4 = 440Hz.\n\nExample: note_to_frequency({ note: "A", octave: 4 }) → 440',
    inputSchema: {
      type: 'object',
      properties: {
        note: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Note',
        },
        octave: {
          type: 'integer',
          description: 'Octave (scientific pitch notation, typically -1 to 9)',
        },
      },
      required: ['note', 'octave'],
    },
  },
  {
    name: 'get_melodic_minor_notes',
    description:
      'Returns the 7 notes of the ascending melodic minor scale for a root.\n\nExample: get_melodic_minor_notes({ root: "C" }) → ["C","D","D#","F","G","A","B"]',
    inputSchema: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note',
        },
      },
      required: ['root'],
    },
  },
  {
    name: 'get_melodic_minor_mode_notes',
    description:
      'Returns the 7 notes of a melodic minor mode for a root.\n\nExample: get_melodic_minor_mode_notes({ root: "C", mode: "lydian-dominant" }) → ["C","D","E","F#","G","A","A#"]',
    inputSchema: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note',
        },
        mode: {
          type: 'string',
          enum: [...MELODIC_MINOR_MODE_ENUM],
          description: 'Melodic minor mode',
        },
      },
      required: ['root', 'mode'],
    },
  },
  {
    name: 'get_harmonic_minor_mode_notes',
    description:
      'Returns the 7 notes of a harmonic minor mode for a root.\n\nExample: get_harmonic_minor_mode_notes({ root: "C", mode: "phrygian-dominant" }) → ["C","C#","E","F","G","G#","A#"]',
    inputSchema: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note',
        },
        mode: {
          type: 'string',
          enum: [...HARMONIC_MINOR_MODE_ENUM],
          description: 'Harmonic minor mode',
        },
      },
      required: ['root', 'mode'],
    },
  },
  {
    name: 'get_bebop_scale_notes',
    description:
      'Returns the 8 notes of a bebop scale variant for a root - a diatonic scale plus one chromatic passing tone.\n\nExample: get_bebop_scale_notes({ root: "C", type: "bebop-dominant" }) → ["C","D","E","F","G","A","A#","B"]',
    inputSchema: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note',
        },
        type: {
          type: 'string',
          enum: [...BEBOP_SCALE_TYPE_ENUM],
          description: 'Bebop scale variant',
        },
      },
      required: ['root', 'type'],
    },
  },
];

export const server = new Server(
  { name: 'theory-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const safeArgs: Record<string, unknown> = args ?? {};

  switch (name) {
    case 'get_mode_notes':
      return handleGetModeNotes(safeArgs);
    case 'get_parent_scale_modes':
      return handleGetParentScaleModes(safeArgs);
    case 'get_modal_root':
      return handleGetModalRoot(safeArgs);
    case 'get_relative_minor':
      return handleGetRelativeMinor(safeArgs);
    case 'get_relative_major':
      return handleGetRelativeMajor(safeArgs);
    case 'get_mode_info':
      return handleGetModeInfo(safeArgs);
    case 'get_circle_of_fifths':
      return handleGetCircleOfFifths();
    case 'get_key_signature':
      return handleGetKeySignature(safeArgs);
    case 'get_scale_notes':
      return handleGetScaleNotes(safeArgs);
    case 'build_note_map':
      return handleBuildNoteMap(safeArgs);
    case 'resolve_interval':
      return handleResolveInterval(safeArgs);
    case 'get_semitone_distance':
      return handleGetSemitoneDistance(safeArgs);
    case 'get_scale_degree':
      return handleGetScaleDegree(safeArgs);
    case 'is_note_in_scale':
      return handleIsNoteInScale(safeArgs);
    case 'get_sharps':
      return handleGetSharps(safeArgs);
    case 'get_flats':
      return handleGetFlats(safeArgs);
    case 'get_enharmonic_labels':
      return handleGetEnharmonicLabels(safeArgs);
    case 'get_chord_notes':
      return handleGetChordNotes(safeArgs);
    case 'get_diatonic_chords':
      return handleGetDiatonicChords(safeArgs);
    case 'get_chord_by_degree':
      return handleGetChordByDegree(safeArgs);
    case 'get_available_inversions':
      return handleGetAvailableInversions(safeArgs);
    case 'get_chord_inversion':
      return handleGetChordInversion(safeArgs);
    case 'detect_chords':
      return handleDetectChords(safeArgs);
    case 'get_progression_in_key':
      return handleGetProgressionInKey(safeArgs);
    case 'get_roman_numeral':
      return handleGetRomanNumeral(safeArgs);
    case 'transpose':
      return handleTranspose(safeArgs);
    case 'note_to_midi':
      return handleNoteToMidi(safeArgs);
    case 'midi_to_note':
      return handleMidiToNote(safeArgs);
    case 'note_to_frequency':
      return handleNoteToFrequency(safeArgs);
    case 'get_melodic_minor_notes':
      return handleGetMelodicMinorNotes(safeArgs);
    case 'get_melodic_minor_mode_notes':
      return handleGetMelodicMinorModeNotes(safeArgs);
    case 'get_harmonic_minor_mode_notes':
      return handleGetHarmonicMinorModeNotes(safeArgs);
    case 'get_bebop_scale_notes':
      return handleGetBebopScaleNotes(safeArgs);
    default:
      return {
        content: [{ type: 'text' as const, text: `Unknown tool: "${name}"` }],
      };
  }
});

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

const CHORD_TYPE_ENUM = [
  'major-triad',
  'minor-triad',
  'diminished-triad',
  'augmented-triad',
  'major-7th',
  'minor-7th',
  'dominant-7th',
  'major-6th',
  'minor-6th',
  'major-9th',
  'minor-9th',
] as const;

const PROGRESSION_ID_ENUM = [
  'I-V-vi-IV',
  'ii-V-I',
  'I-IV-V',
  'vi-IV-I-V',
  '12-bar-blues',
] as const;

const TOOLS = [
  {
    name: 'get_mode_notes',
    description:
      'Returns the 7 notes of a diatonic mode for a given root note.',
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
      'Returns all 7 modal rotations of the parent key for a given root and mode.',
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
      'Returns the root note of a mode within a given parent (Ionian/major) key.',
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
    description: 'Returns the relative minor root for a major key.',
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
    description: 'Returns the relative major root for a minor key.',
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
      'Returns display metadata for a mode: name, scale degree, and characteristic description.',
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
      'Returns all 12 chromatic notes in ascending-fifths order starting from C.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_key_signature',
    description:
      'Returns the sharp or flat count for a given key, treated as a major-key tonic (minor-key signatures are not exposed by this tool).',
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
      'Returns the notes of a scale by type. Covers all ScaleType values: major, blues, pentatonic-major, pentatonic-minor, harmonic-minor, melodic-minor, chromatic.',
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
      'Returns structured per-note data for a scale: note name, scale degree (1-based), and semitone offset from root.',
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
      'Returns the from-note and to-note for a named interval within a root context.',
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
      'Returns the ascending semitone distance between two notes (0-11).',
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
      'Returns the 1-based scale degree of a note within a root + scale type, or null if the note is not in the scale.',
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
      'Returns true if the given note is present in the specified root + scale type, false otherwise.',
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
      'Respells a list of notes to canonical sharp spelling, e.g. ["Db", "C#", "D"] -> ["C#", "C#", "D"]. Most tools accept flat-spelled input directly, but get_flats and get_enharmonic_labels require sharp-spelled input - use this to normalize flat-spelled notes before calling those two.',
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
      'Respells a list of sharp-spelled notes as flats, e.g. ["C#", "D"] -> ["Db", "D"]. Natural notes are unaffected. Input must already be sharp-spelled (as returned by get_scale_notes, get_mode_notes, etc.) - use get_sharps first if you have flat-spelled notes.',
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
      'Returns combined sharp/flat display labels for a list of sharp-spelled notes, e.g. ["C#", "D"] -> ["Db/C#", "D"]. Natural notes are unaffected. Input must already be sharp-spelled - use get_sharps first if you have flat-spelled notes.',
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
    description: 'Returns the notes of a chord given a root and chord type.',
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
      'Returns the 7 diatonic triads for a key/mode, one per scale degree, in degree order.',
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
      'Returns the diatonic chord at a specific scale degree (1-7) for a key/mode.',
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
      'Returns the valid inversion numbers for a chord type, based on its note count.',
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
      "Reorders a chord's notes so the given inversion's chord tone is lowest.",
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
            'Inversion number (0-4, valid range depends on chord type)',
        },
      },
      required: ['root', 'chord_type', 'inversion'],
    },
  },
  {
    name: 'get_progression_in_key',
    description:
      'Renders a named catalog progression as chords in a given key, in order.',
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
      'Returns the roman numeral for a scale degree in a mode - case and suffix reflect diatonic triad quality.',
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
      'Transposes a set of notes from one key to another by the semitone distance between the two roots.',
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
      'Returns the MIDI note number for a note at a given octave, using scientific pitch notation (C4 = middle C = MIDI 60).',
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
      'Returns the note and octave for a given MIDI note number - the inverse of note_to_midi.',
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
      'Returns the frequency in Hz for a note at a given octave, equal temperament, A4 = 440Hz.',
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
      'Returns the seven notes of the ascending melodic minor scale for a root.',
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
    description: 'Returns the seven notes of a melodic minor mode for a root.',
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
    description: 'Returns the seven notes of a harmonic minor mode for a root.',
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
      'Returns the eight notes of a bebop scale variant for a root - a diatonic scale plus one chromatic passing tone.',
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

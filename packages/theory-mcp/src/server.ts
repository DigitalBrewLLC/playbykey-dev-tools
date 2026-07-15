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
import { CHROMATIC_NOTES, FlatNotes } from '@playbykey/theory';

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
] as const;

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
      'Returns the notes of a scale by type. Covers all ScaleType values: major, blues, pentatonic-major, pentatonic-minor, harmonic-minor, chromatic.',
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
    default:
      return {
        content: [{ type: 'text' as const, text: `Unknown tool: "${name}"` }],
      };
  }
});

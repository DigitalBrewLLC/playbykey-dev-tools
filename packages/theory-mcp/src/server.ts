import { Server } from '@modelcontextprotocol/sdk/server';
import packageJson from '../package.json';
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
  handleGetRootLetter,
  handleSpellDiatonicScale,
  handleGetSpelledAccidentalCount,
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

const NOTE_LETTER_ENUM = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;

const SPELLING_PREFERENCE_ENUM = ['sharp', 'flat'] as const;

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
    outputSchema: {
      type: 'object',
      properties: {
        root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        mode: { type: 'string', enum: [...MODE_ENUM] },
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        },
      },
      required: ['root', 'mode', 'notes'],
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
    outputSchema: {
      type: 'object',
      properties: {
        root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        mode: { type: 'string', enum: [...MODE_ENUM] },
        modes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
              mode: { type: 'string', enum: [...MODE_ENUM] },
            },
            required: ['root', 'mode'],
          },
        },
      },
      required: ['root', 'mode', 'modes'],
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
    outputSchema: {
      type: 'object',
      properties: {
        parentKey: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        mode: { type: 'string', enum: [...MODE_ENUM] },
        modalRoot: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
      },
      required: ['parentKey', 'mode', 'modalRoot'],
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
    outputSchema: {
      type: 'object',
      properties: {
        majorKey: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        minorKey: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
      },
      required: ['majorKey', 'minorKey'],
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
    outputSchema: {
      type: 'object',
      properties: {
        minorKey: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        majorKey: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
      },
      required: ['minorKey', 'majorKey'],
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
    outputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', enum: [...MODE_ENUM] },
        name: { type: 'string' },
        scaleDegree: { type: 'integer' },
        character: { type: 'string' },
      },
      required: ['id', 'name', 'scaleDegree', 'character'],
    },
  },
  {
    name: 'get_circle_of_fifths',
    description:
      'Returns all 12 chromatic notes in ascending-fifths order starting from C. No input.\n\nExample: get_circle_of_fifths({}) → ["C","G","D","A","E","B","F#","C#","G#","D#","A#","F"]',
    inputSchema: { type: 'object', properties: {} },
    outputSchema: {
      type: 'object',
      properties: {
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        },
      },
      required: ['notes'],
    },
  },
  {
    name: 'get_key_signature',
    description:
      'Returns the sharp or flat count for a key, treated as a major-key tonic (minor-key signatures are not exposed by this tool). Resolves to whichever enharmonic spelling is conventionally written - get_key_signature({ key: "A#" }) returns Bb major\'s 2 flats, not A#\'s own. For the count of a root exactly as spelled instead, use get_spelled_accidental_count with get_root_letter.\n\nExample: get_key_signature({ key: "F" }) → { "flats": 1 }',
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
    outputSchema: {
      type: 'object',
      properties: {
        key: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        signature: {
          type: 'object',
          oneOf: [
            {
              properties: { sharps: { type: 'integer' } },
              required: ['sharps'],
            },
            {
              properties: { flats: { type: 'integer' } },
              required: ['flats'],
            },
          ],
        },
      },
      required: ['key', 'signature'],
    },
  },
  {
    name: 'get_scale_notes',
    description:
      'Returns the notes of a scale by type - major, blues, pentatonic-major, pentatonic-minor, harmonic-minor, melodic-minor, or chromatic. For scale_type "harmonic-minor" or "melodic-minor", this is interchangeable with get_harmonic_minor_mode_notes/get_melodic_minor_mode_notes called with mode set to that same value - same computation, same result; use whichever tool you already have the arguments for. Pitch-correct only, not letter-correct - for keys needing each of the 7 letters used exactly once (e.g. G# major), pipe the result through get_root_letter + spell_diatonic_scale.\n\nExample: get_scale_notes({ root: "A", scale_type: "blues" }) → ["A","C","D","D#","E","G"]',
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
    outputSchema: {
      type: 'object',
      properties: {
        root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        scaleType: { type: 'string', enum: [...SCALE_TYPE_ENUM] },
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        },
      },
      required: ['root', 'scaleType', 'notes'],
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
    outputSchema: {
      type: 'object',
      properties: {
        root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        scaleType: { type: 'string', enum: [...SCALE_TYPE_ENUM] },
        noteMap: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              note: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
              scaleDegree: { type: 'integer' },
              semitoneOffset: { type: 'integer' },
            },
            required: ['note', 'scaleDegree', 'semitoneOffset'],
          },
        },
      },
      required: ['root', 'scaleType', 'noteMap'],
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
    outputSchema: {
      type: 'object',
      properties: {
        root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        interval: { type: 'string', enum: [...INTERVAL_ID_ENUM] },
        from: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        to: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        semitones: { type: 'integer' },
        label: { type: 'string' },
      },
      required: ['root', 'interval', 'from', 'to', 'semitones', 'label'],
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
    outputSchema: {
      type: 'object',
      properties: {
        from: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        to: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        semitones: { type: 'integer' },
      },
      required: ['from', 'to', 'semitones'],
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
    outputSchema: {
      type: 'object',
      properties: {
        root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        scaleType: { type: 'string', enum: [...SCALE_TYPE_ENUM] },
        note: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        degree: { type: ['integer', 'null'] },
        inScale: { type: 'boolean' },
      },
      required: ['root', 'scaleType', 'note', 'degree', 'inScale'],
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
    outputSchema: {
      type: 'object',
      properties: {
        root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        scaleType: { type: 'string', enum: [...SCALE_TYPE_ENUM] },
        note: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        inScale: { type: 'boolean' },
      },
      required: ['root', 'scaleType', 'note', 'inScale'],
    },
  },
  {
    name: 'get_sharps',
    description:
      'Respells notes to canonical sharp spelling, sharp or flat input accepted. get_flats and get_enharmonic_labels require sharp-spelled input - use this to normalize first.\n\nExample: get_sharps({ notes: ["Db", "C#", "D"] }) → ["C#","C#","D"]',
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
    outputSchema: {
      type: 'object',
      properties: {
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        },
      },
      required: ['notes'],
    },
  },
  {
    name: 'get_flats',
    description:
      'Respells sharp-spelled notes as flats; natural notes are unaffected. Input must already be sharp-spelled - use get_sharps first if it might not be.\n\nExample: get_flats({ notes: ["C#", "D"] }) → ["Db","D"]',
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
    outputSchema: {
      type: 'object',
      properties: {
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...NOTE_ENUM] },
        },
      },
      required: ['notes'],
    },
  },
  {
    name: 'get_enharmonic_labels',
    description:
      'Returns combined sharp/flat display labels for sharp-spelled notes; natural notes are unaffected. Input must already be sharp-spelled - use get_sharps first if it might not be.\n\nExample: get_enharmonic_labels({ notes: ["C#", "D"] }) → ["Db/C#","D"]',
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
    outputSchema: {
      type: 'object',
      properties: {
        notes: { type: 'array', items: { type: 'string' } },
      },
      required: ['notes'],
    },
  },
  {
    name: 'get_root_letter',
    description:
      'Resolves which letter (A-G) a root should be spelled as under a sharp or flat preference. Feeds spell_diatonic_scale.\n\nExample: get_root_letter({ root: "F#", preference: "flat" }) → "G"',
    inputSchema: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          enum: [...NOTE_ENUM],
          description: 'Root note',
        },
        preference: {
          type: 'string',
          enum: [...SPELLING_PREFERENCE_ENUM],
          description: 'Sharp or flat spelling preference for ambiguous roots',
        },
      },
      required: ['root', 'preference'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        letter: { type: 'string', enum: [...NOTE_LETTER_ENUM] },
      },
      required: ['letter'],
    },
  },
  {
    name: 'spell_diatonic_scale',
    description:
      'Re-spells a 7-note diatonic scale (major, natural/harmonic/melodic minor, or any mode) so each of the 7 letters A-G is used exactly once - covering spellings a plain note can\'t represent alone (B#, E#, Cb, Fb, double-sharps, double-flats). Get notes from get_mode_notes/get_scale_notes/etc, and root_letter from get_root_letter.\n\nExample: spell_diatonic_scale({ notes: ["F#","G#","A#","B","C#","D#","F"], root_letter: "F" }) → ["F#","G#","A#","B","C#","D#","E#"]',
    inputSchema: {
      type: 'object',
      properties: {
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...NOTE_ENUM] },
          minItems: 7,
          maxItems: 7,
          description: 'The 7 notes of a diatonic scale, in scale order',
        },
        root_letter: {
          type: 'string',
          enum: [...NOTE_LETTER_ENUM],
          description: 'Which letter the root should be spelled as',
        },
      },
      required: ['notes', 'root_letter'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        notes: { type: 'array', items: { type: 'string' } },
      },
      required: ['notes'],
    },
  },
  {
    name: 'get_spelled_accidental_count',
    description:
      'Returns the sharp or flat count for a 7-note diatonic scale\'s correct spelling, including how many of those are double accidentals. Works on a major or natural minor scale interchangeably - a key and its relative minor share the same count.\n\nExample: get_spelled_accidental_count({ notes: ["A#","C","D","D#","F","G","A"], root_letter: "A" }) → { "sharps": 7, "doubleSharps": 3 }',
    inputSchema: {
      type: 'object',
      properties: {
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...NOTE_ENUM] },
          minItems: 7,
          maxItems: 7,
          description: 'The 7 notes of a diatonic scale, in scale order',
        },
        root_letter: {
          type: 'string',
          enum: [...NOTE_LETTER_ENUM],
          description: 'Which letter the root should be spelled as',
        },
      },
      required: ['notes', 'root_letter'],
    },
    outputSchema: {
      type: 'object',
      oneOf: [
        {
          properties: {
            sharps: { type: 'integer' },
            doubleSharps: { type: 'integer' },
          },
          required: ['sharps', 'doubleSharps'],
        },
        {
          properties: {
            flats: { type: 'integer' },
            doubleFlats: { type: 'integer' },
          },
          required: ['flats', 'doubleFlats'],
        },
      ],
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
    outputSchema: {
      type: 'object',
      properties: {
        root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        chordType: { type: 'string', enum: [...CHORD_TYPE_ENUM] },
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        },
      },
      required: ['root', 'chordType', 'notes'],
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
    outputSchema: {
      type: 'object',
      properties: {
        root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        mode: { type: 'string', enum: [...MODE_ENUM] },
        chords: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
              type: { type: 'string', enum: [...CHORD_TYPE_ENUM] },
            },
            required: ['root', 'type'],
          },
        },
      },
      required: ['root', 'mode', 'chords'],
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
    outputSchema: {
      type: 'object',
      properties: {
        degree: { type: 'integer' },
        root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        mode: { type: 'string', enum: [...MODE_ENUM] },
        chord: {
          type: 'object',
          properties: {
            root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
            type: { type: 'string', enum: [...CHORD_TYPE_ENUM] },
          },
          required: ['root', 'type'],
        },
      },
      required: ['degree', 'root', 'mode', 'chord'],
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
    outputSchema: {
      type: 'object',
      properties: {
        chordType: { type: 'string', enum: [...CHORD_TYPE_ENUM] },
        inversions: { type: 'array', items: { type: 'integer' } },
      },
      required: ['chordType', 'inversions'],
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
    outputSchema: {
      type: 'object',
      properties: {
        root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        chordType: { type: 'string', enum: [...CHORD_TYPE_ENUM] },
        inversion: { type: 'integer' },
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        },
      },
      required: ['root', 'chordType', 'inversion', 'notes'],
    },
  },
  {
    name: 'detect_chords',
    description:
      'Returns every chord that matches a set of notes, as key-value pairs mapping each matching root note to its list of matching chord types. Many note sets match more than one root - all are returned, not collapsed to one.\n\nExample: detect_chords({ notes: ["E", "C", "G"] }) → { "C": ["major-triad"] }\nExample (symmetric chord, 4 valid roots): detect_chords({ notes: ["C", "D#", "F#", "A"] }) → { "C": ["diminished-7th"], "D#": ["diminished-7th"], "F#": ["diminished-7th"], "A": ["diminished-7th"] }',
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
    outputSchema: {
      type: 'object',
      properties: {
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        },
        chords: {
          type: 'object',
          additionalProperties: {
            type: 'array',
            items: { type: 'string', enum: [...CHORD_TYPE_ENUM] },
          },
        },
      },
      required: ['notes', 'chords'],
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
    outputSchema: {
      type: 'object',
      properties: {
        progressionId: { type: 'string', enum: [...PROGRESSION_ID_ENUM] },
        root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        chords: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
              type: { type: 'string', enum: [...CHORD_TYPE_ENUM] },
            },
            required: ['root', 'type'],
          },
        },
      },
      required: ['progressionId', 'root', 'chords'],
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
    outputSchema: {
      type: 'object',
      properties: {
        degree: { type: 'integer' },
        mode: { type: 'string', enum: [...MODE_ENUM] },
        numeral: { type: 'string' },
      },
      required: ['degree', 'mode', 'numeral'],
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
    outputSchema: {
      type: 'object',
      properties: {
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        },
        fromRoot: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        toRoot: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        result: {
          type: 'array',
          items: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        },
      },
      required: ['notes', 'fromRoot', 'toRoot', 'result'],
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
    outputSchema: {
      type: 'object',
      properties: {
        note: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        octave: { type: 'integer' },
        midiNumber: { type: 'integer' },
      },
      required: ['note', 'octave', 'midiNumber'],
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
    outputSchema: {
      type: 'object',
      properties: {
        midiNumber: { type: 'integer' },
        note: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        octave: { type: 'integer' },
      },
      required: ['midiNumber', 'note', 'octave'],
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
    outputSchema: {
      type: 'object',
      properties: {
        note: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        octave: { type: 'integer' },
        frequency: { type: 'number' },
      },
      required: ['note', 'octave', 'frequency'],
    },
  },
  {
    name: 'get_melodic_minor_notes',
    description:
      'Returns the 7 notes of the ascending melodic minor scale for a root. Interchangeable with get_scale_notes({ scale_type: "melodic-minor" }) and get_melodic_minor_mode_notes({ mode: "melodic-minor" }) - all three return identical notes for the same root; this one is a shorthand for when you don\'t need any other mode.\n\nExample: get_melodic_minor_notes({ root: "C" }) → ["C","D","D#","F","G","A","B"]',
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
    outputSchema: {
      type: 'object',
      properties: {
        root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        },
      },
      required: ['root', 'notes'],
    },
  },
  {
    name: 'get_melodic_minor_mode_notes',
    description:
      'Returns the 7 notes of a melodic minor mode for a root. mode: "melodic-minor" returns the base scale itself (not a rotation) - interchangeable with get_scale_notes({ scale_type: "melodic-minor" }) and get_melodic_minor_notes for that case.\n\nExample: get_melodic_minor_mode_notes({ root: "C", mode: "lydian-dominant" }) → ["C","D","E","F#","G","A","A#"]',
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
    outputSchema: {
      type: 'object',
      properties: {
        root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        mode: { type: 'string', enum: [...MELODIC_MINOR_MODE_ENUM] },
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        },
      },
      required: ['root', 'mode', 'notes'],
    },
  },
  {
    name: 'get_harmonic_minor_mode_notes',
    description:
      'Returns the 7 notes of a harmonic minor mode for a root. mode: "harmonic-minor" returns the base scale itself (not a rotation) - interchangeable with get_scale_notes({ scale_type: "harmonic-minor" }) for that case; "phrygian-dominant" is the only other mode currently supported.\n\nExample: get_harmonic_minor_mode_notes({ root: "C", mode: "phrygian-dominant" }) → ["C","C#","E","F","G","G#","A#"]',
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
    outputSchema: {
      type: 'object',
      properties: {
        root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        mode: { type: 'string', enum: [...HARMONIC_MINOR_MODE_ENUM] },
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        },
      },
      required: ['root', 'mode', 'notes'],
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
    outputSchema: {
      type: 'object',
      properties: {
        root: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        type: { type: 'string', enum: [...BEBOP_SCALE_TYPE_ENUM] },
        notes: {
          type: 'array',
          items: { type: 'string', enum: [...SHARP_NOTE_ENUM] },
        },
      },
      required: ['root', 'type', 'notes'],
    },
  },
];

export const server = new Server(
  { name: 'theory-mcp', version: packageJson.version },
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
    case 'get_root_letter':
      return handleGetRootLetter(safeArgs);
    case 'spell_diatonic_scale':
      return handleSpellDiatonicScale(safeArgs);
    case 'get_spelled_accidental_count':
      return handleGetSpelledAccidentalCount(safeArgs);
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

import { useMemo, useState } from 'react';
import {
  Accidentals,
  buildNoteMap,
  getCircleOfFifthsOrder,
  getEnharmonicLabels,
  getFlats,
  getKeySignatureCount,
  getModalRoot,
  getParentScaleModes,
  getRelativeMajorKey,
  getRelativeMinorKey,
  getScaleDegree,
  getModeNotes,
  getSemitoneDistance,
  getSharps,
  isModeName,
  isNote,
  isNoteInScale,
  KeyQualities,
  Modes,
  Notes,
  ScaleTypes,
} from '@playbykey/theory';
import type {
  AccidentalType,
  KeyQuality,
  ModeName,
  Note,
  NoteDisplayInfo,
  ScaleType,
} from '@playbykey/theory';
import { AccidentalSelect } from '../ui/AccidentalSelect';
import { FieldSelect } from '../ui/FieldSelect';
import { KeyQualitySelect } from '../ui/KeyQualitySelect';
import { ModeSelect } from '../ui/ModeSelect';
import { NoteSelect } from '../ui/NoteSelect';
import { ResultPanel } from '../ui/ResultPanel';
import { ScaleTypeSelect } from '../ui/ScaleTypeSelect';
import { controlsRowStyle } from './playgroundStyles';

type EngineFunctionId =
  | 'getModeNotes'
  | 'getParentScaleModes'
  | 'getRelativeMinorKey'
  | 'getRelativeMajorKey'
  | 'getCircleOfFifthsOrder'
  | 'getKeySignatureCount'
  | 'getModalRoot'
  | 'getScaleDegree'
  | 'isNoteInScale'
  | 'buildNoteMap'
  | 'getSemitoneDistance'
  | 'isNote'
  | 'isModeName';

type InputKind =
  | 'rootMode'
  | 'rootModeNote'
  | 'rootOnly'
  | 'rootQuality'
  | 'modeOnly'
  | 'noteOnly'
  | 'twoNotes'
  | 'rootScaleType'
  | 'rootScaleTypeNote'
  | 'stringGuard'
  | 'none';

/**
 * Shape of a function's result, for the sharp/flat/enharmonic respell toggle:
 * - 'note': a single Note.
 * - 'noteArray': a Note[].
 * - 'noteMapArray': a NoteDisplayInfo[] (respell each entry's `note` field).
 * - 'parentModesArray': an Array<{ root: Note; mode: ModeName }> (respell each entry's `root` field).
 * - 'none': result contains no notes; the toggle is hidden.
 */
type ResultShape =
  | 'note'
  | 'noteArray'
  | 'noteMapArray'
  | 'parentModesArray'
  | 'none';

interface EngineFunctionSpec {
  id: EngineFunctionId;
  signature: string;
  description: string;
  inputKind: InputKind;
  resultShape: ResultShape;
}

const ENGINE_FUNCTIONS: EngineFunctionSpec[] = [
  {
    id: 'getModeNotes',
    signature: 'getModeNotes(root: Note, mode: ModeName): Note[]',
    description: 'Returns all notes in a diatonic mode for the given root.',
    inputKind: 'rootMode',
    resultShape: 'noteArray',
  },
  {
    id: 'getParentScaleModes',
    signature:
      'getParentScaleModes(root: Note, mode: ModeName): Array<{ root: Note; mode: ModeName }>',
    description: 'Returns all modes in the parent major scale.',
    inputKind: 'rootMode',
    resultShape: 'parentModesArray',
  },
  {
    id: 'getRelativeMinorKey',
    signature: 'getRelativeMinorKey(majorKey: Note): Note',
    description: 'Returns the relative minor key for a major key root.',
    inputKind: 'rootOnly',
    resultShape: 'note',
  },
  {
    id: 'getRelativeMajorKey',
    signature: 'getRelativeMajorKey(minorKey: Note): Note',
    description: 'Returns the relative major key for a minor key root.',
    inputKind: 'rootOnly',
    resultShape: 'note',
  },
  {
    id: 'getCircleOfFifthsOrder',
    signature: 'getCircleOfFifthsOrder(): readonly Note[]',
    description: 'Returns all 12 keys in circle-of-fifths order.',
    inputKind: 'none',
    resultShape: 'noteArray',
  },
  {
    id: 'getKeySignatureCount',
    signature:
      'getKeySignatureCount(key: Note, quality?: KeyQuality): { sharps: number } | { flats: number }',
    description:
      'Returns the sharp or flat count for a key signature. Quality defaults to major.',
    inputKind: 'rootQuality',
    resultShape: 'none',
  },
  {
    id: 'getModalRoot',
    signature: 'getModalRoot(parentKey: Note, mode: ModeName): Note',
    description: 'Returns the modal root for a parent key and mode.',
    inputKind: 'rootMode',
    resultShape: 'note',
  },
  {
    id: 'getScaleDegree',
    signature:
      'getScaleDegree(root: Note, scaleType: ScaleType, note: Note): number | null',
    description:
      'Returns the 1-based scale degree of a note in a scale, or null if not present.',
    inputKind: 'rootScaleTypeNote',
    resultShape: 'none',
  },
  {
    id: 'isNoteInScale',
    signature:
      'isNoteInScale(root: Note, scaleType: ScaleType, note: Note): boolean',
    description: 'Checks whether a note belongs to a scale.',
    inputKind: 'rootScaleTypeNote',
    resultShape: 'none',
  },
  {
    id: 'buildNoteMap',
    signature:
      'buildNoteMap(root: Note, scaleType: ScaleType): NoteDisplayInfo[]',
    description:
      'Returns one NoteDisplayInfo per in-scale note with note, scaleDegree, and semitoneOffset.',
    inputKind: 'rootScaleType',
    resultShape: 'noteMapArray',
  },
  {
    id: 'getSemitoneDistance',
    signature: 'getSemitoneDistance(from: Note, to: Note): number',
    description: 'Returns the semitone distance between two notes.',
    inputKind: 'twoNotes',
    resultShape: 'none',
  },
  {
    id: 'isNote',
    signature: 'isNote(value: string): value is Note',
    description: 'Type guard that checks whether a string is a valid Note.',
    inputKind: 'stringGuard',
    resultShape: 'none',
  },
  {
    id: 'isModeName',
    signature: 'isModeName(value: string): value is ModeName',
    description: 'Type guard that checks whether a string is a valid ModeName.',
    inputKind: 'stringGuard',
    resultShape: 'none',
  },
];

/** Maps an AccidentalType selection to the corresponding respelling function. */
const respellFunctionFor = (accidental: AccidentalType) => {
  if (accidental === Accidentals.Flat) return getFlats;
  if (accidental === Accidentals.Both) return getEnharmonicLabels;
  return getSharps;
};

/** Applies the sharp/flat/enharmonic toggle to a computeResult() result, based on its declared shape. */
const respellResult = (
  result: unknown,
  resultShape: ResultShape,
  accidental: AccidentalType
): unknown => {
  if (accidental === Accidentals.Sharp || resultShape === 'none') return result;
  const respell = respellFunctionFor(accidental);
  switch (resultShape) {
    case 'note':
      return respell([result as Note])[0];
    case 'noteArray':
      return respell(result as readonly Note[]);
    case 'noteMapArray':
      return (result as NoteDisplayInfo[]).map((entry) => ({
        ...entry,
        note: respell([entry.note])[0],
      }));
    case 'parentModesArray':
      return (result as Array<{ root: Note; mode: ModeName }>).map((entry) => ({
        ...entry,
        root: respell([entry.root])[0],
      }));
    default:
      return result;
  }
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '1rem',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.25rem',
};

const labelStyle = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--sl-color-gray-2)',
};

const inputStyle = {
  padding: '0.375rem 0.5rem',
  borderRadius: '0.375rem',
  border: '1px solid var(--sl-color-gray-5)',
  background: 'var(--sl-color-gray-6)',
  color: 'var(--sl-color-gray-1)',
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.875rem',
};

const signatureStyle = {
  margin: 0,
  padding: '0.5rem 0.75rem',
  borderRadius: '0.375rem',
  background: 'var(--color-code-bg)',
  border: '1px solid var(--sl-color-gray-5)',
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.8125rem',
  color: 'var(--color-code-fg)',
  overflowX: 'auto' as const,
};

const descriptionStyle = {
  margin: 0,
  color: 'var(--sl-color-gray-2)',
  lineHeight: 1.5,
};

const computeResult = (
  functionId: EngineFunctionId,
  root: Note,
  mode: ModeName,
  scaleType: ScaleType,
  targetNote: Note,
  fromNote: Note,
  toNote: Note,
  guardInput: string,
  quality: KeyQuality
): unknown => {
  switch (functionId) {
    case 'getModeNotes':
      return getModeNotes(root, mode);
    case 'getParentScaleModes':
      return getParentScaleModes(root, mode);
    case 'getRelativeMinorKey':
      return getRelativeMinorKey(root);
    case 'getRelativeMajorKey':
      return getRelativeMajorKey(root);
    case 'getCircleOfFifthsOrder':
      return getCircleOfFifthsOrder();
    case 'getKeySignatureCount':
      return getKeySignatureCount(root, quality);
    case 'getModalRoot':
      return getModalRoot(root, mode);
    case 'getScaleDegree':
      return getScaleDegree(root, scaleType, targetNote);
    case 'isNoteInScale':
      return isNoteInScale(root, scaleType, targetNote);
    case 'buildNoteMap':
      return buildNoteMap(root, scaleType);
    case 'getSemitoneDistance':
      return getSemitoneDistance(fromNote, toNote);
    case 'isNote':
      return isNote(guardInput);
    case 'isModeName':
      return isModeName(guardInput);
    default:
      return null;
  }
};

const EnginePlayground = () => {
  const [functionId, setFunctionId] =
    useState<EngineFunctionId>('getModeNotes');
  const [root, setRoot] = useState<Note>(Notes.C);
  const [mode, setMode] = useState<ModeName>(Modes.Ionian);
  const [scaleType, setScaleType] = useState<ScaleType>(ScaleTypes.Major);
  const [targetNote, setTargetNote] = useState<Note>(Notes.E);
  const [fromNote, setFromNote] = useState<Note>(Notes.C);
  const [toNote, setToNote] = useState<Note>(Notes.E);
  const [guardInput, setGuardInput] = useState('C');
  const [quality, setQuality] = useState<KeyQuality>(KeyQualities.Major);
  const [accidental, setAccidental] = useState<AccidentalType>(
    Accidentals.Sharp
  );

  const selected =
    ENGINE_FUNCTIONS.find((fn) => fn.id === functionId) ?? ENGINE_FUNCTIONS[0];
  const resultShape: ResultShape = selected?.resultShape ?? 'none';

  const rawResult = useMemo(
    () =>
      computeResult(
        functionId,
        root,
        mode,
        scaleType,
        targetNote,
        fromNote,
        toNote,
        guardInput,
        quality
      ),
    [
      functionId,
      root,
      mode,
      scaleType,
      targetNote,
      fromNote,
      toNote,
      guardInput,
      quality,
    ]
  );

  const result = useMemo(
    () => respellResult(rawResult, resultShape, accidental),
    [rawResult, resultShape, accidental]
  );

  if (selected === undefined) return null;

  return (
    <div style={containerStyle}>
      <FieldSelect
        label="Function"
        value={functionId}
        onChange={(v) => setFunctionId(v as EngineFunctionId)}
      >
        {ENGINE_FUNCTIONS.map((fn) => (
          <option key={fn.id} value={fn.id}>
            {fn.id}
          </option>
        ))}
      </FieldSelect>

      <pre style={signatureStyle}>
        <code>{selected.signature}</code>
      </pre>
      <p style={descriptionStyle}>{selected.description}</p>

      <div style={controlsRowStyle}>
        {(selected.inputKind === 'rootMode' ||
          selected.inputKind === 'rootModeNote' ||
          selected.inputKind === 'rootOnly' ||
          selected.inputKind === 'rootQuality' ||
          selected.inputKind === 'rootScaleType' ||
          selected.inputKind === 'rootScaleTypeNote') && (
          <NoteSelect value={root} onChange={setRoot} label="Root" />
        )}

        {selected.inputKind === 'rootQuality' && (
          <KeyQualitySelect value={quality} onChange={setQuality} />
        )}

        {(selected.inputKind === 'rootMode' ||
          selected.inputKind === 'rootModeNote' ||
          selected.inputKind === 'modeOnly') && (
          <ModeSelect value={mode} onChange={setMode} />
        )}

        {(selected.inputKind === 'rootScaleType' ||
          selected.inputKind === 'rootScaleTypeNote') && (
          <ScaleTypeSelect value={scaleType} onChange={setScaleType} />
        )}

        {(selected.inputKind === 'rootModeNote' ||
          selected.inputKind === 'rootScaleTypeNote' ||
          selected.inputKind === 'noteOnly') && (
          <NoteSelect
            value={targetNote}
            onChange={setTargetNote}
            label="Note"
          />
        )}

        {selected.inputKind === 'twoNotes' && (
          <>
            <NoteSelect value={fromNote} onChange={setFromNote} label="From" />
            <NoteSelect value={toNote} onChange={setToNote} label="To" />
          </>
        )}

        {selected.inputKind === 'stringGuard' && (
          <label style={fieldStyle}>
            <span style={labelStyle}>Value</span>
            <input
              style={inputStyle}
              type="text"
              value={guardInput}
              onChange={(event) => setGuardInput(event.target.value)}
            />
          </label>
        )}

        {resultShape !== 'none' && (
          <AccidentalSelect value={accidental} onChange={setAccidental} />
        )}
      </div>

      <ResultPanel label="Result" value={result} />
    </div>
  );
};

export { EnginePlayground };
export default EnginePlayground;

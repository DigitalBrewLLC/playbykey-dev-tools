import { useMemo, useState } from 'react';
import {
  buildNoteMap,
  getModalRoot,
  getParentScaleModes,
  getRelativeMajorKey,
  getRelativeMinorKey,
  getScaleDegree,
  getModeNotes,
  getSemitoneDistance,
  isModeName,
  isNote,
  isNoteInScale,
  Modes,
  Notes,
  ScaleTypes,
} from '@playbykey/theory';
import type {
  ModeName,
  Note,
  NoteDisplayInfo,
  ScaleType,
} from '@playbykey/theory';
import { FieldSelect } from '../ui/FieldSelect';
import { ModeSelect } from '../ui/ModeSelect';
import { NoteSelect } from '../ui/NoteSelect';
import { NoteSpellingResults } from '../ui/NoteSpellingResults';
import { ResultPanel } from '../ui/ResultPanel';
import { ScaleTypeSelect } from '../ui/ScaleTypeSelect';
import { controlsRowStyle } from './playgroundStyles';

type EngineFunctionId =
  | 'getModeNotes'
  | 'getParentScaleModes'
  | 'getRelativeMinorKey'
  | 'getRelativeMajorKey'
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

/** Named constants for each ResultShape value. */
const ResultShapes = {
  Note: 'note',
  NoteArray: 'noteArray',
  NoteMapArray: 'noteMapArray',
  ParentModesArray: 'parentModesArray',
  None: 'none',
} as const satisfies Record<string, ResultShape>;

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
    resultShape: ResultShapes.NoteArray,
  },
  {
    id: 'getParentScaleModes',
    signature:
      'getParentScaleModes(root: Note, mode: ModeName): Array<{ root: Note; mode: ModeName }>',
    description: 'Returns all modes in the parent major scale.',
    inputKind: 'rootMode',
    resultShape: ResultShapes.ParentModesArray,
  },
  {
    id: 'getRelativeMinorKey',
    signature: 'getRelativeMinorKey(majorKey: Note): Note',
    description: 'Returns the relative minor key for a major key root.',
    inputKind: 'rootOnly',
    resultShape: ResultShapes.Note,
  },
  {
    id: 'getRelativeMajorKey',
    signature: 'getRelativeMajorKey(minorKey: Note): Note',
    description: 'Returns the relative major key for a minor key root.',
    inputKind: 'rootOnly',
    resultShape: ResultShapes.Note,
  },
  {
    id: 'getModalRoot',
    signature: 'getModalRoot(parentKey: Note, mode: ModeName): Note',
    description: 'Returns the modal root for a parent key and mode.',
    inputKind: 'rootMode',
    resultShape: ResultShapes.Note,
  },
  {
    id: 'getScaleDegree',
    signature:
      'getScaleDegree(root: Note, scaleType: ScaleType, note: Note): number | null',
    description:
      'Returns the 1-based scale degree of a note in a scale, or null if not present.',
    inputKind: 'rootScaleTypeNote',
    resultShape: ResultShapes.None,
  },
  {
    id: 'isNoteInScale',
    signature:
      'isNoteInScale(root: Note, scaleType: ScaleType, note: Note): boolean',
    description: 'Checks whether a note belongs to a scale.',
    inputKind: 'rootScaleTypeNote',
    resultShape: ResultShapes.None,
  },
  {
    id: 'buildNoteMap',
    signature:
      'buildNoteMap(root: Note, scaleType: ScaleType): NoteDisplayInfo[]',
    description:
      'Returns one NoteDisplayInfo per in-scale note with note, scaleDegree, and semitoneOffset.',
    inputKind: 'rootScaleType',
    resultShape: ResultShapes.NoteMapArray,
  },
  {
    id: 'getSemitoneDistance',
    signature: 'getSemitoneDistance(from: Note, to: Note): number',
    description: 'Returns the semitone distance between two notes.',
    inputKind: 'twoNotes',
    resultShape: ResultShapes.None,
  },
  {
    id: 'isNote',
    signature: 'isNote(value: string): value is Note',
    description: 'Type guard that checks whether a string is a valid Note.',
    inputKind: 'stringGuard',
    resultShape: ResultShapes.None,
  },
  {
    id: 'isModeName',
    signature: 'isModeName(value: string): value is ModeName',
    description: 'Type guard that checks whether a string is a valid ModeName.',
    inputKind: 'stringGuard',
    resultShape: ResultShapes.None,
  },
];

/** Extracts the bare notes from a computeResult() result, based on its declared shape. */
const extractNotes = (
  result: unknown,
  resultShape: ResultShape
): readonly Note[] => {
  switch (resultShape) {
    case ResultShapes.Note:
      return [result as Note];
    case ResultShapes.NoteArray:
      return result as readonly Note[];
    case ResultShapes.NoteMapArray:
      return (result as NoteDisplayInfo[]).map((entry) => entry.note);
    case ResultShapes.ParentModesArray:
      return (result as Array<{ root: Note; mode: ModeName }>).map(
        (entry) => entry.root
      );
    default:
      return [];
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
  guardInput: string
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

  const selected =
    ENGINE_FUNCTIONS.find((fn) => fn.id === functionId) ?? ENGINE_FUNCTIONS[0];
  const resultShape: ResultShape = selected?.resultShape ?? ResultShapes.None;

  const result = useMemo(
    () =>
      computeResult(
        functionId,
        root,
        mode,
        scaleType,
        targetNote,
        fromNote,
        toNote,
        guardInput
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
    ]
  );

  const spellingNotes = useMemo(
    () => extractNotes(result, resultShape),
    [result, resultShape]
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

      <pre style={signatureStyle} tabIndex={0}>
        <code>{selected.signature}</code>
      </pre>
      <p style={descriptionStyle}>{selected.description}</p>

      <div style={controlsRowStyle}>
        {(selected.inputKind === 'rootMode' ||
          selected.inputKind === 'rootModeNote' ||
          selected.inputKind === 'rootOnly' ||
          selected.inputKind === 'rootScaleType' ||
          selected.inputKind === 'rootScaleTypeNote') && (
          <NoteSelect value={root} onChange={setRoot} label="Root" />
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
      </div>

      <ResultPanel label="Result" value={result} />
      {resultShape !== ResultShapes.None && (
        <NoteSpellingResults notes={spellingNotes} />
      )}
    </div>
  );
};

export { EnginePlayground };
export default EnginePlayground;

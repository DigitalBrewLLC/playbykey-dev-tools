import { useMemo, useState } from 'react';
import {
  buildNoteMap,
  getCircleOfFifthsOrder,
  getKeySignatureCount,
  getModalRoot,
  getModeAlterations,
  getNoteIndex,
  getParentScaleModes,
  getRelativeMajorKey,
  getRelativeMinorKey,
  getScaleDegree,
  getScaleNotes,
  getSemitoneDistance,
  isModeName,
  isNote,
  isNoteInScale,
  noteAtIndex,
} from '@playbykey/theory';
import type { ModeName, Note, NotationType } from '@playbykey/theory';
import { ModeSelect } from '../ui/ModeSelect';
import { NoteSelect } from '../ui/NoteSelect';
import { ResultPanel } from '../ui/ResultPanel';

type EngineFunctionId =
  | 'getScaleNotes'
  | 'getParentScaleModes'
  | 'getRelativeMinorKey'
  | 'getRelativeMajorKey'
  | 'getCircleOfFifthsOrder'
  | 'getKeySignatureCount'
  | 'getModeAlterations'
  | 'getModalRoot'
  | 'getScaleDegree'
  | 'isNoteInScale'
  | 'buildNoteMap'
  | 'getNoteIndex'
  | 'noteAtIndex'
  | 'getSemitoneDistance'
  | 'isNote'
  | 'isModeName';

type InputKind =
  | 'rootMode'
  | 'rootModeNote'
  | 'rootOnly'
  | 'modeOnly'
  | 'noteOnly'
  | 'indexOnly'
  | 'twoNotes'
  | 'rootModeNotation'
  | 'stringGuard'
  | 'none';

interface EngineFunctionSpec {
  id: EngineFunctionId;
  signature: string;
  description: string;
  inputKind: InputKind;
}

const ENGINE_FUNCTIONS: EngineFunctionSpec[] = [
  {
    id: 'getScaleNotes',
    signature: 'getScaleNotes(root: Note, mode: ModeName): Note[]',
    description: 'Returns all notes in a scale for the given root and mode.',
    inputKind: 'rootMode',
  },
  {
    id: 'getParentScaleModes',
    signature:
      'getParentScaleModes(root: Note, mode: ModeName): Array<{ root: Note; mode: ModeName }>',
    description: 'Returns all modes in the parent major scale.',
    inputKind: 'rootMode',
  },
  {
    id: 'getRelativeMinorKey',
    signature: 'getRelativeMinorKey(majorKey: Note): Note',
    description: 'Returns the relative minor key for a major key root.',
    inputKind: 'rootOnly',
  },
  {
    id: 'getRelativeMajorKey',
    signature: 'getRelativeMajorKey(minorKey: Note): Note',
    description: 'Returns the relative major key for a minor key root.',
    inputKind: 'rootOnly',
  },
  {
    id: 'getCircleOfFifthsOrder',
    signature: 'getCircleOfFifthsOrder(): readonly Note[]',
    description: 'Returns all 12 keys in circle-of-fifths order.',
    inputKind: 'none',
  },
  {
    id: 'getKeySignatureCount',
    signature:
      'getKeySignatureCount(key: Note): { sharps: number } | { flats: number }',
    description: 'Returns the sharp or flat count for a key signature.',
    inputKind: 'rootOnly',
  },
  {
    id: 'getModeAlterations',
    signature:
      "getModeAlterations(mode: ModeName): Partial<Record<number, 'flat' | 'sharp'>>",
    description: 'Returns scale-degree alterations relative to ionian.',
    inputKind: 'modeOnly',
  },
  {
    id: 'getModalRoot',
    signature: 'getModalRoot(parentKey: Note, mode: ModeName): Note',
    description: 'Returns the modal root for a parent key and mode.',
    inputKind: 'rootMode',
  },
  {
    id: 'getScaleDegree',
    signature:
      'getScaleDegree(root: Note, mode: ModeName, note: Note): number | null',
    description: 'Returns the scale degree of a note, or null if not in scale.',
    inputKind: 'rootModeNote',
  },
  {
    id: 'isNoteInScale',
    signature: 'isNoteInScale(root: Note, mode: ModeName, note: Note): boolean',
    description: 'Checks whether a note belongs to the scale.',
    inputKind: 'rootModeNote',
  },
  {
    id: 'buildNoteMap',
    signature:
      'buildNoteMap(root: Note, mode: ModeName, notation: NotationType): NoteDisplayInfo[]',
    description: 'Builds display metadata for all 12 chromatic notes.',
    inputKind: 'rootModeNotation',
  },
  {
    id: 'getNoteIndex',
    signature: 'getNoteIndex(note: Note): number',
    description: 'Returns the chromatic index (0-11) for a note.',
    inputKind: 'noteOnly',
  },
  {
    id: 'noteAtIndex',
    signature: 'noteAtIndex(index: number): Note',
    description: 'Returns the note at a chromatic index (0-11).',
    inputKind: 'indexOnly',
  },
  {
    id: 'getSemitoneDistance',
    signature: 'getSemitoneDistance(from: Note, to: Note): number',
    description: 'Returns the semitone distance between two notes.',
    inputKind: 'twoNotes',
  },
  {
    id: 'isNote',
    signature: 'isNote(value: string): value is Note',
    description: 'Type guard that checks whether a string is a valid Note.',
    inputKind: 'stringGuard',
  },
  {
    id: 'isModeName',
    signature: 'isModeName(value: string): value is ModeName',
    description: 'Type guard that checks whether a string is a valid ModeName.',
    inputKind: 'stringGuard',
  },
];

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '1rem',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.25rem',
  marginTop: 0,
};

const labelStyle = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--sl-color-gray-2)',
};

const selectStyle = {
  padding: '0.375rem 0.5rem',
  borderRadius: '0.375rem',
  border: '1px solid var(--sl-color-gray-5)',
  background: 'var(--sl-color-gray-6)',
  color: 'var(--sl-color-gray-1)',
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

const controlsRowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '0.75rem',
};

const signatureStyle = {
  margin: 0,
  padding: '0.5rem 0.75rem',
  borderRadius: '0.375rem',
  background: 'var(--sl-color-black)',
  border: '1px solid var(--sl-color-gray-5)',
  fontFamily: 'var(--sl-font-mono)',
  fontSize: '0.8125rem',
  color: 'var(--sl-color-gray-1)',
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
  targetNote: Note,
  fromNote: Note,
  toNote: Note,
  index: number,
  notation: NotationType,
  guardInput: string
): unknown => {
  switch (functionId) {
    case 'getScaleNotes':
      return getScaleNotes(root, mode);
    case 'getParentScaleModes':
      return getParentScaleModes(root, mode);
    case 'getRelativeMinorKey':
      return getRelativeMinorKey(root);
    case 'getRelativeMajorKey':
      return getRelativeMajorKey(root);
    case 'getCircleOfFifthsOrder':
      return getCircleOfFifthsOrder();
    case 'getKeySignatureCount':
      return getKeySignatureCount(root);
    case 'getModeAlterations':
      return getModeAlterations(mode);
    case 'getModalRoot':
      return getModalRoot(root, mode);
    case 'getScaleDegree':
      return getScaleDegree(root, mode, targetNote);
    case 'isNoteInScale':
      return isNoteInScale(root, mode, targetNote);
    case 'buildNoteMap':
      return buildNoteMap(root, mode, notation);
    case 'getNoteIndex':
      return getNoteIndex(targetNote);
    case 'noteAtIndex':
      return noteAtIndex(index);
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
    useState<EngineFunctionId>('getScaleNotes');
  const [root, setRoot] = useState<Note>('C');
  const [mode, setMode] = useState<ModeName>('ionian');
  const [targetNote, setTargetNote] = useState<Note>('E');
  const [fromNote, setFromNote] = useState<Note>('C');
  const [toNote, setToNote] = useState<Note>('E');
  const [index, setIndex] = useState(6);
  const [notation, setNotation] = useState<NotationType>('letter');
  const [guardInput, setGuardInput] = useState('C');

  // functionId is always a valid EngineFunctionId, so find always returns a match
  const selected = ENGINE_FUNCTIONS.find((fn) => fn.id === functionId)!;

  const result = useMemo(
    () =>
      computeResult(
        functionId,
        root,
        mode,
        targetNote,
        fromNote,
        toNote,
        index,
        notation,
        guardInput
      ),
    [
      functionId,
      root,
      mode,
      targetNote,
      fromNote,
      toNote,
      index,
      notation,
      guardInput,
    ]
  );

  return (
    <div style={containerStyle}>
      <label style={fieldStyle}>
        <span style={labelStyle}>Function</span>
        <select
          style={selectStyle}
          value={functionId}
          onChange={(event) =>
            setFunctionId(event.target.value as EngineFunctionId)
          }
        >
          {ENGINE_FUNCTIONS.map((fn) => (
            <option key={fn.id} value={fn.id}>
              {fn.id}
            </option>
          ))}
        </select>
      </label>

      <pre style={signatureStyle}>
        <code>{selected.signature}</code>
      </pre>
      <p style={descriptionStyle}>{selected.description}</p>

      <div style={controlsRowStyle}>
        {(selected.inputKind === 'rootMode' ||
          selected.inputKind === 'rootModeNote' ||
          selected.inputKind === 'rootModeNotation' ||
          selected.inputKind === 'rootOnly') && (
          <NoteSelect value={root} onChange={setRoot} label="Root" />
        )}

        {(selected.inputKind === 'rootMode' ||
          selected.inputKind === 'rootModeNote' ||
          selected.inputKind === 'rootModeNotation' ||
          selected.inputKind === 'modeOnly') && (
          <ModeSelect value={mode} onChange={setMode} />
        )}

        {(selected.inputKind === 'rootModeNote' ||
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

        {selected.inputKind === 'rootModeNotation' && (
          <label style={fieldStyle}>
            <span style={labelStyle}>Notation</span>
            <select
              style={selectStyle}
              value={notation}
              onChange={(event) =>
                setNotation(event.target.value as NotationType)
              }
            >
              <option value="letter">Letter</option>
              <option value="number">Number</option>
            </select>
          </label>
        )}

        {selected.inputKind === 'indexOnly' && (
          <label style={fieldStyle}>
            <span style={labelStyle}>Index</span>
            <input
              style={inputStyle}
              type="number"
              min={0}
              max={11}
              value={index}
              onChange={(event) => setIndex(Number(event.target.value))}
            />
          </label>
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
    </div>
  );
};

export { EnginePlayground };
export default EnginePlayground;

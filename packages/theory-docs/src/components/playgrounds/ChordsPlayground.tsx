import { useMemo, useState } from 'react';
import {
  getAvailableInversions,
  getChordByDegree,
  getChordInversion,
  getChordNotes,
  getDiatonicChords,
  ChordTypes,
  Modes,
  Notes,
} from '@playbykey/theory';
import type {
  ChordInversion,
  ChordType,
  ModeName,
  Note,
} from '@playbykey/theory';
import { ChordTypeSelect } from '../ui/ChordTypeSelect';
import { FieldSelect } from '../ui/FieldSelect';
import { FunctionCard } from '../ui/FunctionCard';
import { ModeSelect } from '../ui/ModeSelect';
import { NoteSelect } from '../ui/NoteSelect';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.5rem',
};

const DEGREES = [1, 2, 3, 4, 5, 6, 7] as const;

const formatChord = (chord: { root: Note; type: ChordType }): string =>
  `${chord.root} ${chord.type}`;

const ChordsPlayground = () => {
  const [notesRoot, setNotesRoot] = useState<Note>(Notes.C);
  const [notesType, setNotesType] = useState<ChordType>(ChordTypes.MajorTriad);

  const [diatonicRoot, setDiatonicRoot] = useState<Note>(Notes.C);
  const [diatonicMode, setDiatonicMode] = useState<ModeName>(Modes.Ionian);

  const [degree, setDegree] = useState<number>(1);
  const [degreeRoot, setDegreeRoot] = useState<Note>(Notes.C);
  const [degreeMode, setDegreeMode] = useState<ModeName>(Modes.Ionian);

  const [inversionsType, setInversionsType] = useState<ChordType>(
    ChordTypes.MajorTriad
  );

  const [invertRoot, setInvertRoot] = useState<Note>(Notes.C);
  const [invertType, setInvertType] = useState<ChordType>(
    ChordTypes.MajorTriad
  );
  const [inversion, setInversion] = useState<ChordInversion>(0);

  const chordNotes = useMemo(
    () => getChordNotes(notesRoot, notesType),
    [notesRoot, notesType]
  );

  const diatonicChords = useMemo(
    () => getDiatonicChords(diatonicRoot, diatonicMode),
    [diatonicRoot, diatonicMode]
  );

  const chordByDegree = useMemo(
    () => getChordByDegree(degree, degreeRoot, degreeMode),
    [degree, degreeRoot, degreeMode]
  );

  const availableInversions = useMemo(
    () => getAvailableInversions(inversionsType),
    [inversionsType]
  );

  const invertAvailableInversions = useMemo(
    () => getAvailableInversions(invertType),
    [invertType]
  );

  const invertedNotes = useMemo(
    () => getChordInversion({ root: invertRoot, type: invertType }, inversion),
    [invertRoot, invertType, inversion]
  );

  const handleInvertTypeChange = (chordType: ChordType) => {
    setInvertType(chordType);
    const validInversions = getAvailableInversions(chordType);
    if (!validInversions.includes(inversion)) {
      setInversion(0);
    }
  };

  return (
    <div style={containerStyle}>
      <FunctionCard
        name="getChordNotes"
        signature="getChordNotes(root: Note, chordType: ChordType): Note[]"
        description="Returns the notes of a chord type built on a root."
        result={chordNotes}
      >
        <NoteSelect value={notesRoot} onChange={setNotesRoot} label="Root" />
        <ChordTypeSelect value={notesType} onChange={setNotesType} />
      </FunctionCard>

      <FunctionCard
        name="getDiatonicChords"
        signature="getDiatonicChords(root: Note, mode?: ModeName): Chord[]"
        description="Returns the 7 diatonic triads for a key/mode, one per scale degree."
        result={diatonicChords.map(formatChord).join(', ')}
      >
        <NoteSelect
          value={diatonicRoot}
          onChange={setDiatonicRoot}
          label="Root"
        />
        <ModeSelect value={diatonicMode} onChange={setDiatonicMode} />
      </FunctionCard>

      <FunctionCard
        name="getChordByDegree"
        signature="getChordByDegree(degree: number, root: Note, mode?: ModeName): Chord"
        description="Returns the diatonic chord at a specific scale degree (1-7)."
        result={formatChord(chordByDegree)}
      >
        <FieldSelect
          label="Degree"
          value={String(degree)}
          onChange={(v) => setDegree(Number(v))}
        >
          {DEGREES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </FieldSelect>
        <NoteSelect value={degreeRoot} onChange={setDegreeRoot} label="Root" />
        <ModeSelect value={degreeMode} onChange={setDegreeMode} />
      </FunctionCard>

      <FunctionCard
        name="getAvailableInversions"
        signature="getAvailableInversions(chordType: ChordType): readonly ChordInversion[]"
        description="Returns the valid inversion numbers for a chord type, based on its note count."
        result={availableInversions}
      >
        <ChordTypeSelect value={inversionsType} onChange={setInversionsType} />
      </FunctionCard>

      <FunctionCard
        name="getChordInversion"
        signature="getChordInversion(chord: Chord, inversion: ChordInversion): Note[]"
        description="Reorders a chord's notes so the given inversion's chord tone is lowest."
        result={invertedNotes}
      >
        <NoteSelect value={invertRoot} onChange={setInvertRoot} label="Root" />
        <ChordTypeSelect value={invertType} onChange={handleInvertTypeChange} />
        <FieldSelect
          label="Inversion"
          value={String(inversion)}
          onChange={(v) => setInversion(Number(v) as ChordInversion)}
        >
          {invertAvailableInversions.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </FieldSelect>
      </FunctionCard>
    </div>
  );
};

export { ChordsPlayground };
export default ChordsPlayground;

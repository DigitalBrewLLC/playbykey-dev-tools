import { useMemo, useState } from 'react';
import {
  getModeNotes,
  getRootLetter,
  spellDiatonicScale,
  formatSpelledNote,
  Notes,
  Modes,
} from '@playbykey/theory';
import type { Note, ModeName } from '@playbykey/theory';
import { CodeSnippet } from '../ui/CodeSnippet';
import { NoteSelect } from '../ui/NoteSelect';
import { ModeSelect } from '../ui/ModeSelect';
import { ResultPanel } from '../ui/ResultPanel';
import {
  SpellingPreferenceSelect,
  type SpellingPreference,
} from '../ui/SpellingPreferenceSelect';
import { containerStyle, controlsRowStyle } from './playgroundStyles';

const DiatonicSpellingExplorer = () => {
  const [root, setRoot] = useState<Note>(Notes.CSharp);
  const [mode, setMode] = useState<ModeName>(Modes.Ionian);
  const [preference, setPreference] = useState<SpellingPreference>('sharp');

  const notes = useMemo(() => getModeNotes(root, mode), [root, mode]);
  const rootLetter = useMemo(
    () => getRootLetter(root, preference),
    [root, preference]
  );
  const spelled = useMemo(
    () => spellDiatonicScale(notes, rootLetter).map(formatSpelledNote),
    [notes, rootLetter]
  );

  const noteKey = Object.entries(Notes).find(([, v]) => v === root)?.[0];
  const modeKey = Object.entries(Modes).find(([, v]) => v === mode)?.[0];

  return (
    <div style={containerStyle}>
      <div style={controlsRowStyle}>
        <NoteSelect value={root} onChange={setRoot} />
        <ModeSelect value={mode} onChange={setMode} />
        <SpellingPreferenceSelect value={preference} onChange={setPreference} />
      </div>

      <CodeSnippet
        call={[
          `const notes = getModeNotes(Notes.${noteKey}, Modes.${modeKey})`,
          `const rootLetter = getRootLetter(Notes.${noteKey}, '${preference}') // '${rootLetter}'`,
          `spellDiatonicScale(notes, rootLetter).map(formatSpelledNote)`,
        ]}
      />

      <ResultPanel label="Letter-correct spelling" value={spelled} />
    </div>
  );
};

export { DiatonicSpellingExplorer };
export default DiatonicSpellingExplorer;

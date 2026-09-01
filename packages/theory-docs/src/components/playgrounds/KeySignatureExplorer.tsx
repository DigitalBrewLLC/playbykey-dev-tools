import { useMemo, useState } from 'react';
import {
  getKeySignatureCount,
  getRootLetter,
  getSpelledAccidentalCount,
  getModeNotes,
  KeyQualities,
  Modes,
  Notes,
} from '@playbykey/theory';
import type {
  KeyQuality,
  Note,
  SpelledAccidentalCount,
} from '@playbykey/theory';
import { CodeSnippet } from '../ui/CodeSnippet';
import { KeyQualitySelect } from '../ui/KeyQualitySelect';
import { NoteSelect } from '../ui/NoteSelect';
import { ResultPanel } from '../ui/ResultPanel';
import { containerStyle, controlsRowStyle } from './playgroundStyles';

const formatAccidentalCount = (count: SpelledAccidentalCount): string =>
  'sharps' in count
    ? `${count.sharps} sharp${count.sharps === 1 ? '' : 's'}${count.doubleSharps > 0 ? ` (${count.doubleSharps} double sharp${count.doubleSharps === 1 ? '' : 's'})` : ''}`
    : `${count.flats} flat${count.flats === 1 ? '' : 's'}${count.doubleFlats > 0 ? ` (${count.doubleFlats} double flat${count.doubleFlats === 1 ? '' : 's'})` : ''}`;

const KeySignatureExplorer = () => {
  const [key, setKey] = useState<Note>(Notes.C);
  const [quality, setQuality] = useState<KeyQuality>(KeyQualities.Major);

  const result = useMemo(
    () => getKeySignatureCount(key, quality),
    [key, quality]
  );

  // getKeySignatureCount resolves to whichever enharmonic spelling is
  // conventionally written (e.g. A# -> Bb major's 2 flats). This shows the
  // count for the root exactly as selected, sharp-spelled, which is where
  // the two answers can diverge - keys like A# major need sharps
  // (including doubles), not the flats their enharmonic twin uses.
  const spelledAsSelected = useMemo(() => {
    const mode = quality === KeyQualities.Minor ? Modes.Aeolian : Modes.Ionian;
    const notes = getModeNotes(key, mode);
    const rootLetter = getRootLetter(key, 'sharp');
    return formatAccidentalCount(getSpelledAccidentalCount(notes, rootLetter));
  }, [key, quality]);

  const keyName = Object.entries(Notes).find(([, v]) => v === key)?.[0];
  const qualityName = Object.entries(KeyQualities).find(
    ([, v]) => v === quality
  )?.[0];

  return (
    <div style={containerStyle}>
      <div style={controlsRowStyle}>
        <NoteSelect value={key} onChange={setKey} label="Key" />
        <KeyQualitySelect value={quality} onChange={setQuality} />
      </div>

      <ResultPanel
        label="getKeySignatureCount (conventional spelling)"
        value={result}
      />
      <ResultPanel
        label={`Spelled as ${keyName} (sharp)`}
        value={spelledAsSelected}
      />

      <CodeSnippet
        call={[
          `getKeySignatureCount(Notes.${keyName}, KeyQualities.${qualityName})`,
          `getSpelledAccidentalCount(notes, getRootLetter(Notes.${keyName}, 'sharp'))`,
        ]}
      />
    </div>
  );
};

export { KeySignatureExplorer };
export default KeySignatureExplorer;

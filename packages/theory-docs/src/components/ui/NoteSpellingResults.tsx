import { getFlats, getEnharmonicLabels } from '@playbykey/theory';
import type { Note } from '@playbykey/theory';
import { ResultPanel } from './ResultPanel';

interface NoteSpellingResultsProps {
  notes: readonly Note[];
}

/**
 * Shows a sharp-spelled note list's flat and combined-enharmonic
 * respellings side by side, alongside the sharp result shown elsewhere.
 * Always visible (no toggle), so "no difference for this key" (e.g. C
 * major, all naturals) is explicit rather than looking broken.
 */
const NoteSpellingResults = ({ notes }: NoteSpellingResultsProps) => (
  <>
    <ResultPanel label="Flat" value={getFlats(notes)} />
    <ResultPanel label="Enharmonic" value={getEnharmonicLabels(notes)} />
  </>
);

export { NoteSpellingResults };

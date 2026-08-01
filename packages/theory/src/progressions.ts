import { getChordByDegree } from './chords';
import { ChordTypes, Modes, ProgressionIds } from './constants';
import { elementAt } from './engine';
import type { Chord, ChordType, ModeName, Note, ProgressionId } from './types';

interface ProgressionDefinition {
  label: string;
  degrees: readonly number[];
}

const PROGRESSION_DEFINITIONS: Record<ProgressionId, ProgressionDefinition> = {
  [ProgressionIds.OneFiveSixFour]: {
    label: 'I-V-vi-IV',
    degrees: [1, 5, 6, 4],
  },
  [ProgressionIds.TwoFiveOne]: { label: 'ii-V-I', degrees: [2, 5, 1] },
  [ProgressionIds.OneFourFive]: { label: 'I-IV-V', degrees: [1, 4, 5] },
  [ProgressionIds.SixFourOneFive]: {
    label: 'vi-IV-I-V',
    degrees: [6, 4, 1, 5],
  },
  [ProgressionIds.TwelveBarBlues]: {
    label: '12-bar blues',
    degrees: [1, 1, 1, 1, 4, 4, 1, 1, 5, 4, 1, 1],
  },
  [ProgressionIds.OneSixFourFive]: {
    label: 'I-vi-IV-V',
    degrees: [1, 6, 4, 5],
  },
  [ProgressionIds.OneSixTwoFive]: {
    label: 'I-vi-ii-V',
    degrees: [1, 6, 2, 5],
  },
};

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const;

/** Reference root used only to read off a degree's triad quality - the answer is the same for any root, since quality depends on mode alone. */
const QUALITY_REFERENCE_ROOT: Note = 'C';

/**
 * One formatter per triad quality - table-driven to match the codebase's
 * definitions-table convention, and easier to scan/extend than a
 * branch-per-quality if-chain. Only the 4 triad qualities are ever passed in
 * (getChordByDegree/getDiatonicChords never return a 7th/6th/9th quality),
 * so this is intentionally not a full Record<ChordType, ...>. The augmented
 * entry has no current caller (none of the 7 major-scale modes produce an
 * augmented triad) - kept intentionally for correctness if that ever
 * changes, not left in by oversight.
 */
const NUMERAL_FORMATTERS: Partial<
  Record<ChordType, (numeral: string) => string>
> = {
  [ChordTypes.MajorTriad]: (numeral) => numeral,
  [ChordTypes.MinorTriad]: (numeral) => numeral.toLowerCase(),
  [ChordTypes.DiminishedTriad]: (numeral) => `${numeral.toLowerCase()}°`,
  [ChordTypes.AugmentedTriad]: (numeral) => `${numeral}+`,
};

const formatNumeralForQuality = (numeral: string, type: ChordType): string => {
  const formatter = NUMERAL_FORMATTERS[type];
  if (formatter === undefined) {
    throw new RangeError(`Unexpected diatonic triad type: ${type}`);
  }
  return formatter(numeral);
};

/**
 * Roman numeral for a scale degree in a mode - case and suffix reflect
 * diatonic triad quality (uppercase = major, lowercase = minor, lowercase
 * + `°` = diminished, uppercase + `+` = augmented).
 *
 * @param degree - Scale degree, 1-7 (1 = tonic)
 * @param mode - Diatonic mode name - defaults to `"ionian"` (major)
 * @returns The formatted roman numeral for that degree's diatonic triad quality
 * @throws {RangeError} if `degree` is outside 1-7
 *
 * @example
 * getRomanNumeral(7, "ionian")
 * // → "vii°"
 */
const getRomanNumeral = (
  degree: number,
  mode: ModeName = Modes.Ionian
): string => {
  let numeral: string;
  try {
    numeral = elementAt(ROMAN_NUMERALS, degree - 1);
  } catch {
    throw new RangeError(`Degree ${degree} is out of range (expected 1-7)`);
  }
  const { type } = getChordByDegree(degree, QUALITY_REFERENCE_ROOT, mode);
  return formatNumeralForQuality(numeral, type);
};

/**
 * Renders a named catalog progression as chords in a given key, in order.
 * Always Ionian - the catalog progressions are defined by major-key roman
 * numerals, so an arbitrary mode would produce chord qualities that
 * contradict what each progression's name means (no `mode` parameter).
 *
 * @param progressionId - Catalog progression ID (see `ProgressionIds`),
 *   e.g. `"I-V-vi-IV"`, `"12-bar-blues"`
 * @param root - Key to transpose the progression into
 * @returns The progression's chords in order, each `{ root, type }`
 *
 * @example
 * getProgressionInKey("I-V-vi-IV", "C")
 * // → [
 * //   { root: "C", type: "major-triad" },
 * //   { root: "G", type: "major-triad" },
 * //   { root: "A", type: "minor-triad" },
 * //   { root: "F", type: "major-triad" },
 * // ]
 */
const getProgressionInKey = (
  progressionId: ProgressionId,
  root: Note
): Chord[] =>
  PROGRESSION_DEFINITIONS[progressionId].degrees.map((degree) =>
    getChordByDegree(degree, root, Modes.Ionian)
  );

export type { ProgressionDefinition };
export { PROGRESSION_DEFINITIONS, getProgressionInKey, getRomanNumeral };

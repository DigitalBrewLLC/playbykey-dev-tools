import { Intervals, Modes } from './constants';
import { elementAt, getNoteIndex, getScaleNotes, noteAtIndex } from './engine';
import type { Note, IntervalId } from './types';

interface IntervalContext {
  root: Note;
  interval: IntervalId;
}

interface IntervalSpec {
  fromDegree: number;
  toDegree?: number;
  semitones: number;
  chromaticTo?: boolean;
}

interface IntervalDefinition {
  label: string;
  intervalSpec: IntervalSpec;
}

interface ResolvedInterval {
  from: Note;
  to: Note;
  semitones: number;
  label: string;
}

const INTERVAL_DEFINITIONS: Record<IntervalId, IntervalDefinition> = {
  [Intervals.HalfStep]: {
    label: 'Half step',
    intervalSpec: { fromDegree: 3, toDegree: 4, semitones: 1 },
  },
  [Intervals.WholeStep]: {
    label: 'Whole step',
    intervalSpec: { fromDegree: 2, toDegree: 3, semitones: 2 },
  },
  [Intervals.Major2nd]: {
    label: 'Major 2nd',
    intervalSpec: { fromDegree: 1, toDegree: 2, semitones: 2 },
  },
  [Intervals.Minor3rd]: {
    label: 'Minor 3rd',
    intervalSpec: { fromDegree: 3, toDegree: 5, semitones: 3 },
  },
  [Intervals.Major3rd]: {
    label: 'Major 3rd',
    intervalSpec: { fromDegree: 1, toDegree: 3, semitones: 4 },
  },
  [Intervals.Perfect4th]: {
    label: 'Perfect 4th',
    intervalSpec: { fromDegree: 1, toDegree: 4, semitones: 5 },
  },
  [Intervals.Tritone]: {
    label: 'Tritone',
    intervalSpec: { fromDegree: 4, toDegree: 7, semitones: 6 },
  },
  [Intervals.Perfect5th]: {
    label: 'Perfect 5th',
    intervalSpec: { fromDegree: 1, toDegree: 5, semitones: 7 },
  },
  [Intervals.Minor6th]: {
    label: 'Minor 6th',
    intervalSpec: { fromDegree: 3, toDegree: 8, semitones: 8 },
  },
  [Intervals.Major6th]: {
    label: 'Major 6th',
    intervalSpec: { fromDegree: 1, toDegree: 6, semitones: 9 },
  },
  [Intervals.Minor7th]: {
    label: 'Minor 7th',
    intervalSpec: { fromDegree: 1, semitones: 10, chromaticTo: true },
  },
  [Intervals.Major7th]: {
    label: 'Major 7th',
    intervalSpec: { fromDegree: 1, toDegree: 7, semitones: 11 },
  },
  [Intervals.Octave]: {
    label: 'Octave',
    intervalSpec: { fromDegree: 1, toDegree: 8, semitones: 12 },
  },
};

const INTERVAL_VALUE_SET = new Set<string>(Object.values(Intervals));

const isIntervalId = (value: string): value is IntervalId =>
  INTERVAL_VALUE_SET.has(value);

const noteAtDegree = (root: Note, degree: number): Note => {
  if (degree === 8) {
    return root;
  }
  return elementAt(getScaleNotes(root, Modes.Ionian), degree - 1);
};

const resolveEndpointsFromSpec = (
  root: Note,
  intervalSpec: IntervalSpec
): { from: Note; to: Note } => {
  const from = noteAtDegree(root, intervalSpec.fromDegree);

  if (intervalSpec.chromaticTo === true) {
    return {
      from,
      to: noteAtIndex(getNoteIndex(root) + intervalSpec.semitones),
    };
  }

  if (intervalSpec.toDegree === undefined) {
    throw new Error(
      `Interval spec requires toDegree when chromaticTo is not true (fromDegree ${intervalSpec.fromDegree})`
    );
  }

  return {
    from,
    to: noteAtDegree(root, intervalSpec.toDegree),
  };
};

/**
 * Returns the fixed semitone count for a given interval.
 * The count is a property of the interval itself — root and mode do not affect it.
 */
const getIntervalSemitones = (interval: IntervalId): number =>
  INTERVAL_DEFINITIONS[interval].intervalSpec.semitones;

const resolveIntervalEndpoints = (
  context: IntervalContext
): ResolvedInterval => {
  const definition = INTERVAL_DEFINITIONS[context.interval];
  const { intervalSpec } = definition;
  const { from, to } = resolveEndpointsFromSpec(context.root, intervalSpec);

  return {
    from,
    to,
    semitones: intervalSpec.semitones,
    label: definition.label,
  };
};

export type {
  IntervalContext,
  IntervalSpec,
  IntervalDefinition,
  ResolvedInterval,
};

export {
  INTERVAL_DEFINITIONS,
  isIntervalId,
  getIntervalSemitones,
  resolveIntervalEndpoints,
};

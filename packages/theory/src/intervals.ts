import { INTERVAL_IDS, INTERVAL_ID_VALUES } from './constants';
import { getNoteIndex, getScaleNotes, noteAtIndex } from './engine';
import type { ModeName, Note, IntervalId } from './types';

interface IntervalContext {
  root: Note;
  mode: ModeName;
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
  [INTERVAL_IDS.HALF_STEP]: {
    label: 'Half step',
    intervalSpec: { fromDegree: 3, toDegree: 4, semitones: 1 },
  },
  [INTERVAL_IDS.WHOLE_STEP]: {
    label: 'Whole step',
    intervalSpec: { fromDegree: 2, toDegree: 3, semitones: 2 },
  },
  [INTERVAL_IDS.MAJOR_2ND]: {
    label: 'Major 2nd',
    intervalSpec: { fromDegree: 1, toDegree: 2, semitones: 2 },
  },
  [INTERVAL_IDS.MINOR_3RD]: {
    label: 'Minor 3rd',
    intervalSpec: { fromDegree: 3, toDegree: 5, semitones: 3 },
  },
  [INTERVAL_IDS.MAJOR_3RD]: {
    label: 'Major 3rd',
    intervalSpec: { fromDegree: 1, toDegree: 3, semitones: 4 },
  },
  [INTERVAL_IDS.PERFECT_4TH]: {
    label: 'Perfect 4th',
    intervalSpec: { fromDegree: 1, toDegree: 4, semitones: 5 },
  },
  [INTERVAL_IDS.TRITONE]: {
    label: 'Tritone',
    intervalSpec: { fromDegree: 4, toDegree: 7, semitones: 6 },
  },
  [INTERVAL_IDS.PERFECT_5TH]: {
    label: 'Perfect 5th',
    intervalSpec: { fromDegree: 1, toDegree: 5, semitones: 7 },
  },
  [INTERVAL_IDS.MINOR_6TH]: {
    label: 'Minor 6th',
    intervalSpec: { fromDegree: 3, toDegree: 8, semitones: 8 },
  },
  [INTERVAL_IDS.MAJOR_6TH]: {
    label: 'Major 6th',
    intervalSpec: { fromDegree: 1, toDegree: 6, semitones: 9 },
  },
  [INTERVAL_IDS.MINOR_7TH]: {
    label: 'Minor 7th',
    intervalSpec: { fromDegree: 1, semitones: 10, chromaticTo: true },
  },
  [INTERVAL_IDS.MAJOR_7TH]: {
    label: 'Major 7th',
    intervalSpec: { fromDegree: 1, toDegree: 7, semitones: 11 },
  },
  [INTERVAL_IDS.OCTAVE]: {
    label: 'Octave',
    intervalSpec: { fromDegree: 1, toDegree: 8, semitones: 12 },
  },
};

const isIntervalId = (value: string): value is IntervalId =>
  (INTERVAL_ID_VALUES as readonly string[]).includes(value);

const noteAtDegree = (root: Note, mode: ModeName, degree: number): Note => {
  if (degree === 8) {
    return root;
  }
  const notes = getScaleNotes(root, mode);
  const note = notes[degree - 1];
  if (note === undefined) {
    throw new Error(`Invalid scale degree ${degree} for ${root} ${mode}`);
  }
  return note;
};

const resolveEndpointsFromSpec = (
  root: Note,
  mode: ModeName,
  intervalSpec: IntervalSpec
): { from: Note; to: Note } => {
  const from = noteAtDegree(root, mode, intervalSpec.fromDegree);

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
    to: noteAtDegree(root, mode, intervalSpec.toDegree),
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
  const { from, to } = resolveEndpointsFromSpec(
    context.root,
    context.mode,
    intervalSpec
  );

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

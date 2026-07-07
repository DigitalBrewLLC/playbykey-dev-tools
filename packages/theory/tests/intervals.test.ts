import { describe, expect, it } from 'vitest';
import {
  getIntervalSemitones,
  INTERVAL_DEFINITIONS,
  Intervals,
  isIntervalId,
  resolveIntervalEndpoints,
} from '../src';
import type { Note } from '../src';

describe('INTERVAL_DEFINITIONS catalog', () => {
  it('includes all 14 interval ids', () => {
    expect(Object.keys(INTERVAL_DEFINITIONS)).toHaveLength(14);
    expect(Object.keys(INTERVAL_DEFINITIONS)).toEqual(
      expect.arrayContaining(Object.values(Intervals))
    );
  });

  it('registers minor_2nd with one semitone and a from-root label', () => {
    expect(INTERVAL_DEFINITIONS[Intervals.Minor2nd]).toEqual({
      label: 'Minor 2nd — from root',
      intervalSpec: { fromDegree: 1, semitones: 1, chromaticTo: true },
    });
  });

  it('labels scale-motion steps distinctly from named 2nds', () => {
    expect(INTERVAL_DEFINITIONS[Intervals.HalfStep].label).toBe(
      'Half step — scale motion'
    );
    expect(INTERVAL_DEFINITIONS[Intervals.WholeStep].label).toBe(
      'Whole step — scale motion'
    );
    expect(INTERVAL_DEFINITIONS[Intervals.Major2nd].label).toBe(
      'Major 2nd — from root'
    );
  });
});

describe('getIntervalSemitones', () => {
  it('returns 1 for minor_2nd', () => {
    expect(getIntervalSemitones(Intervals.Minor2nd)).toBe(1);
  });

  it('matches semitone distance for step-motion and named 2nd pairs', () => {
    expect(getIntervalSemitones(Intervals.HalfStep)).toBe(
      getIntervalSemitones(Intervals.Minor2nd)
    );
    expect(getIntervalSemitones(Intervals.WholeStep)).toBe(
      getIntervalSemitones(Intervals.Major2nd)
    );
  });
});

describe('resolveIntervalEndpoints — C major', () => {
  const root: Note = 'C';

  it('resolves half_step between adjacent scale degrees (E → F)', () => {
    expect(
      resolveIntervalEndpoints({ root, interval: Intervals.HalfStep })
    ).toEqual({
      from: 'E',
      to: 'F',
      semitones: 1,
      label: 'Half step — scale motion',
    });
  });

  it('resolves whole_step between adjacent scale degrees (D → E)', () => {
    expect(
      resolveIntervalEndpoints({ root, interval: Intervals.WholeStep })
    ).toEqual({
      from: 'D',
      to: 'E',
      semitones: 2,
      label: 'Whole step — scale motion',
    });
  });

  it('resolves minor_2nd chromatically from the root (C → C#)', () => {
    expect(
      resolveIntervalEndpoints({ root, interval: Intervals.Minor2nd })
    ).toEqual({
      from: 'C',
      to: 'C#',
      semitones: 1,
      label: 'Minor 2nd — from root',
    });
  });

  it('resolves major_2nd diatonically from the root (C → D)', () => {
    expect(
      resolveIntervalEndpoints({ root, interval: Intervals.Major2nd })
    ).toEqual({
      from: 'C',
      to: 'D',
      semitones: 2,
      label: 'Major 2nd — from root',
    });
  });

  it('keeps equal semitone distances but different endpoints for 1-semitone pairs', () => {
    const halfStep = resolveIntervalEndpoints({
      root,
      interval: Intervals.HalfStep,
    });
    const minor2nd = resolveIntervalEndpoints({
      root,
      interval: Intervals.Minor2nd,
    });

    expect(halfStep.semitones).toBe(minor2nd.semitones);
    expect(halfStep.from).not.toBe(minor2nd.from);
    expect(halfStep.to).not.toBe(minor2nd.to);
  });

  it('keeps equal semitone distances but different endpoints for 2-semitone pairs', () => {
    const wholeStep = resolveIntervalEndpoints({
      root,
      interval: Intervals.WholeStep,
    });
    const major2nd = resolveIntervalEndpoints({
      root,
      interval: Intervals.Major2nd,
    });

    expect(wholeStep.semitones).toBe(major2nd.semitones);
    expect(wholeStep.from).not.toBe(major2nd.from);
    expect(wholeStep.to).not.toBe(major2nd.to);
  });
});

describe('resolveIntervalEndpoints — transposed roots', () => {
  it.each([
    {
      root: 'G' as Note,
      interval: Intervals.Minor2nd,
      from: 'G',
      to: 'G#',
    },
    {
      root: 'D' as Note,
      interval: Intervals.Major2nd,
      from: 'D',
      to: 'E',
    },
    {
      root: 'F' as Note,
      interval: Intervals.HalfStep,
      from: 'A',
      to: 'A#',
    },
    {
      root: 'A' as Note,
      interval: Intervals.WholeStep,
      from: 'B',
      to: 'C#',
    },
  ])(
    '$interval from $root resolves $from → $to',
    ({ root, interval, from, to }) => {
      expect(resolveIntervalEndpoints({ root, interval })).toMatchObject({
        from,
        to,
      });
    }
  );
});

describe('isIntervalId', () => {
  it('accepts minor_2nd', () => {
    expect(isIntervalId('minor_2nd')).toBe(true);
  });

  it('rejects unknown interval slugs', () => {
    expect(isIntervalId('minor_second')).toBe(false);
  });
});

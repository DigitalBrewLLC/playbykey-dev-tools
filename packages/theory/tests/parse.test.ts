import { describe, expect, it } from 'vitest';
import { Modes } from '../src/constants';
import { isNote, parseModeName, parseNote } from '../src/engine';

describe('isNote', () => {
  it('accepts canonical note casing', () => {
    expect(isNote('C')).toBe(true);
    expect(isNote('F#')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isNote('c')).toBe(true);
    expect(isNote('f#')).toBe(true);
    expect(isNote('  a#  ')).toBe(false);
  });

  it('rejects unrecognized input', () => {
    expect(isNote('')).toBe(false);
    expect(isNote('major')).toBe(false);
  });
});

describe('parseNote', () => {
  it('parses a bare note name', () => {
    expect(parseNote('C')).toBe('C');
    expect(parseNote('  F#  ')).toBe('F#');
  });

  it('normalizes case to canonical note spelling', () => {
    expect(parseNote('c')).toBe('C');
    expect(parseNote('f#')).toBe('F#');
    expect(parseNote('c ionian')).toBe('C');
  });

  it('parses the first token before a space or comma', () => {
    expect(parseNote('C ionian')).toBe('C');
    expect(parseNote('G, mixolydian')).toBe('G');
  });

  it('returns null for unrecognized input', () => {
    expect(parseNote('')).toBeNull();
    expect(parseNote('major')).toBeNull();
  });
});

describe('parseModeName', () => {
  it('parses a mode slug', () => {
    expect(parseModeName('ionian')).toBe(Modes.Ionian);
    expect(parseModeName(' Aeolian ')).toBe(Modes.Aeolian);
  });

  it('returns null for unrecognized input', () => {
    expect(parseModeName('major')).toBeNull();
  });
});

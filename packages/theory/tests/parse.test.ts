import { describe, expect, it } from 'vitest';
import { Modes } from '../src/constants';
import {
  isNote,
  parseModeName,
  parseNote,
  parseNoteToken,
} from '../src/engine';

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

  it('does not recognize flat-spelled input (regression guard)', () => {
    expect(isNote('Db')).toBe(false);
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

  it('resolves flat-spelled note names to their canonical sharp equivalent', () => {
    expect(parseNote('Db')).toBe('C#');
    expect(parseNote('db')).toBe('C#');
    expect(parseNote('Db aeolian')).toBe('C#');
  });
});

describe('parseNoteToken', () => {
  it('accepts canonical sharp note names, case-insensitively', () => {
    expect(parseNoteToken('C#')).toBe('C#');
    expect(parseNoteToken('c#')).toBe('C#');
    expect(parseNoteToken('C')).toBe('C');
  });

  it('accepts flat note names in any case', () => {
    expect(parseNoteToken('Db')).toBe('C#');
    expect(parseNoteToken('db')).toBe('C#');
    expect(parseNoteToken('DB')).toBe('C#');
    expect(parseNoteToken('dB')).toBe('C#');
  });

  it('rejects phrases, unlike parseNote', () => {
    expect(parseNoteToken('C ionian')).toBeNull();
    expect(parseNoteToken('G, mixolydian')).toBeNull();
  });

  it('returns null for unrecognized input', () => {
    expect(parseNoteToken('')).toBeNull();
    expect(parseNoteToken('major')).toBeNull();
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

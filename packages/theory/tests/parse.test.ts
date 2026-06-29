import { describe, expect, it } from 'vitest';
import { Modes } from '../src/constants';
import { parseModeName, parseNote } from '../src/engine';

describe('parseNote', () => {
  it('parses a bare note name', () => {
    expect(parseNote('C')).toBe('C');
    expect(parseNote('  F#  ')).toBe('F#');
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

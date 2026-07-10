import { describe, it, expect } from 'vitest';
import {
  handleResolveInterval,
  handleGetSemitoneDistance,
} from '../src/tools/intervals.js';

describe('handleResolveInterval', () => {
  it('resolves major 3rd from C', () => {
    const result = handleResolveInterval({ root: 'C', interval: 'major_3rd' });
    expect(result.content[0]?.text).toContain('E');
  });

  it('resolves perfect 5th from G', () => {
    const result = handleResolveInterval({
      root: 'G',
      interval: 'perfect_5th',
    });
    expect(result.content[0]?.text).toContain('D');
  });

  it('returns error for invalid interval', () => {
    const result = handleResolveInterval({
      root: 'C',
      interval: 'bad_interval',
    });
    expect(result.content[0]?.text).toContain('Invalid interval');
  });

  it('returns error for invalid root', () => {
    const result = handleResolveInterval({ root: 'X', interval: 'major_3rd' });
    expect(result.content[0]?.text).toContain('Invalid note');
  });
});

describe('handleGetSemitoneDistance', () => {
  it('returns 4 for C to E', () => {
    const result = handleGetSemitoneDistance({ from: 'C', to: 'E' });
    expect(result.content[0]?.text).toContain('4');
  });

  it('returns 7 for C to G', () => {
    const result = handleGetSemitoneDistance({ from: 'C', to: 'G' });
    expect(result.content[0]?.text).toContain('7');
  });

  it('returns error for invalid from note', () => {
    const result = handleGetSemitoneDistance({ from: 'X', to: 'E' });
    expect(result.content[0]?.text).toContain('Invalid note');
  });
});

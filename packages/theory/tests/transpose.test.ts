import { describe, expect, it } from 'vitest';
import { transpose } from '../src/engine';

describe('transpose', () => {
  it('transposes a C major triad up to D', () => {
    expect(transpose(['C', 'E', 'G'], 'C', 'D')).toEqual(['D', 'F#', 'A']);
  });

  it('returns the input notes unchanged when fromRoot equals toRoot', () => {
    expect(transpose(['C', 'E', 'G'], 'C', 'C')).toEqual(['C', 'E', 'G']);
  });

  it('wraps correctly across the octave boundary', () => {
    expect(transpose(['B'], 'C', 'D')).toEqual(['C#']);
  });
});

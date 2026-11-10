import { describe, expect, it } from 'vitest';
import { decimal } from './decimal.ts';
import { clp, sumClp, toClp, type RoundingMode } from './dinero.ts';

// Synthetic citation: these tests exercise the rounding mechanism, not a real norm.
const FUENTE = 'synthetic rule for tests';

describe('clp', () => {
  it('accepts integers, including zero and negatives', () => {
    expect(clp(500_000)).toBe(500_000);
    expect(clp(0)).toBe(0);
    expect(clp(-1_000)).toBe(-1_000);
  });

  it('rejects fractions and unsafe values', () => {
    expect(() => clp(0.5)).toThrow(RangeError);
    expect(() => clp(Number.NaN)).toThrow(RangeError);
    expect(() => clp(Number.POSITIVE_INFINITY)).toThrow(RangeError);
    expect(() => clp(2 ** 53)).toThrow(RangeError);
  });
});

describe('sumClp', () => {
  it('adds amounts', () => {
    expect(sumClp([clp(100), clp(250), clp(-50)])).toBe(300);
    expect(sumClp([])).toBe(0);
  });

  it('refuses a total that is no longer a safe integer', () => {
    expect(() => sumClp([clp(Number.MAX_SAFE_INTEGER), clp(1)])).toThrow(RangeError);
  });
});

describe('toClp', () => {
  const cases: [RoundingMode, string, number][] = [
    ['half_up', '0.5', 1],
    ['half_up', '1.5', 2],
    ['half_up', '2.5', 3],
    ['half_up', '2.4999', 2],
    ['half_up', '-0.5', -1],
    ['half_even', '0.5', 0],
    ['half_even', '1.5', 2],
    ['half_even', '2.5', 2],
    ['floor', '2.9', 2],
    ['floor', '-2.1', -3],
    ['ceil', '2.1', 3],
    ['ceil', '-2.9', -2],
    ['truncate', '2.9', 2],
    ['truncate', '-2.9', -2],
  ];

  it.each(cases)('%s rounds %s to %d', (mode, amount, expected) => {
    expect(toClp(decimal(amount), { mode, fuente: FUENTE })).toBe(expected);
  });

  it('leaves an integer amount untouched', () => {
    expect(toClp(decimal('1000'), { mode: 'half_up', fuente: FUENTE })).toBe(1000);
  });

  it('requires the norm that mandates the rounding', () => {
    expect(() => toClp(decimal('1.5'), { mode: 'half_up', fuente: ' ' })).toThrow(TypeError);
  });

  it('rejects amounts that are not finite or not representable', () => {
    const rule = { mode: 'half_up', fuente: FUENTE } as const;
    expect(() => toClp(decimal(1).dividedBy(0), rule)).toThrow(RangeError);
    expect(() => toClp(decimal('9007199254740993'), rule)).toThrow(RangeError);
  });
});

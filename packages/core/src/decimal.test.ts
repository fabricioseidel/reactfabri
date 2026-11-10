import { describe, expect, it } from 'vitest';
import { decimal } from './decimal.ts';

describe('decimal', () => {
  it('adds without binary floating point error', () => {
    expect(decimal('0.1').plus(decimal('0.2')).toString()).toBe('0.3');
  });

  it('multiplies exactly', () => {
    expect(decimal('38000.17').times(decimal('2.5')).toString()).toBe('95000.425');
  });

  it('accepts safe integers and bigints', () => {
    expect(decimal(90).toString()).toBe('90');
    expect(decimal(-3).toString()).toBe('-3');
    expect(decimal(12345678901234567890n).toString()).toBe('12345678901234567890');
  });

  it('rejects a number that is already a float', () => {
    expect(() => decimal(0.07)).toThrow(TypeError);
    expect(() => decimal(Number.NaN)).toThrow(TypeError);
    expect(() => decimal(Number.POSITIVE_INFINITY)).toThrow(TypeError);
    expect(() => decimal(2 ** 53)).toThrow(TypeError);
  });

  it.each(['', ' 1', '1,5', '1.', '.5', '1e3', '0x10', 'NaN', 'Infinity', '+1', '1.2.3'])(
    'rejects the literal %j',
    (literal) => {
      expect(() => decimal(literal)).toThrow(TypeError);
    },
  );

  it('never prints exponent notation for realistic magnitudes', () => {
    expect(decimal('0.000000001').toString()).toBe('0.000000001');
    expect(decimal('1000000000000000000000').toString()).toBe('1000000000000000000000');
  });
});

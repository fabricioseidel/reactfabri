import { describe, expect, it } from 'vitest';
import {
  computeCheckDigit,
  formatRut,
  InvalidRutError,
  isValidRut,
  normalizeRut,
  parseRut,
} from './rut.ts';
import { syntheticRut } from './testing.ts';

// Check digits below were worked out by hand with the modulo 11 algorithm.
describe('computeCheckDigit', () => {
  it.each([
    ['12345678', '5'],
    ['11111111', '1'],
    ['40000001', '8'],
    ['40000000', 'K'], // remainder 1 -> 10 -> K
    ['40000005', '0'], // remainder 0 -> 11 -> 0
    ['6', 'K'],
  ])('body %s has check digit %s', (body, expected) => {
    expect(computeCheckDigit(body)).toBe(expected);
  });

  it('rejects a body that is not made of digits', () => {
    expect(() => computeCheckDigit('12.345.678')).toThrow(TypeError);
    expect(() => computeCheckDigit('')).toThrow(TypeError);
  });
});

describe('parseRut', () => {
  it.each([
    '12.345.678-5',
    '12345678-5',
    '123456785',
    '12.345.6785',
    '  12.345.678-5  ',
    '012345678-5',
  ])('normalizes %j to the stored form', (input) => {
    expect(parseRut(input)).toEqual({ ok: true, rut: '12345678-5' });
  });

  it('stores the check digit K in upper case', () => {
    expect(parseRut('40.000.000-k')).toEqual({ ok: true, rut: '40000000-K' });
  });

  it.each([
    '',
    '-5',
    '12345678-',
    '12.345.678-55',
    '12.3456.78-5',
    '1.2345678-5',
    '12 345 678-5',
    '12345678_5',
    'K-K',
    '0-0',
    '1234567890-1',
  ])('rejects the malformed input %j', (input) => {
    expect(parseRut(input)).toEqual({ ok: false, error: 'formato' });
  });

  it('rejects a wrong check digit', () => {
    expect(parseRut('12.345.678-9')).toEqual({ ok: false, error: 'digito_verificador' });
    expect(parseRut('40.000.000-0')).toEqual({ ok: false, error: 'digito_verificador' });
  });
});

describe('isValidRut', () => {
  it('agrees with parseRut', () => {
    expect(isValidRut('12.345.678-5')).toBe(true);
    expect(isValidRut('12.345.678-9')).toBe(false);
  });
});

describe('normalizeRut', () => {
  it('returns the stored form', () => {
    expect(normalizeRut('40.000.005-0')).toBe('40000005-0');
  });

  it('throws without echoing the input, which is personal data', () => {
    expect(() => normalizeRut('12.345.678-9')).toThrow(InvalidRutError);
    expect(() => normalizeRut('12.345.678-9')).not.toThrow(/12/);
  });
});

describe('formatRut', () => {
  it.each([
    ['12345678-5', '12.345.678-5'],
    ['40000000-K', '40.000.000-K'],
    ['6-K', '6-K'],
    ['1234-3', '1.234-3'],
  ])('formats %s as %s', (input, expected) => {
    expect(formatRut(normalizeRut(input))).toBe(expected);
  });
});

describe('syntheticRut', () => {
  it('is deterministic and always valid', () => {
    expect(syntheticRut(0)).toBe('40000000-K');
    expect(syntheticRut(5)).toBe('40000005-0');
    for (let index = 0; index < 500; index++) {
      expect(isValidRut(syntheticRut(index))).toBe(true);
    }
  });

  it('rejects an index out of range', () => {
    expect(() => syntheticRut(-1)).toThrow(RangeError);
    expect(() => syntheticRut(1.5)).toThrow(RangeError);
    expect(() => syntheticRut(10_000_000)).toThrow(RangeError);
  });
});

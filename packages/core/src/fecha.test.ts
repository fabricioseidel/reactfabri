import { describe, expect, it } from 'vitest';
import { compareFechas, fechaISO, isFechaISO } from './fecha.ts';

describe('fechaISO', () => {
  it.each(['2026-01-01', '2026-04-26', '2026-12-31', '2024-02-29', '2000-02-29', '2026-04-30'])(
    'accepts %s',
    (value) => {
      expect(fechaISO(value)).toBe(value);
    },
  );

  it.each([
    '2026-02-29', // not a leap year
    '2100-02-29', // century that is not a leap year
    '2026-02-30',
    '2026-04-31',
    '2026-13-01',
    '2026-00-10',
    '2026-01-00',
    '2026-1-1',
    '26-01-01',
    '01/05/2026',
    '2026-01-01T00:00:00Z',
    '',
  ])('rejects %j', (value) => {
    expect(isFechaISO(value)).toBe(false);
    expect(() => fechaISO(value)).toThrow(RangeError);
  });
});

describe('compareFechas', () => {
  it('orders dates across a change of month and of year', () => {
    expect(compareFechas(fechaISO('2026-01-31'), fechaISO('2026-02-01'))).toBe(-1);
    expect(compareFechas(fechaISO('2026-01-01'), fechaISO('2025-12-31'))).toBe(1);
    expect(compareFechas(fechaISO('2026-04-26'), fechaISO('2026-04-26'))).toBe(0);
  });
});

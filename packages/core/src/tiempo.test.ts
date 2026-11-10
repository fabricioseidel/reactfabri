import { describe, expect, it } from 'vitest';
import { isZonaHoraria, segundos, ZONAS_HORARIAS } from './tiempo.ts';

describe('ZONAS_HORARIAS', () => {
  it.each(ZONAS_HORARIAS)('%s is a zone the runtime knows', (zona) => {
    expect(() => new Intl.DateTimeFormat('es-CL', { timeZone: zona })).not.toThrow();
  });
});

describe('isZonaHoraria', () => {
  it('accepts only the supported zones', () => {
    expect(isZonaHoraria('America/Santiago')).toBe(true);
    expect(isZonaHoraria('Pacific/Easter')).toBe(true);
    expect(isZonaHoraria('America/Caracas')).toBe(false);
    expect(isZonaHoraria('UTC')).toBe(false);
  });
});

describe('segundos', () => {
  it('accepts whole seconds', () => {
    expect(segundos(0)).toBe(0);
    expect(segundos(27_000)).toBe(27_000);
    expect(segundos(-60)).toBe(-60);
  });

  it('rejects fractions of a second', () => {
    expect(() => segundos(0.5)).toThrow(RangeError);
    expect(() => segundos(Number.NaN)).toThrow(RangeError);
  });
});

import { fechaISO } from '@adn-nomina/core';
import { describe, expect, it } from 'vitest';
import {
  defineSerie,
  ParametroSinVigenciaError,
  resolveAt,
  SerieInvalidaError,
  type ParametroVigente,
} from './vigencia.ts';

// Synthetic values and sources: these tests exercise the versioning mechanism,
// not any real legal parameter.
const FUENTE = 'synthetic source for tests';

function vigencia(desde: string, hasta: string | null, valor: number): ParametroVigente<number> {
  return {
    desde: fechaISO(desde),
    hasta: hasta === null ? null : fechaISO(hasta),
    fuente: FUENTE,
    valor,
  };
}

describe('resolveAt', () => {
  // The change of value falls on a change of month, with a gap in March.
  const serie = defineSerie('synthetic', [
    vigencia('2026-01-01', '2026-01-31', 1),
    vigencia('2026-02-01', '2026-02-28', 2),
    vigencia('2026-04-01', null, 3),
  ]);

  it('includes the first and the last day of a period', () => {
    expect(resolveAt(serie, fechaISO('2026-01-01')).valor).toBe(1);
    expect(resolveAt(serie, fechaISO('2026-01-31')).valor).toBe(1);
  });

  it('switches value on the day the next period starts', () => {
    expect(resolveAt(serie, fechaISO('2026-02-01')).valor).toBe(2);
  });

  it('treats a period without end date as still in force', () => {
    expect(resolveAt(serie, fechaISO('2026-04-01')).valor).toBe(3);
    expect(resolveAt(serie, fechaISO('2040-12-31')).valor).toBe(3);
  });

  it('returns the source together with the value', () => {
    expect(resolveAt(serie, fechaISO('2026-02-15')).fuente).toBe(FUENTE);
  });

  it('throws before the first period instead of using the nearest value', () => {
    expect(() => resolveAt(serie, fechaISO('2025-12-31'))).toThrow(ParametroSinVigenciaError);
  });

  it('throws inside a gap between periods', () => {
    expect(() => resolveAt(serie, fechaISO('2026-03-01'))).toThrow(ParametroSinVigenciaError);
    expect(() => resolveAt(serie, fechaISO('2026-03-31'))).toThrow(ParametroSinVigenciaError);
  });
});

describe('defineSerie', () => {
  it('sorts the periods without mutating the input', () => {
    const input = [vigencia('2026-02-01', null, 2), vigencia('2026-01-01', '2026-01-31', 1)];
    const serie = defineSerie('synthetic', input);
    expect(serie.vigencias.map((v) => v.valor)).toEqual([1, 2]);
    expect(input.map((v) => v.valor)).toEqual([2, 1]);
  });

  it('freezes the series', () => {
    const serie = defineSerie('synthetic', [vigencia('2026-01-01', null, 1)]);
    expect(Object.isFrozen(serie)).toBe(true);
    expect(Object.isFrozen(serie.vigencias)).toBe(true);
    expect(Object.isFrozen(serie.vigencias[0])).toBe(true);
  });

  it('accepts a period of a single day', () => {
    const serie = defineSerie('synthetic', [vigencia('2026-01-01', '2026-01-01', 1)]);
    expect(resolveAt(serie, fechaISO('2026-01-01')).valor).toBe(1);
  });

  it('rejects periods that share a day', () => {
    expect(() =>
      defineSerie('synthetic', [
        vigencia('2026-01-01', '2026-02-01', 1),
        vigencia('2026-02-01', null, 2),
      ]),
    ).toThrow(SerieInvalidaError);
  });

  it('rejects an open-ended period followed by another', () => {
    expect(() =>
      defineSerie('synthetic', [vigencia('2026-01-01', null, 1), vigencia('2026-02-01', null, 2)]),
    ).toThrow(SerieInvalidaError);
  });

  it('rejects a period that ends before it starts', () => {
    expect(() => defineSerie('synthetic', [vigencia('2026-02-01', '2026-01-31', 1)])).toThrow(
      SerieInvalidaError,
    );
  });

  it('rejects a period without source', () => {
    expect(() =>
      defineSerie('synthetic', [{ ...vigencia('2026-01-01', null, 1), fuente: '  ' }]),
    ).toThrow(SerieInvalidaError);
  });

  it('rejects an empty series and an empty id', () => {
    expect(() => defineSerie('synthetic', [])).toThrow(SerieInvalidaError);
    expect(() => defineSerie(' ', [vigencia('2026-01-01', null, 1)])).toThrow(SerieInvalidaError);
  });
});

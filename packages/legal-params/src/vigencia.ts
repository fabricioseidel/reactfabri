import { compareFechas, type FechaISO } from '@adn-nomina/core';

/**
 * One value of a legal parameter and the period in which it applies. Legal
 * parameters never live in the calculation code: they are versioned by
 * `desde`, `hasta` and `fuente` (CLAUDE.md rule 5).
 */
export interface ParametroVigente<T> {
  /** First day the value applies (inclusive). */
  readonly desde: FechaISO;
  /** Last day the value applies (inclusive); `null` while no end date is known. */
  readonly hasta: FechaISO | null;
  /** Citation of the official text in /docs/normativa the value was copied from. */
  readonly fuente: string;
  readonly valor: T;
}

export interface SerieParametro<T> {
  readonly id: string;
  /** Sorted by `desde`, without overlaps. */
  readonly vigencias: readonly ParametroVigente<T>[];
}

export class SerieInvalidaError extends Error {
  override readonly name = 'SerieInvalidaError';
}

export class ParametroSinVigenciaError extends Error {
  override readonly name = 'ParametroSinVigenciaError';
}

/**
 * Validates and freezes the history of a parameter. Periods may leave gaps
 * (the value is simply unknown there) but may never overlap.
 */
export function defineSerie<T>(
  id: string,
  vigencias: readonly ParametroVigente<T>[],
): SerieParametro<T> {
  const fail = (reason: string): never => {
    throw new SerieInvalidaError(`Parameter "${id}": ${reason}`);
  };

  if (id.trim() === '') fail('the id is empty');
  if (vigencias.length === 0) fail('it has no periods');

  const sorted = [...vigencias].sort((a, b) => compareFechas(a.desde, b.desde));
  let previous: ParametroVigente<T> | undefined;
  for (const current of sorted) {
    if (current.fuente.trim() === '') {
      fail(`the period from ${current.desde} does not cite its source`);
    }
    if (current.hasta !== null && current.hasta < current.desde) {
      fail(`the period from ${current.desde} ends before it starts`);
    }
    if (previous && (previous.hasta === null || previous.hasta >= current.desde)) {
      fail(`the periods from ${previous.desde} and ${current.desde} overlap`);
    }
    previous = current;
  }

  return Object.freeze({
    id,
    vigencias: Object.freeze(sorted.map((vigencia) => Object.freeze({ ...vigencia }))),
  });
}

/**
 * Value in force on `fecha`. Throws when no period covers the date: a
 * calculation must never fall back to the nearest known value.
 */
export function resolveAt<T>(serie: SerieParametro<T>, fecha: FechaISO): ParametroVigente<T> {
  const found = serie.vigencias.find(
    (vigencia) => vigencia.desde <= fecha && (vigencia.hasta === null || fecha <= vigencia.hasta),
  );
  if (!found) {
    throw new ParametroSinVigenciaError(
      `Parameter "${serie.id}" has no value in force on ${fecha}`,
    );
  }
  return found;
}

import { computeCheckDigit, type Rut } from './rut.ts';

const SYNTHETIC_RUT_BASE = 40_000_000;
const SYNTHETIC_RUT_COUNT = 10_000_000;

/**
 * Deterministic synthetic RUT for tests and fixtures (CLAUDE.md rule 7: never
 * real personal data). The check digit is valid, but nothing guarantees the
 * number is unassigned: never use these to look anyone up.
 */
export function syntheticRut(index: number): Rut {
  if (!Number.isInteger(index) || index < 0 || index >= SYNTHETIC_RUT_COUNT) {
    throw new RangeError(`index must be an integer in [0, ${String(SYNTHETIC_RUT_COUNT)})`);
  }
  const body = String(SYNTHETIC_RUT_BASE + index);
  return `${body}-${computeCheckDigit(body)}` as Rut;
}

import { Decimal as DecimalJs } from 'decimal.js';
import type { Decimal } from './decimal.ts';

declare const clpBrand: unique symbol;

/** Chilean pesos as an integer; never fractional (CLAUDE.md, "Convenciones > Dinero"). */
export type Clp = number & { readonly [clpBrand]: true };

export function clp(value: number): Clp {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`CLP amounts must be safe integers, got ${String(value)}`);
  }
  return value as Clp;
}

export function sumClp(values: readonly Clp[]): Clp {
  return clp(values.reduce<number>((total, value) => total + value, 0));
}

/** `half_up` breaks ties away from zero; `truncate` rounds toward zero. */
export type RoundingMode = 'half_up' | 'half_even' | 'floor' | 'ceil' | 'truncate';

/**
 * Rounding is only allowed where a norm says so, and must be documented
 * (CLAUDE.md, "Convenciones > Dinero"): every conversion to pesos names the
 * norm that mandates it.
 */
export interface RoundingRule {
  readonly mode: RoundingMode;
  /** Citation of the norm that mandates this rounding. */
  readonly fuente: string;
}

const ROUNDING: Record<RoundingMode, DecimalJs.Rounding> = {
  half_up: DecimalJs.ROUND_HALF_UP,
  half_even: DecimalJs.ROUND_HALF_EVEN,
  floor: DecimalJs.ROUND_FLOOR,
  ceil: DecimalJs.ROUND_CEIL,
  truncate: DecimalJs.ROUND_DOWN,
};

export function toClp(amount: Decimal, rule: RoundingRule): Clp {
  if (rule.fuente.trim() === '') {
    throw new TypeError('A rounding rule must cite the norm that mandates it');
  }
  if (!amount.isFinite()) {
    throw new RangeError('Cannot convert a non-finite amount to CLP');
  }
  return clp(amount.toDecimalPlaces(0, ROUNDING[rule.mode]).toNumber());
}

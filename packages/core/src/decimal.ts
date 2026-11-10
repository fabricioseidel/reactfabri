import { Decimal as DecimalJs } from 'decimal.js';

/**
 * Exact decimal arithmetic for UF, UTM and rates; never `float` (CLAUDE.md,
 * "Convenciones > Dinero"). The constructor is a private clone so no other
 * code can change its configuration. Only division can lose digits, and only
 * beyond 40 significant ones.
 */
const ExactDecimal = DecimalJs.clone({
  precision: 40,
  rounding: DecimalJs.ROUND_HALF_UP,
  toExpNeg: -40,
  toExpPos: 40,
});

export type Decimal = DecimalJs;

const DECIMAL_LITERAL = /^-?\d+(?:\.\d+)?$/;

/**
 * Builds an exact decimal from a plain literal (`'0.07'`), a safe integer or a
 * bigint. A non-integer JS number is already a float, so it is rejected: pass
 * decimals as strings.
 */
export function decimal(value: string | number | bigint): Decimal {
  if (typeof value === 'bigint') return new ExactDecimal(value.toString());
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value)) {
      throw new TypeError('Only safe integers are accepted as numbers; pass decimals as strings');
    }
    return new ExactDecimal(value);
  }
  if (!DECIMAL_LITERAL.test(value)) {
    throw new TypeError(`Not a plain decimal literal: ${JSON.stringify(value)}`);
  }
  return new ExactDecimal(value);
}

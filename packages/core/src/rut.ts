declare const rutBrand: unique symbol;

/**
 * Normalized RUT/RUN: body without dots or leading zeros, a hyphen and the
 * check digit in upper case, e.g. `12345678-5`. This is the form we store
 * (CLAUDE.md, "Convenciones > RUT/RUN").
 */
export type Rut = string & { readonly [rutBrand]: true };

export type RutParseResult =
  | { readonly ok: true; readonly rut: Rut }
  | { readonly ok: false; readonly error: 'formato' | 'digito_verificador' };

export class InvalidRutError extends Error {
  override readonly name = 'InvalidRutError';
}

// Body either plain or with thousands dots, optional hyphen, check digit.
const RUT_PATTERN = /^(\d{1,3}(?:\.\d{3})+|\d+)-?([\dkK])$/;

// Technical bound, not a legal one: issued numbers have at most 8 digits.
const MAX_BODY_DIGITS = 9;

/**
 * Check digit by modulo 11: digits are weighted right to left with the
 * repeating factors 2..7; 11 maps to `0` and 10 to `K`.
 */
export function computeCheckDigit(body: string): string {
  if (!/^\d+$/.test(body)) {
    throw new TypeError('RUT body must contain digits only');
  }
  let sum = 0;
  let factor = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += (body.charCodeAt(i) - 48) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const result = 11 - (sum % 11);
  if (result === 11) return '0';
  if (result === 10) return 'K';
  return String(result);
}

export function parseRut(input: string): RutParseResult {
  const match = RUT_PATTERN.exec(input.trim());
  if (!match) return { ok: false, error: 'formato' };

  const [, rawBody = '', rawCheckDigit = ''] = match;
  const body = rawBody.replaceAll('.', '').replace(/^0+/, '');
  if (body === '' || body.length > MAX_BODY_DIGITS) return { ok: false, error: 'formato' };

  const checkDigit = rawCheckDigit.toUpperCase();
  if (computeCheckDigit(body) !== checkDigit) return { ok: false, error: 'digito_verificador' };

  return { ok: true, rut: `${body}-${checkDigit}` as Rut };
}

export function isValidRut(input: string): boolean {
  return parseRut(input).ok;
}

/** Returns the stored form of a RUT, or throws if it is not valid. */
export function normalizeRut(input: string): Rut {
  const result = parseRut(input);
  if (!result.ok) {
    // The input is not echoed: error messages end up in logs and a RUT is personal data.
    throw new InvalidRutError(`Invalid RUT (${result.error})`);
  }
  return result.rut;
}

/** Display form with thousands dots, e.g. `12.345.678-5`. */
export function formatRut(rut: Rut): string {
  const [body = '', checkDigit = ''] = rut.split('-');
  return `${body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${checkDigit}`;
}

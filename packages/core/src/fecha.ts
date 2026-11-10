declare const fechaBrand: unique symbol;

/**
 * Calendar date `YYYY-MM-DD`, with no time or zone. Lexicographic order is
 * chronological order, so these compare without touching `Date` or the clock.
 */
export type FechaISO = string & { readonly [fechaBrand]: true };

const FECHA_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function daysInMonth(year: number, month: number): number {
  if (month === 2) {
    const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return leap ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export function isFechaISO(value: string): value is FechaISO {
  const match = FECHA_PATTERN.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month);
}

export function fechaISO(value: string): FechaISO {
  if (!isFechaISO(value)) {
    throw new RangeError(`Not a calendar date in YYYY-MM-DD form: ${JSON.stringify(value)}`);
  }
  return value;
}

export function compareFechas(a: FechaISO, b: FechaISO): -1 | 0 | 1 {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

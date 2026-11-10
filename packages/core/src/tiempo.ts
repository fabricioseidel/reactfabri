/**
 * IANA zones of the workplace. Instants are stored in UTC together with one of
 * these (CLAUDE.md, "Convenciones > Tiempo").
 */
// TODO-LEGAL: tzdata also defines `America/Coyhaique` (Región de Aysén), which
// CLAUDE.md does not list. Confirm whether it must be supported before any
// workplace in that region is registered.
export const ZONAS_HORARIAS = [
  'America/Santiago',
  'America/Punta_Arenas',
  'Pacific/Easter',
] as const;

export type ZonaHoraria = (typeof ZONAS_HORARIAS)[number];

export function isZonaHoraria(value: string): value is ZonaHoraria {
  return (ZONAS_HORARIAS as readonly string[]).includes(value);
}

declare const segundosBrand: unique symbol;

/** Duration in whole seconds; durations are never fractional or rounded. */
export type Segundos = number & { readonly [segundosBrand]: true };

export function segundos(value: number): Segundos {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`Durations must be whole seconds, got ${String(value)}`);
  }
  return value as Segundos;
}

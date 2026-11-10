# @adn-nomina/legal-params

Parámetros legales versionados por vigencia (CLAUDE.md, regla 5). Ningún valor legal vive en
el código de cálculo: se resuelve aquí para la fecha que el cálculo recibe como argumento.

```ts
const serie = defineSerie('id-del-parametro', [
  { desde: fechaISO('AAAA-MM-DD'), hasta: null, fuente: 'cita del texto oficial', valor },
]);
resolveAt(serie, fecha).valor;
```

- `desde` y `hasta` son inclusivos; `hasta: null` es una vigencia sin fecha de término conocida.
- Los períodos no pueden traslaparse. Si ninguna vigencia cubre la fecha, `resolveAt` lanza un
  error: nunca se usa el valor más cercano.
- `fuente` es obligatoria y cita el texto guardado en `/docs/normativa`.

**Aún no hay valores cargados.** Los valores semilla de CLAUDE.md deben reverificarse en la
fuente oficial antes de cargarse.

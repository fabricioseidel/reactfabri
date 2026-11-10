# ADN Nómina Chile

SaaS de remuneraciones y control de asistencia electrónico para empresas en Chile.
El alcance, las reglas de trabajo y los requisitos legales están en [CLAUDE.md](./CLAUDE.md).

## Requisitos

- Node 22 o superior
- pnpm 10

## Comandos

```
pnpm install      instalar dependencias
pnpm test         suite completa
pnpm lint         ESLint
pnpm typecheck    TypeScript estricto
pnpm format       Prettier
```

## Estructura

| Ruta                    | Contenido                                                           | Estado                                |
| ----------------------- | ------------------------------------------------------------------- | ------------------------------------- |
| `packages/core`         | Tipos base: RUT, CLP, decimal, fechas, zonas horarias               | Implementado                          |
| `packages/legal-params` | Parámetros legales versionados por vigencia                         | Mecanismo listo, sin valores cargados |
| `packages/payroll`      | Motor de remuneraciones                                             | Vacío                                 |
| `packages/attendance`   | Motor de asistencia y jornada (código regulado, Res. Ex. N°38/2024) | Vacío                                 |
| `packages/reports`      | Reportes DT, LRE, Previred                                          | Vacío                                 |
| `apps/*`                | Portales y app de marcación                                         | Sin crear                             |
| `docs/normativa`        | Textos oficiales                                                    | Pendiente de descarga                 |
| `docs/cumplimiento`     | Matriz de cumplimiento y subencargados                              | Esqueleto                             |

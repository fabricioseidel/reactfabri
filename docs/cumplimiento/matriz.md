# Matriz de cumplimiento

Artículo → módulo → test → evidencia (CLAUDE.md, regla 6). Se actualiza en el mismo cambio que
implementa el requisito.

Las filas pendientes se copiaron del resumen de CLAUDE.md y sirven solo como lista de trabajo:
antes de implementar cada una, su texto y su artículo se contrastan con el texto oficial en
`/docs/normativa`.

Estados: **Pendiente** (sin código), **En curso**, **Terminado** (cumple la definición de
terminado de CLAUDE.md).

## Asistencia — Res. Ex. N°38/2024 DT

| Fuente                     | Requisito                                                                                                                                 | Módulo | Test | Evidencia | Estado    |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---- | --------- | --------- |
| Res. 38 arts. 6, 16 y 20   | Infraestructura: sin planes gratuitos, más de un servidor o datacenter con réplica y respaldo externo, ningún componente de más de 3 años | —      | —    | —         | Pendiente |
| Res. 38 art. 7 g           | Al menos dos métodos de identificación, uno sin biometría ni datos personales                                                             | —      | —    | —         | Pendiente |
| Res. 38 art. 8             | Hash SHA-256 por marcación con funciones nativas; página pública de verificación                                                          | —      | —    | —         | Pendiente |
| Res. 38 arts. 9 y 10       | Transmisión en línea; modo sin conexión solo excepcional y justificado                                                                    | —      | —    | —         | Pendiente |
| Res. 38 art. 11            | Sello de tiempo                                                                                                                           | —      | —    | —         | Pendiente |
| Res. 38 arts. 12, 13 y 34  | Comprobante automático por correo, con el contenido exigido                                                                               | —      | —    | —         | Pendiente |
| Res. 38 arts. 17 y 22 a 24 | Portal de fiscalización: dominio `.cl`, acceso `@dt.gob.cl`, clave de 5 días, aviso al empleador, log de accesos, aviso de mantenciones   | —      | —    | —         | Pendiente |
| Res. 38 arts. 22.1 y 58 l  | Historial y acceso del trabajador por al menos 5 años                                                                                     | —      | —    | —         | Pendiente |
| Res. 38 arts. 25, 27 y 28  | Reportes obligatorios, con nombre, orden y columnas literales                                                                             | —      | —    | —         | Pendiente |
| Res. 38 art. 26            | Exportación mensual de la nómina de clientes                                                                                              | —      | —    | —         | Pendiente |
| Res. 38 arts. 39 a 41      | Sin marcaciones automáticas de inicio y fin; modificaciones desde el día hábil siguiente, con notificación y 48 horas para oponerse       | —      | —    | —         | Pendiente |
| Res. 38 art. 42            | Sin descuentos diarios automáticos                                                                                                        | —      | —    | —         | Pendiente |
| Res. 38 art. 43            | Ofrecer pago o compensación de horas extra                                                                                                | —      | —    | —         | Pendiente |
| Res. 38 art. 44            | Cálculo al segundo, sin redondeo                                                                                                          | —      | —    | —         | Pendiente |
| Res. 38 art. 45            | Alertas: marcación omitida, exceso de jornada, saldo de compensación, aviso de desconexión                                                | —      | —    | —         | Pendiente |
| Res. 38 art. 47            | Firma electrónica simple y menú mínimo de solicitudes                                                                                     | —      | —    | —         | Pendiente |
| Res. 38 art. 48            | Un solo proveedor de asistencia por empleador                                                                                             | —      | —    | —         | Pendiente |
| Res. 38 art. 52            | App en celular personal con permisos mínimos                                                                                              | —      | —    | —         | Pendiente |
| Res. 38 art. 53            | Geolocalización opcional, solo al marcar, sin bloquear, conservada 5 años                                                                 | —      | —    | —         | Pendiente |
| Res. 38 art. 57            | Prohibición de transferir datos o usarlos para otros fines; reglas de biometría (57.4)                                                    | —      | —    | —         | Pendiente |
| Res. 38 arts. 63 y 69      | Cambios técnicos al módulo certificado exigen nueva autorización                                                                          | —      | —    | —         | Pendiente |
| Res. 38 art. 65 e          | Meta de geolocalización para la certificación                                                                                             | —      | —    | —         | Pendiente |

## Jornada

| Fuente             | Requisito                                                  | Módulo | Test | Evidencia | Estado    |
| ------------------ | ---------------------------------------------------------- | ------ | ---- | --------- | --------- |
| Ley 21.561         | Límites semanales por tramo de vigencia                    | —      | —    | —         | Pendiente |
| CT art. 22 bis     | Ciclos de hasta 4 semanas                                  | —      | —    | —         | Pendiente |
| CT art. 27         | Bandas horarias para padres y madres de menores de 12 años | —      | —    | —         | Pendiente |
| CT art. 22 inc. 2° | Trabajadores excluidos de limitación de jornada            | —      | —    | —         | Pendiente |
| Ley 21.220         | Teletrabajo con derecho a desconexión                      | —      | —    | —         | Pendiente |

## Nómina

| Fuente     | Requisito                                         | Módulo | Test | Evidencia | Estado    |
| ---------- | ------------------------------------------------- | ------ | ---- | --------- | --------- |
| Ley 21.735 | Cotización del empleador con desglose por destino | —      | —    | —         | Pendiente |

## Base técnica

Reglas del proyecto (no artículos legales) de las que dependen los requisitos anteriores.

| Regla (CLAUDE.md)                                             | Módulo                                  | Test                                         | Estado                                    |
| ------------------------------------------------------------- | --------------------------------------- | -------------------------------------------- | ----------------------------------------- |
| RUT/RUN: validar dígito verificador y guardar normalizado     | `packages/core/src/rut.ts`              | `packages/core/src/rut.test.ts`              | Terminado                                 |
| CLP en enteros; todo redondeo cita la norma que lo ordena     | `packages/core/src/dinero.ts`           | `packages/core/src/dinero.test.ts`           | Terminado                                 |
| UF, UTM y tasas en decimal, nunca `float`                     | `packages/core/src/decimal.ts`          | `packages/core/src/decimal.test.ts`          | Terminado                                 |
| Parámetros legales versionados por `desde`, `hasta`, `fuente` | `packages/legal-params/src/vigencia.ts` | `packages/legal-params/src/vigencia.test.ts` | Mecanismo terminado; sin valores cargados |
| Cálculos sin reloj, azar ni red                               | `eslint.config.js`                      | `pnpm lint`                                  | Terminado                                 |
| Solo RUT sintéticos en tests y fixtures                       | `packages/core/src/testing.ts`          | `packages/core/src/rut.test.ts`              | Terminado                                 |
| Zona IANA del lugar de trabajo                                | `packages/core/src/tiempo.ts`           | `packages/core/src/tiempo.test.ts`           | `TODO-LEGAL` abierto: `America/Coyhaique` |

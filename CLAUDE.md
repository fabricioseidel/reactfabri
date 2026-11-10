# CLAUDE.md — ADN Nómina Chile

## Qué estamos construyendo

SaaS de remuneraciones y control de asistencia electrónico para empresas en Chile (foco: pymes de 5 a 50 trabajadores). Es la adaptación chilena de ADN Nómina (Venezuela); la referencia funcional es Workera.

Fases:

1. **Nómina chilena** + integración por API con un sistema de asistencia de terceros ya autorizado por la Dirección del Trabajo (DT).
2. **Módulo propio de asistencia** conforme a la Res. Ex. N°38/2024 de la DT, listo para certificación externa y autorización.
3. Relojes e integraciones. **Biometría fuera del MVP.**

El módulo de asistencia será auditado por una certificadora independiente y fiscalizado por la DT. Cada requisito legal debe poder demostrarse con código, test y evidencia.

## Reglas de trabajo (leer siempre)

1. **No inventes normativa.** Tasas, topes, plazos, columnas de reportes y códigos salen del texto oficial guardado en `/docs/normativa`. Si no está ahí, pregunta antes de implementar.
2. **Este archivo es un resumen, no la norma.** Si hay conflicto, manda el texto oficial.
3. **Cita la fuente.** Toda regla legal lleva en el código y en su test la referencia (`Res. 38 art. 44`, `CT art. 22 bis`, `Ley 21.735`).
4. **Ante ambigüedad, detente.** Marca `TODO-LEGAL:` con la duda concreta y pregúntame. No elijas una interpretación en silencio.
5. **Parámetros legales nunca en el código.** Van en `legal-params`, versionados por vigencia (`desde`, `hasta`, `fuente`).
6. **Mantén la matriz de cumplimiento** en `/docs/cumplimiento/matriz.md`: artículo → módulo → test → evidencia. Actualízala en el mismo cambio que implementa el requisito.
7. **Nunca uses datos personales reales** en desarrollo, tests, fixtures, logs ni prompts. Solo datos sintéticos con RUT válidos generados.
8. **El módulo `attendance` es código regulado.** Tiene versión propia. Una vez certificado, cualquier cambio técnico exige nueva autorización (Res. 38 arts. 63 y 69): no lo modifiques sin mi aprobación explícita.

## Stack (propuesta, ajustar antes de empezar)

- TypeScript estricto de punta a punta; Next.js para portales; PostgreSQL con seguridad a nivel de fila.
- App móvil de marcación (React Native o PWA, por decidir).
- Restricciones legales sobre la infraestructura de producción (Res. 38 arts. 6, 16 y 20):
  - sin planes gratuitos, "trial", "express" ni similares;
  - aplicación y base de datos en más de un servidor o datacenter, con réplica y respaldo externo;
  - ningún componente con versión de más de 3 años.
- Región de datos: Chile o país con nivel adecuado (Ley 21.719 art. 27). No administrar datos productivos desde fuera sin garantías contractuales.

## Estructura

```
/apps/web             portal empresa y trabajador (sin crear aún)
/apps/fiscalizacion   portal para la DT (dominio .cl propio) (sin crear aún)
/apps/mobile          marcación (sin crear aún)
/packages/core        tipos base compartidos: RUT, CLP, decimal, fechas, zonas horarias
/packages/payroll     motor de remuneraciones (funciones puras)
/packages/attendance  motor de asistencia y jornada (funciones puras)
/packages/legal-params parámetros con vigencia
/packages/reports     reportes DT, LRE, Previred
/docs/normativa       textos oficiales (PDF)
/docs/cumplimiento    matriz y evidencias
```

## Comandos

Monorepo con pnpm (Node 22 o superior).

```
pnpm install      instalar dependencias
pnpm test         suite completa (Vitest)
pnpm test:watch   tests en modo observación
pnpm lint         ESLint (incluye las reglas de pureza de los paquetes de cálculo)
pnpm typecheck    TypeScript estricto en todos los paquetes
pnpm format       Prettier
```

`pnpm dev` se define al crear las apps.

## Convenciones

- **Dinero:** CLP en enteros. UF, UTM y tasas con tipo decimal; nunca `float`. Redondeo solo donde la norma lo indica, documentado.
- **Tiempo:** guardar en UTC más la zona IANA del lugar de trabajo (`America/Santiago`, `America/Punta_Arenas`, `Pacific/Easter`). Duraciones en segundos enteros.
- **RUT/RUN:** validar dígito verificador (módulo 11); guardar normalizado.
- **Idioma:** términos de dominio en español (`Marcacion`, `Liquidacion`, `Finiquito`, `Turno`); el resto del código en inglés. Interfaz en español de Chile.
- **Multiempresa:** toda tabla lleva `empresa_id` con aislamiento por fila y tests que prueben que una empresa no ve datos de otra.
- **Cálculos:** funciones puras, deterministas, sin acceso a red ni reloj; reciben fecha y parámetros como argumentos.

Cómo se aplican en el código:

- `@adn-nomina/core` entrega los tipos: `Clp` y `toClp` (todo redondeo exige citar la norma), `decimal`, `Rut`, `FechaISO`, `ZonaHoraria`, `Segundos`.
- Los RUT de tests y fixtures salen de `syntheticRut` (`@adn-nomina/core/testing`).
- ESLint prohíbe reloj, azar y red en los paquetes de cálculo.

## Asistencia: requisitos de la Res. Ex. N°38/2024

Marcaciones:

- Registro inmutable (solo inserción). Las correcciones son eventos nuevos.
- Hash SHA-256 por marcación, con funciones nativas, y página pública para verificar un comprobante por su hash (art. 8).
- Transmisión en línea a la base central; modo sin conexión solo excepcional y justificado (arts. 9 y 10). Sello de tiempo (art. 11).
- Al menos dos métodos de identificación, uno sin biometría ni datos personales (art. 7 g).
- Prohibido automatizar las marcaciones de inicio y fin de jornada (arts. 39 a 41).
- Cálculo al segundo, sin redondeo (art. 44). Sin descuentos diarios automáticos (art. 42). Ofrecer pago o compensación de horas extra (art. 43).

Comprobante (arts. 12, 13 y 34):

- Automático, por correo personal del trabajador, desde cuenta no nominativa, imprimible, con copia a la EST si aplica. No SMS.
- Contenido: fecha `dd/mm/aa`, hora `hh:mm:ss`, nombre, RUN, sistema excepcional si aplica, geolocalización (opcional), hash, razón social y RUT del empleador, lugar de prestación de servicios.

Modificaciones (arts. 39 a 41):

- Solo desde el día hábil siguiente y sin perjuicio para el trabajador.
- Notificación por correo; 48 horas para oponerse; sin oposición, se consolida. Todo queda trazado.

Alertas (art. 45):

- Marcación omitida a los 30 minutos.
- Jornada que excede el límite legal.
- Saldo de compensación cada 30 días.
- Aviso de desconexión 30 minutos antes para teletrabajo.

Portal de fiscalización (arts. 17 y 22 a 24):

- Único por prestador, dominio `.cl`, TLS 1.2 o superior, 24/7, sin plugins, responsivo.
- Acceso del fiscalizador solo con correo `@dt.gob.cl` y clave que vence a los 5 días.
- Aviso automático al empleador en cada acceso.
- Log de accesos: fecha, hora, correo, RUT e IP.
- Aviso de mantenciones con 2 días hábiles de anticipación.

Reportes obligatorios (arts. 25, 27 y 28):

- Asistencia; jornada diaria; domingos y festivos (hasta 24 meses); modificaciones de turnos; reporte diario al empleador; incidentes técnicos.
- Exportables a Excel, PDF y Word; Arial tamaño 8 como máximo; abreviaturas oficiales.
- **Nombre, orden y columnas son fijos: copiarlos literalmente del texto de la resolución.**

Otros:

- Documentos con firma electrónica simple y menú mínimo de solicitudes: feriado, permisos, compensación, cambio de turno (art. 47).
- Geolocalización opcional: solo al marcar, nunca bloquea la marcación, se conserva 5 años (art. 53). Meta de certificación: posición en 3 minutos o menos y error menor a 30 m en el 95% de las marcaciones (art. 65 e).
- App en celular personal: permisos mínimos indispensables (art. 52).
- Historial y acceso del trabajador por al menos 5 años (arts. 22.1 y 58 l).
- Exportación mensual de la nómina de clientes para informar a la DT (art. 26).
- Un solo proveedor de asistencia por empleador (art. 48).

Jornada que el motor debe soportar:

- Ley 21.561: 42 h semanales desde el 26-04-2026 y 40 h desde el 26-04-2028.
- Ciclos de hasta 4 semanas (CT art. 22 bis); distribución en 4 a 6 días.
- Bandas horarias para padres y madres de menores de 12 años (CT art. 27).
- Sistemas excepcionales, mostrando el número de resolución.
- Trabajadores excluidos de limitación de jornada (CT art. 22 inc. 2°).
- Teletrabajo con derecho a desconexión (Ley 21.220).

## Nómina chilena

Alcance del motor:

- Liquidación de sueldo: haberes imponibles y no imponibles, descuentos legales y voluntarios.
- AFP, salud (Fonasa o Isapre con plan en UF), seguro de cesantía, SIS, mutual Ley 16.744, CCAF.
- Cotización del empleador de la Ley 21.735, con desglose por destino.
- Impuesto Único de Segunda Categoría (tabla mensual del SII en UTM).
- Gratificación legal, horas extra, feriado, finiquito.
- Salidas: Libro de Remuneraciones Electrónico (CSV/TXT separado por `;`, con el diccionario de códigos de la DT), archivo de carga Previred, DJ 1887.
- Contratos, anexos y finiquitos con firma electrónica (Ley 19.799).

Valores semilla (verificados a noviembre de 2026; **reverificar en fuente oficial antes de cargar**):

| Parámetro | Valor | Vigencia |
|---|---|---|
| Ingreso mínimo mensual | $553.553 | Desde 01-05-2026 (Ley 21.830) |
| Tope imponible AFP, salud, accidentes | 90 UF | 2026 |
| Tope imponible seguro de cesantía | 135,2 UF | Desde febrero de 2026 |
| AFP trabajador | 10% + comisión de la AFP | — |
| Salud | 7% | — |
| Seguro de cesantía trabajador (indefinido) | 0,6% | — |
| Cotización empleador Ley 21.735 | 3,5% (0,1% a cuenta individual; resto al FAPP, que financia el SIS de 1,78%) | Agosto 2026 a julio 2027; 4,25% desde agosto 2027; 8,5% en 2033 |
| Gratificación legal | 25%, tope 4,75 ingresos mínimos al año | — |

- UF: usar el valor del último día del mes.
- Todo lo demás (seguro de cesantía del empleador, tasa de mutual, comisiones por AFP, tabla de impuesto único, UF y UTM): cargar desde la fuente oficial, nunca de memoria.

## Datos personales (Ley 19.628 y Ley 21.719)

- Rol: el empleador cliente es responsable del tratamiento; nosotros somos encargado. Solo tratamos datos según sus instrucciones.
- Prohibido transferir datos a terceros o usarlos para fines ajenos al control de asistencia (Res. 38 art. 57). Sin analítica ni entrenamiento con datos de trabajadores.
- Minimización: no pedir ni guardar datos que el requisito no exija.
- Funciones para ejercer derechos: acceso, rectificación, supresión, oposición, portabilidad y bloqueo.
- Registro de auditoría de todo acceso y cambio sobre datos personales.
- Cifrado en tránsito y en reposo; secretos fuera del repositorio.
- Lista de subencargados (nube, correo) en `/docs/cumplimiento/subencargados.md`.
- Procedimiento de detección y reporte de vulneraciones.
- Biometría (cuando se aborde): consentimiento escrito, alternativa no biométrica siempre disponible, eliminación a solicitud y destrucción entre 90 y 120 días tras el término del contrato (Res. 38 art. 57.4).

## Pendientes por confirmar con abogado (no asumir)

- Plazo de carga del LRE: dos fuentes oficiales difieren (día 15 del mes siguiente vs. 15 días hábiles). Dejarlo parametrizable.
- Vigencia de la Ley 21.719: planificar con el 01-12-2026; hay un proyecto de postergación aún no promulgado.
- Alcance exacto de la destrucción de datos a los 90–120 días frente a la conservación de registros por 5 años.
- Si la Ley 21.663 de ciberseguridad nos califica como servicio esencial.
- Texto de contratos de encargo y consentimientos.

## Definición de terminado

Un requisito está terminado cuando:

1. tiene tests con casos reales de borde (cambio de mes, feriados, turnos nocturnos, cambio de hora, tope imponible);
2. cita su artículo en código y test;
3. está en la matriz de cumplimiento con su evidencia;
4. pasa lint, typecheck y la suite completa;
5. no deja ningún `TODO-LEGAL` sin haberme consultado.

## Normativa base

- Res. Ex. N°38/2024 DT: https://www.diariooficial.interior.gob.cl/publicaciones/2024/05/09/43846/01/2489163.pdf
- Res. Ex. N°2000-9453/2025 DT: https://www.diariooficial.interior.gob.cl/publicaciones/2025/04/25/44133/01/2637353.pdf
- Código del Trabajo (arts. 5, 22, 22 bis, 27, 33, 62, 154 bis, 506), Leyes 21.561, 21.220, 21.735, 21.719, 19.799: descargar desde bcn.cl/leychile a `/docs/normativa`.

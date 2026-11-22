# Planes de tareas · PomodoroKnight

Cada checkbox de [TODO.md](../../TODO.md) tiene un ID estable y un plan individual. Las notas y subtareas sin checkbox permanecen dentro del plan de su tarea principal.

## Convenciones

- IDs iniciales: `PK-001` a `PK-098`, asignados según el orden original del TODO. No renumerarlos al mover tareas ni reutilizar IDs retirados.
- Próximo ID libre: `PK-099`. Para nuevas tareas, asignar el siguiente ID libre, crear su plan y añadir ambos enlaces. Al dividir una tarea, conservar el ID original y asignar nuevos IDs a las nuevas tareas.
- `TODO.md` es la única fuente de estado: redactar o verificar un plan no marca su checkbox. Los planes con checkbox `[x]` se guardan en [`completed/`](completed/); los demás permanecen aquí. Esa ubicación refleja el estado del TODO, no es una verificación independiente de la implementación.
- Cada plan contiene objetivo, alcance, dependencias, pasos y aceptación. Las dependencias ordenan el trabajo, pero un checkbox histórico no sustituye comprobar sus garantías actuales.
- Las rutas nuevas/propuestas y las acciones descritas son planes, no implementaciones. La configuración remota de GitHub requiere comprobación con acceso autorizado.
- El foco actual es V2: el agente cloud ya se ha ejecutado en el repositorio. Los workflows CLI de V1 están archivados en `.github/v1/`; sus planes se conservan para una posible reanudación. Los experimentos pendientes deben verificarse en su propia superficie. Los temas sin checkbox del apartado de teoría no se han convertido en tareas nuevas.

## Relevo: siguiente trabajo V2 cloud

**Decisión del usuario:** centrarse en V2. No reactivar ni ampliar los workflows V1; sus YAML se conservan en `.github/v1/`, junto con sus planes para una posible reanudación. Los agentes, instrucciones y la CLI local no se han eliminado. PK-049–050 siguen aplicando al deploy existente.

**Estado al relevo:** hay cambios locales sin commit en `feat/cicd-agentic-v2`. Incluyen el setup cloud en `.github/workflows/copilot-setup-steps.yml`, el archivo de los dos workflows V1 y documentación actualizada. Inspeccionar `git status` y `git diff` antes de actuar y preservar estos cambios. Nada de esto se ha publicado; en la rama predeterminada los workflows V1 pueden seguir activos, incluido el cron semanal. No se ha eliminado ningún secreto.

**Orden y criterios:**

1. Revisar los cambios locales, incluidos los archivos nuevos no mostrados por `git diff` sin argumentos. Abrir/publicar el PR y fusionarlo solo con autorización y revisión humana; no saltarse los checks. Después confirmar en GitHub que el setup está en la rama predeterminada y los workflows V1 ya no están allí.
2. Ejecutar [PK-065](PK-065.md): crear una issue pequeña de contenido, asignar Copilot y registrar sesión, PR y evidencia de que se ejecutó el nuevo setup. Probar `blacksmith` si la superficie lo permite; no asumir que está seleccionado.
3. En el mismo PR pedir una modificación con `@copilot`, revisar el resultado y, si GitHub lo requiere y un usuario autorizado lo aprueba, ejecutar los workflows. Verificar los checks del resultado final y documentar la recuperación/permisos. Recoger enlaces y limitaciones en [docs/cloud-agent-lab.md](../cloud-agent-lab.md); no hacer auto-merge.
4. Ejecutar [PK-066](PK-066.md) después del lab básico: verificar documentación vigente de MCP y Agents secrets, usar una credencial temporal de mínimo privilegio, probar con y sin ella y revocarla. Nunca registrar valores secretos.
5. Mantener sin completar los checkboxes hasta tener evidencia y confirmación del usuario. Si una interacción requiere acceso, aprobación o intervención humana que el agente no tiene, describir el bloqueo y pedir ayuda; no simular el resultado.

**Validación local realizada:** `npm ci`, lint, 24 tests, validación de sprites y build pasaron con Node 26 en Windows, no en el runner cloud Node 22. `prettier --check . --end-of-line auto` pasó; `npm run format:check` falló por los finales de línea CRLF del checkout. `npm ci` notificó siete vulnerabilidades moderadas en dependencias de desarrollo. Comprobar de nuevo si cambian los archivos; una ejecución local no demuestra que Actions o el setup cloud funcionen.

## Orden para issue → CLI → PR si se retoma V1

1. Endurecer el flujo manual: [scope completo](PK-047.md), [aislamiento](PK-046.md), [contrato de validación](PK-048.md) y [required checks del PR](PK-045.md).
2. Completar también [procedencia de deploy](PK-049.md) y [frescura/rollback](PK-050.md), respetando el bloqueo de revisión prioritaria indicado en el TODO.
3. Implementar [seguridad de entrada](PK-059.md) antes de habilitar [issue → PR y selección de perfil](PK-057.md).
4. Añadir [feedback](PK-058.md), [resúmenes](PK-060.md), [recuperación](PK-061.md) y ejecutar el [lab V1](PK-062.md).

## Índice por área

### Phase 0 · Foundations

| ID                  | Plan                              |
| ------------------- | --------------------------------- |
| [PK-001](completed/PK-001.md) | Base Vite y TypeScript            |
| [PK-002](completed/PK-002.md) | Ruta base de Pages                |
| [PK-003](completed/PK-003.md) | Vitest y prueba inicial           |
| [PK-004](completed/PK-004.md) | ESLint y Prettier                 |
| [PK-005](completed/PK-005.md) | Validador determinista de sprites |
| [PK-006](completed/PK-006.md) | CI de validación y build          |
| [PK-007](completed/PK-007.md) | Publicación inicial en Pages      |

### Phase 0.5 · Mastering GitHub Actions 🎓 [D2][D4][D5]

| ID                  | Plan                       |
| ------------------- | -------------------------- |
| [PK-008](completed/PK-008.md) | Eventos de CI              |
| [PK-009](completed/PK-009.md) | Permisos mínimos de CI     |
| [PK-010](completed/PK-010.md) | Grafo de jobs de CI        |
| [PK-011](completed/PK-011.md) | Matriz de Node para tests  |
| [PK-012](completed/PK-012.md) | Cancelación de CI obsoleta |
| [PK-013](completed/PK-013.md) | Outputs entre jobs         |
| [PK-014](completed/PK-014.md) | Artefacto de build         |
| [PK-015](completed/PK-015.md) | Resumen de sprites         |
| [PK-016](completed/PK-016.md) | Caché npm                  |
| [PK-017](completed/PK-017.md) | Encadenamiento CI a deploy |
| [PK-018](completed/PK-018.md) | Permisos de Pages          |
| [PK-019](completed/PK-019.md) | Environment y URL de Pages |
| [PK-020](completed/PK-020.md) | Serialización de Pages     |
| [PK-021](completed/PK-021.md) | Descarga del artefacto CI  |
| [PK-022](completed/PK-022.md) | Convenciones de workflows  |
| [PK-023](completed/PK-023.md) | Laboratorio de contextos   |

### Phase 1 · MVP

| ID                  | Plan                         |
| ------------------- | ---------------------------- |
| [PK-024](completed/PK-024.md) | Timer Pomodoro 25/5          |
| [PK-025](completed/PK-025.md) | Dígitos ASCII                |
| [PK-026](completed/PK-026.md) | Barra de progreso ASCII      |
| [PK-027](completed/PK-027.md) | Persistencia local defensiva |
| [PK-028](completed/PK-028.md) | Estilo retro-terminal        |

### Phase 1.5 · Copilot customization [D1][D2]

| ID                  | Plan                                 |
| ------------------- | ------------------------------------ |
| [PK-029](completed/PK-029.md) | Instrucciones generales de Copilot   |
| [PK-030](completed/PK-030.md) | Instrucciones específicas de sprites |
| [PK-031](completed/PK-031.md) | Prompt reutilizable de revisión      |
| [PK-032](completed/PK-032.md) | Skill de validación de sprites       |
| [PK-033](completed/PK-033.md) | Revisor de sprites de solo lectura   |
| [PK-034](completed/PK-034.md) | Blacksmith especializado             |
| [PK-035](completed/PK-035.md) | Agente orquestador                   |

### Phase 2 · CI/CD and repo governance 🎓 [D2][D4][D6]

| ID                  | Plan                               |
| ------------------- | ---------------------------------- |
| [PK-036](completed/PK-036.md) | Ruleset de main                    |
| [PK-037](completed/PK-037.md) | Nombres legibles de ejecuciones    |
| [PK-038](completed/PK-038.md) | Condicionales de Actions           |
| [PK-039](completed/PK-039.md) | Notificación de fallo de deploy    |
| [PK-040](completed/PK-040.md) | Workflow reusable de Pages         |
| [PK-041](completed/PK-041.md) | Aprobación humana del environment  |
| [PK-042](completed/PK-042.md) | Escaneo y revisión de dependencias |
| [PK-043](PK-043.md) | Laboratorio de secretos GitHub     |
| [PK-044](completed/PK-044.md) | Laboratorio de queue max           |

### Priority follow-up · Workflow review [D2][D4][D6]

| ID                  | Plan                                                |
| ------------------- | --------------------------------------------------- |
| [PK-045](PK-045.md) | Required checks en el PR publicado                  |
| [PK-046](PK-046.md) | Aislamiento de generación, validación y publicación |
| [PK-047](PK-047.md) | Scope determinista del cambio completo              |
| [PK-048](PK-048.md) | Contrato común de validación                        |
| [PK-049](PK-049.md) | Procedencia del artefacto de deploy                 |
| [PK-050](PK-050.md) | Frescura de deploy y rollback                       |

### Phase 3 · Native Copilot: CLI in Actions and multi-agent [D2][D3][D5]

| ID                  | Plan                                       |
| ------------------- | ------------------------------------------ |
| [PK-051](completed/PK-051.md) | Perfil coding-agent en CLI                 |
| [PK-052](completed/PK-052.md) | Restricciones de herramientas CLI          |
| [PK-053](completed/PK-053.md) | Publicación de un cambio como PR           |
| [PK-054](completed/PK-054.md) | Resumen semanal con CLI                    |
| [PK-055](completed/PK-055.md) | Práctica local de Copilot CLI              |
| [PK-056](completed/PK-056.md) | Inspección de sesiones y logs              |
| [PK-057](PK-057.md) | Issue autorizada a PR con perfil permitido |
| [PK-058](PK-058.md) | Feedback en el mismo PR                    |
| [PK-059](PK-059.md) | Seguridad de entrada issue/comment         |
| [PK-060](PK-060.md) | Resumen trazable de tareas                 |
| [PK-061](PK-061.md) | Recuperación de tareas fallidas            |
| [PK-062](PK-062.md) | Laboratorio V1 extremo a extremo           |
| [PK-063](completed/PK-063.md) | Preparación del setup del agente cloud     |
| [PK-064](completed/PK-064.md) | Plantillas reutilizables de issues         |
| [PK-065](PK-065.md) | Laboratorio del agente cloud               |
| [PK-066](PK-066.md) | Secretos MCP del agente cloud              |
| [PK-067](PK-067.md) | Laboratorio de frontmatter de agentes      |
| [PK-068](PK-068.md) | Auditor de solo lectura                    |
| [PK-069](PK-069.md) | MCP local y HTTP                           |
| [PK-070](PK-070.md) | MCP autenticado en V1                      |
| [PK-071](PK-071.md) | Riesgo de deploy y aprobación asistida     |
| [PK-072](PK-072.md) | Pipeline review audit consolidate          |
| [PK-073](PK-073.md) | Matriz de agentes                          |

### Phase 4 · Guardrails and hooks [D4][D6]

| ID                  | Plan                            |
| ------------------- | ------------------------------- |
| [PK-074](PK-074.md) | Hook contra git push del agente |
| [PK-075](PK-075.md) | Semántica de hooks y permisos   |
| [PK-076](PK-076.md) | Mapa de payloads de hooks       |
| [PK-077](PK-077.md) | Hook de scope para Blacksmith   |
| [PK-078](PK-078.md) | Resumen de sesión con hooks     |
| [PK-079](PK-079.md) | Incidentes controlados          |

### Phase 5 · Game features

| ID                  | Plan                                   |
| ------------------- | -------------------------------------- |
| [PK-080](PK-080.md) | XP por pomodoro completado             |
| [PK-081](PK-081.md) | Curva de niveles basada en datos       |
| [PK-082](PK-082.md) | Cinco sprites de caballero tomate      |
| [PK-083](PK-083.md) | Invalidación por pestaña o pausa larga |

### Phase 6 · Agentic workflows (gh-aw) and agent-generated content

| ID                  | Plan                             |
| ------------------- | -------------------------------- |
| [PK-084](PK-084.md) | Instalación y motor de gh-aw     |
| [PK-085](PK-085.md) | Triage de issues con gh-aw       |
| [PK-086](PK-086.md) | CI Doctor con gh-aw              |
| [PK-087](PK-087.md) | Lectura del YAML compilado gh-aw |
| [PK-088](PK-088.md) | Blacksmith con comando forge     |
| [PK-089](PK-089.md) | Preview de sprites en PR         |

### Phase 7 · Extras

| ID                  | Plan                              |
| ------------------- | --------------------------------- |
| [PK-090](PK-090.md) | Skill y prompt locales para Pi    |
| [PK-091](PK-091.md) | Decisión sobre previews por PR    |
| [PK-092](PK-092.md) | Decisión sobre backend y cuentas  |
| [PK-093](PK-093.md) | Decisión sobre mecánicas de juego |

### Phase 8 · Loose ends from completed phases

| ID                  | Plan                                               |
| ------------------- | -------------------------------------------------- |
| [PK-094](PK-094.md) | Documentación de workflows reales                  |
| [PK-095](PK-095.md) | CI educativo frente a operativo                    |
| [PK-096](PK-096.md) | Utilidad del resumen semanal                       |
| [PK-097](PK-097.md) | Responsabilidades de instrucciones, skill y prompt |
| [PK-098](PK-098.md) | AGENTS.md como fuente compartida                   |

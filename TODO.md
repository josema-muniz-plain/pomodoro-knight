# TODO · PomodoroKnight

> Las etiquetas **[D1]–[D6]** indican qué dominio del examen GH-600 practica cada tarea (ver [README](./README.md#-mapa-gh-600)).
> Las tareas marcadas con 🎓 existen principalmente para aprender sintaxis o conceptos del examen.

## Fase 0 · Fundaciones
- [ ] Scaffold Vite + TypeScript (vanilla)
- [ ] Configurar `base: '/pomodoro-knight/'` en `vite.config.ts`
- [ ] Configurar Vitest con un test de ejemplo
- [ ] Lint + formato (ESLint + Prettier)
- [ ] Script `validate:sprites` (dimensiones máx. 24×10, solo ASCII imprimible, cabecera válida)
- [ ] Workflow CI: lint + test + validate:sprites + build
- [ ] Workflow de deploy a GitHub Pages (Source: GitHub Actions)

## Fase 0.5 · Dominar GitHub Actions 🎓 [D2][D4][D5]
Objetivo: escribir y **saber leer** cada clave sin mirar la documentación.

### CI (`.github/workflows/ci.yml`)
- [ ] Triggers: `push` a `main`, `pull_request` y `workflow_dispatch`
- [ ] `permissions: contents: read` a nivel de workflow (mínimo privilegio)
- [ ] Jobs separados `lint`, `test`, `validate-sprites` y `build`, con `needs` para que `build` espere a los demás
- [ ] `strategy.matrix` en `test` con varias versiones de Node (`[20, 22]`) y `fail-fast: false`
- [ ] `concurrency` con `group: ${{ github.workflow }}-${{ github.head_ref || github.run_id }}` y `cancel-in-progress: true`
- [ ] Job output: `validate-sprites` publica el nº de sprites vía `$GITHUB_OUTPUT` → `jobs.<id>.outputs` → lo lee `build` con `needs.<id>.outputs.<x>`
- [ ] `build` sube `dist/` con `actions/upload-artifact` (`retention-days`, `if-no-files-found: error`)
- [ ] Escribir un resumen en `$GITHUB_STEP_SUMMARY` (tabla de sprites validados)
- [ ] Usar caché de npm con `actions/setup-node` (`cache: npm`)

### Deploy (`.github/workflows/deploy.yml`)
- [ ] Trigger `workflow_run` (cuando CI termina en `main`) o `push` a `main`
- [ ] `permissions`: `pages: write`, `id-token: write`, `contents: read`
- [ ] `environment: github-pages` con URL de salida (`steps.<id>.outputs.page_url`)
- [ ] Añadir *required reviewer* al environment para practicar aprobaciones manuales [D6]
- [ ] `concurrency: group: pages` con `cancel-in-progress: false` (y entender por qué es distinto al de CI)
- [ ] Descargar el artifact de build con `actions/download-artifact`

### Laboratorio (`.github/workflows/actions-lab.yml`) 🎓
- [ ] `workflow_dispatch` con `inputs` de tipos `string`, `boolean` y `choice`
- [ ] Imprimir contextos: `github.ref`, `ref_name`, `head_ref`, `base_ref`, `sha`, `run_id`, `run_number`, `run_attempt`, `actor`, `triggering_actor`, `workflow`
- [ ] Comparar su valor en `push`, `pull_request` y en un *re-run* (anotar resultados en `docs/actions-contexts.md`)
- [ ] `actions/checkout` con `ref: ${{ github.head_ref }}` vs. checkout por defecto en un PR
- [ ] Condicionales `if:` con `success()`, `failure()`, `always()` y `contains()`
- [ ] Workflow reutilizable con `on: workflow_call` (inputs + secrets + outputs) e invocarlo desde CI

## Fase 1 · MVP
- [ ] Timer Pomodoro 25/5 (start / pause / reset)
- [ ] Dígitos grandes en ASCII para el timer
- [ ] Barra de progreso ASCII
- [ ] Sistema de XP por pomodoro completado
- [ ] Curva de niveles en `levels.json`
- [ ] 5 sprites del tomate (uno por nivel) en `.txt`
- [ ] Persistencia en `localStorage`
- [ ] Anti-trampas: invalidar pomodoro al cambiar de pestaña o pausar demasiado
- [ ] Fuente monoespaciada y estilo retro-terminal

## Fase 1.5 · Personalización de Copilot [D1][D2]
- [ ] `.github/copilot-instructions.md` (stack, comandos, reglas del ASCII art)
- [ ] `.github/instructions/sprites.instructions.md` con `applyTo: "sprites/**"`
- [ ] `AGENTS.md` en la raíz
- [ ] Prompt reutilizable `.github/prompts/review-sprite.prompt.md`
- [ ] Skill `.github/skills/validate-sprite/SKILL.md`
- [ ] Agente `sprite-reviewer.agent.md` → `tools: [read, search]` (solo lectura)
- [ ] Agente `herrero.agent.md` → `tools: [read, search, edit, execute]`
- [ ] Agente `orchestrator.agent.md` → `tools: [read, search, agent]`
- [ ] Protección de `main` con ruleset: PR obligatorio + checks de CI requeridos [D6]

## Fase 2 · Primeros agentic workflows (gh-aw)
> gh-aw **no entra en GH-600**, pero compila a Actions: revisar el `.lock.yml` generado es buena práctica de lectura de YAML.
- [ ] Instalar gh-aw y configurar el engine (secret)
- [ ] Workflow Issue Triage
- [ ] Workflow CI Doctor
- [ ] Plantillas de issues (bug / contenido / feature)
- [ ] 🎓 Leer el `.lock.yml` de cada workflow e identificar `permissions`, jobs de `safe-outputs` y `concurrency`

## Fase 3 · Contenido generado por agentes
- [ ] Workflow Herrero `/forge` (genera sprite + abre PR)
- [ ] Workflow Sprite Preview (comenta el sprite en el PR)

## Fase 3.5 · Copilot nativo: CLI, cloud agent y multi-agente [D2][D3][D5]
- [ ] Herrero "nativo": workflow con `copilot -p --agent=herrero --no-ask-user` y `COPILOT_GITHUB_TOKEN`
- [ ] Limitar herramientas en CI con `--allow-tool` / `--deny-tool`
- [ ] `.github/workflows/copilot-setup-steps.yml` (job `copilot-setup-steps`: Node + `npm ci`)
- [ ] Asignar un issue de contenido al cloud agent y practicar: **View session**, `@copilot` en el PR, **Approve and run workflows**
- [ ] Pipeline `review` + `audit` → `consolidate` con `needs` y artifacts
- [ ] Variante con `strategy.matrix.agent: [sprite-reviewer, auditor]`
- [ ] MCP: añadir un servidor `local` (command/args) y otro `http` (url) a un agente; probar `server/tool` vs `server/*`
- [ ] 🎓 Práctica local del CLI: `/plan`, `/delegate`, `/fleet`, `--resume`, `--continue`, `--autopilot`
- [ ] 🎓 Inspeccionar `~/.copilot/logs/` y `~/.copilot/session-state/<id>/events.jsonl` (sesión nueva vs. reanudada)

## Fase 3.75 · Guardrails y hooks [D4][D6]
- [ ] `.github/hooks/policy.json` con `preToolUse` + `matcher: "bash"` que deniegue `git push`
- [ ] Hook que deniegue `edit`/`create` fuera de `sprites/` para el Herrero
- [ ] Hook `postToolUse` / `sessionEnd` que registre un resumen de la sesión
- [ ] Activar secret scanning + push protection, CodeQL y dependency review
- [ ] 🎓 Provocar fallos a propósito (artifact inexistente, `E401` en npm, push directo bloqueado) y documentar causa raíz + fix en `docs/incidents.md`

## Fase 4 · Extras
- [ ] Workflow Crónica semanal en tono épico (`schedule` con cron) [D2]
- [ ] Valorar preview deploys por PR (`pr-preview-action` / Netlify / Cloudflare)
- [ ] Valorar backend y cuentas de usuario
- [ ] Valorar mecánicas más allá de lo estético (combates contra la Procrastinación 👹)

## Fuera del alcance del repo (estudiar en teoría) 📚
- Políticas MCP de organización/enterprise (registry, allowlist)
- Audit log de organización (`artifact.destroy`, `actor`, `@timestamp`)
- Copilot SDK (`createSession`, `resumeSession`, `onPreToolUse`)
- Lab guiado: [gh-600-lab-instructions](https://github.com/sameeraman/gh-600-lab-instructions)

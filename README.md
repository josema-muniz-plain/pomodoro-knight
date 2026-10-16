# 🍅⚔️ PomodoroKnight

> Concéntrate. Completa pomodoros. Forja a tu caballero tomate.

**PomodoroKnight** es una web de sesiones Pomodoro donde cada sesión completada hace más fuerte a tu personaje: un **tomate caballero** dibujado íntegramente en **ASCII**.

```
       \|/                       \|/                      _/^\_
     .-'''-.                   .-'''-.                   |[===]|
    /  o o  \                 /  o o  \       |          .-'''-.      |
   |    ^    |               |    ^    |      |         / |o o| \     |
    \  '-'  /               [#]  '-'  /     --+--      [#]  ^  |=====o
     '-----'                 \'-----'                   \ '-' /       |
                                                         '---'
  Nivel 1 · Tomatito        Nivel 3 · Escudero        Nivel 5 · Caballero
```

## 🎯 Propósito real del proyecto

La app es la excusa. El objetivo es **practicar [GitHub Agentic Workflows (gh-aw)](https://github.com/github/gh-aw)** en un repo diseñado para que los agentes tengan trabajo real:

- Contenido **data-driven** (sprites `.txt`, niveles en JSON) → cada aportación es un PR pequeño y revisable.
- ASCII → todo es texto, **diffeable** y generable por agentes.
- Tests + validación de sprites en CI → feedback automático y fallos que diagnosticar.

Además, sirve de **laboratorio para la certificación [GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-600)**. El examen es muy práctico (leer YAML, JSON, logs y configuración de agentes), así que cada tema se practica con un artefacto real del repo. Ver [Mapa GH-600](#-mapa-gh-600).

## 🧩 Funcionalidad (MVP)

- Timer Pomodoro 25/5.
- Cada pomodoro completado otorga **XP**.
- Al subir de **nivel**, el tomate evoluciona visualmente (solo estética, por ahora).
- Progreso guardado en `localStorage` (sin backend ni cuentas).
- Anti-trampas básico: cambiar de pestaña o pausar demasiado invalida el pomodoro.
- UI 100% ASCII: dígitos grandes, barras de progreso `[#####.....]`, marcos.

## 🛠️ Stack

| Pieza | Elección |
|---|---|
| Build | [Vite](https://vitejs.dev/) |
| Lenguaje | TypeScript (vanilla, sin framework) |
| Tests | [Vitest](https://vitest.dev/) |
| Deploy | GitHub Pages vía GitHub Actions |
| Agentes | [gh-aw](https://github.com/github/gh-aw) |

## 🎨 Reglas del ASCII art

1. **Grid fijo**: los sprites miden como máximo **24 columnas × 10 filas**.
2. **Solo ASCII imprimible** en sprites (sin emojis: rompen el alineado).
3. **Fuente monoespaciada** fija cargada en la web.
4. Sprites en archivos **`.txt`** con cabecera de metadatos (nivel, nombre).
5. Todo se valida con `npm run validate:sprites` en CI.

## 🤖 Agentic workflows previstos

| Workflow | Trigger | Qué hace |
|---|---|---|
| **Issue Triage** | `issues: opened` | Etiqueta (bug / contenido / feature) y pide info si falta |
| **CI Doctor** | `workflow_run` fallido | Analiza logs y propone fix |
| **Herrero** `/forge` | Comando en issue | Genera un sprite nuevo y abre un PR |
| **Sprite Preview** | `pull_request` | Comenta el sprite renderizado en el PR |
| **Crónica semanal** | `schedule` | Resumen de la semana en tono épico |

## 🎓 Mapa GH-600

> gh-aw **no entra** en el examen. Por eso el repo combina gh-aw con las piezas nativas de Copilot (agentes, CLI, cloud agent, hooks).

| Dominio | Peso | Dónde se practica en el repo |
|---|---:|---|
| **D1** Arquitectura y SDLC | 15–20% | Flujo issue → rama → PR → checks → review; agentes con distinta autonomía |
| **D2** Herramientas y entorno | 20–25% | `.github/workflows/*` (CI, deploy, lab), `.github/agents/*.agent.md`, MCP, `copilot -p`, `copilot-setup-steps.yml` |
| **D3** Memoria y estado | 10–15% | Sesiones del Copilot CLI (`--resume`, `session-state`), handoffs vía artifacts y PRs |
| **D4** Evaluación y tuning | 15–20% | Fallos provocados + `docs/incidents.md`, artifacts, `$GITHUB_STEP_SUMMARY` |
| **D5** Multi-agente | 15–20% | Pipeline review/audit/consolidate, `matrix.agent`, `concurrency` |
| **D6** Guardrails | 10–15% | Rulesets, environments con aprobación, hooks `preToolUse`, CodeQL, secret scanning |

Estructura objetivo de `.github/`:

```text
.github/
├── copilot-instructions.md
├── instructions/sprites.instructions.md
├── prompts/review-sprite.prompt.md
├── skills/validate-sprite/SKILL.md
├── agents/{sprite-reviewer,herrero,orchestrator}.agent.md
├── hooks/policy.json
└── workflows/
    ├── ci.yml                    # needs, matrix, outputs, artifacts, concurrency
    ├── deploy.yml                # environments, permissions de Pages
    ├── actions-lab.yml           # contextos, inputs, if:, workflow_call
    ├── copilot-setup-steps.yml   # entorno del cloud agent
    └── *.md / *.lock.yml         # workflows gh-aw
```

Guía de estudio de referencia: [GH-600 Public Study Guide](https://gist.github.com/naim149/a8aa41c7468685b7d984822c38863aae).

## 🚀 Desarrollo

```bash
npm install
npm run dev               # servidor local
npm test                  # tests
npm run validate:sprites  # valida los sprites ASCII
npm run build             # build de producción
```

> Desplegado en `https://<usuario>.github.io/pomodoro-knight/` (requiere `base: '/pomodoro-knight/'` en `vite.config.ts`).

## 🗺️ Roadmap

Ver [TODO.md](./TODO.md).

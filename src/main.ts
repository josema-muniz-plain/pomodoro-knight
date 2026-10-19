import './style.css';
// Vite inlined el .txt como string: el sprite vive en datos, no en el código.
import knightSpriteRaw from '../sprites/level-1.txt?raw';
import { renderBigTime } from './big-digits';
import { createPomodoroState, pause, reset, start, tick } from './pomodoro';
import type { Phase, PomodoroState } from './pomodoro';
import { renderProgressBar } from './progress-bar';
import { parseSprite } from './sprite';
import { loadPomodoroState, savePomodoroState } from './storage';

const PHASE_LABELS: Record<Phase, string> = {
  work: '⚔ TRABAJO',
  break: '☕ DESCANSO',
};

const warrior = parseSprite(knightSpriteRaw);

const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
    <main class="terminal">
      <header>
        <h1>🍅⚔️ PomodoroKnight</h1>
        <p class="muted">Concéntrate. Completa pomodoros. Forja a tu caballero tomate.</p>
      </header>
      <section class="panel">
        <div id="phase" class="phase"></div>
        <pre id="clock" class="clock" aria-label="Tiempo restante"></pre>
        <p class="bar-line"><span id="bar" class="bar"></span> <span id="pct" class="muted"></span></p>
        <pre id="knight" class="sprite" aria-label="Tomate caballero"></pre>
        <p id="name" class="muted"></p>
        <p id="stats"></p>
        <div class="controls">
          <button id="btn-start" type="button">INICIAR</button>
          <button id="btn-pause" type="button">PAUSAR</button>
          <button id="btn-reset" type="button">REINICIAR</button>
        </div>
        <p class="muted">25 min de trabajo · 5 de descanso · progreso guardado en localStorage</p>
      </section>
    </main>
  `;
  initApp(app);
}

function query<T extends Element>(root: HTMLElement, selector: string): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Falta el elemento ${selector}`);
  return el;
}

/**
 * Al recargar la página no se reanuda "en marcha": si estaba running,
 * se restaura en pausa para decidir conscientemente cuándo seguir.
 */
function restoreState(): PomodoroState {
  const saved = loadPomodoroState(window.localStorage);
  if (!saved) return createPomodoroState();
  return saved.status === 'running' ? { ...saved, status: 'paused' } : saved;
}

function clockText(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function initApp(root: HTMLElement): void {
  const phaseEl = query<HTMLDivElement>(root, '#phase');
  const clockEl = query<HTMLPreElement>(root, '#clock');
  const barEl = query<HTMLSpanElement>(root, '#bar');
  const pctEl = query<HTMLSpanElement>(root, '#pct');
  const statsEl = query<HTMLParagraphElement>(root, '#stats');
  const btnStart = query<HTMLButtonElement>(root, '#btn-start');
  const btnPause = query<HTMLButtonElement>(root, '#btn-pause');
  const btnReset = query<HTMLButtonElement>(root, '#btn-reset');

  query<HTMLPreElement>(root, '#knight').textContent = warrior.body;
  const spriteName = warrior.headers.name ?? 'Caballero';
  const spriteLevel = warrior.headers.level ? ` · Nivel ${warrior.headers.level}` : '';
  query<HTMLParagraphElement>(root, '#name').textContent = `${spriteName}${spriteLevel}`;

  const storage = window.localStorage;
  let state = restoreState();
  let lastPhase = state.phase;

  const render = (): void => {
    clockEl.textContent = renderBigTime(state.remaining);
    const fraction = state.total > 0 ? (state.total - state.remaining) / state.total : 0;
    barEl.textContent = renderProgressBar(fraction, 20);
    pctEl.textContent = `${Math.round(fraction * 100)}%`;
    phaseEl.textContent = PHASE_LABELS[state.phase];
    statsEl.textContent = `🍅 Pomodoros completados: ${state.completedPomodoros}`;
    document.title = `${clockText(state.remaining)} · ${state.phase} · PomodoroKnight`;
    btnStart.disabled = state.status === 'running';
    btnPause.disabled = state.status !== 'running';
    btnReset.disabled = state.status === 'idle';
    if (state.phase !== lastPhase) {
      lastPhase = state.phase;
      clockEl.classList.add('flash');
      window.setTimeout(() => clockEl.classList.remove('flash'), 1200);
    }
  };

  const commit = (next: PomodoroState): void => {
    state = next;
    savePomodoroState(storage, state);
    render();
  };

  btnStart.addEventListener('click', () => commit(start(state)));
  btnPause.addEventListener('click', () => commit(pause(state)));
  btnReset.addEventListener('click', () => commit(reset(state)));

  window.setInterval(() => {
    if (state.status !== 'running') return;
    commit(tick(state));
  }, 1000);

  render();
}

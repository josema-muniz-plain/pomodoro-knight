/**
 * Lógica pura del timer Pomodoro (sin DOM ni temporizadores).
 * Todas las funciones devuelven un estado nuevo; no mutan nada.
 */

export type Phase = 'work' | 'break';
export type Status = 'idle' | 'running' | 'paused';

export interface PomodoroState {
  phase: Phase;
  status: Status;
  /** Segundos restantes de la fase actual. */
  remaining: number;
  /** Duración total de la fase actual, en segundos. */
  total: number;
  /** Pomodoros (sesiones de trabajo) completados. */
  completedPomodoros: number;
}

export const WORK_SECONDS = 25 * 60;
export const BREAK_SECONDS = 5 * 60;

export function createPomodoroState(): PomodoroState {
  return {
    phase: 'work',
    status: 'idle',
    remaining: WORK_SECONDS,
    total: WORK_SECONDS,
    completedPomodoros: 0,
  };
}

/** Pone el timer en marcha (de `idle` o `paused` a `running`). */
export function start(state: PomodoroState): PomodoroState {
  return state.status === 'running' ? state : { ...state, status: 'running' };
}

/** Detiene el timer sin perder el progreso de la fase. */
export function pause(state: PomodoroState): PomodoroState {
  return state.status === 'running' ? { ...state, status: 'paused' } : state;
}

/** Reinicia el ciclo (trabajo, 25:00, en reposo) conservando el contador. */
export function reset(state: PomodoroState): PomodoroState {
  return {
    phase: 'work',
    status: 'idle',
    remaining: WORK_SECONDS,
    total: WORK_SECONDS,
    completedPomodoros: state.completedPomodoros,
  };
}

/** Al agotarse una fase pasa a la siguiente: trabajo → descanso → trabajo. */
function advance(state: PomodoroState): PomodoroState {
  if (state.phase === 'work') {
    return {
      phase: 'break',
      status: state.status,
      remaining: BREAK_SECONDS,
      total: BREAK_SECONDS,
      completedPomodoros: state.completedPomodoros + 1,
    };
  }
  return {
    phase: 'work',
    status: state.status,
    remaining: WORK_SECONDS,
    total: WORK_SECONDS,
    completedPomodoros: state.completedPomodoros,
  };
}

/** Un tick de reloj (1 segundo). Solo descuenta si está en marcha. */
export function tick(state: PomodoroState): PomodoroState {
  if (state.status !== 'running') return state;
  if (state.remaining > 1) return { ...state, remaining: state.remaining - 1 };
  return advance(state);
}

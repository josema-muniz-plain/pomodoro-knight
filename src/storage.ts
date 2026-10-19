/**
 * Persistencia del estado en localStorage, con validación defensiva:
 * si lo guardado está corrupto o incompleto, se arranca de cero.
 */

import type { PomodoroState } from './pomodoro';

const STORAGE_KEY = 'pomodoro-knight:state';

/** Superficie mínima de localStorage, para poder inyectar un doble en tests. */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const PHASES: readonly string[] = ['work', 'break'];
const STATUSES: readonly string[] = ['idle', 'running', 'paused'];

function isPomodoroState(value: unknown): value is PomodoroState {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.phase === 'string' &&
    PHASES.includes(v.phase) &&
    typeof v.status === 'string' &&
    STATUSES.includes(v.status) &&
    typeof v.remaining === 'number' &&
    Number.isFinite(v.remaining) &&
    v.remaining >= 0 &&
    typeof v.total === 'number' &&
    Number.isFinite(v.total) &&
    v.total > 0 &&
    typeof v.completedPomodoros === 'number' &&
    Number.isInteger(v.completedPomodoros) &&
    v.completedPomodoros >= 0
  );
}

export function loadPomodoroState(storage: StorageLike): PomodoroState | null {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return isPomodoroState(parsed) ? parsed : null;
  } catch {
    // JSON corrupto o storage bloqueado: se ignora.
    return null;
  }
}

export function savePomodoroState(storage: StorageLike, state: PomodoroState): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage lleno o bloqueado: la app sigue funcionando sin persistencia.
  }
}

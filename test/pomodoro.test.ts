import { describe, expect, it } from 'vitest';
import {
  BREAK_SECONDS,
  WORK_SECONDS,
  createPomodoroState,
  pause,
  reset,
  start,
  tick,
} from '../src/pomodoro';

describe('Pomodoro', () => {
  it('arranca en trabajo 25:00, en reposo', () => {
    const s = createPomodoroState();
    expect(s.phase).toBe('work');
    expect(s.status).toBe('idle');
    expect(s.remaining).toBe(WORK_SECONDS);
    expect(s.total).toBe(WORK_SECONDS);
    expect(s.completedPomodoros).toBe(0);
  });

  it('start pone en marcha y pause la detiene', () => {
    let s = start(createPomodoroState());
    expect(s.status).toBe('running');
    s = pause(s);
    expect(s.status).toBe('paused');
  });

  it('tick no descuenta si no está en marcha', () => {
    const idle = createPomodoroState();
    expect(tick(idle).remaining).toBe(WORK_SECONDS);
    const paused = { ...idle, status: 'paused' as const };
    expect(tick(paused).remaining).toBe(WORK_SECONDS);
  });

  it('tick descuenta un segundo', () => {
    const s = start(createPomodoroState());
    expect(tick(s).remaining).toBe(WORK_SECONDS - 1);
  });

  it('al terminar el trabajo pasa a descanso y suma un pomodoro', () => {
    let s = start(createPomodoroState());
    for (let i = 0; i < WORK_SECONDS - 1; i++) s = tick(s);
    expect(s.remaining).toBe(1);
    s = tick(s);
    expect(s.phase).toBe('break');
    expect(s.remaining).toBe(BREAK_SECONDS);
    expect(s.total).toBe(BREAK_SECONDS);
    expect(s.completedPomodoros).toBe(1);
    expect(s.status).toBe('running');
  });

  it('al terminar el descanso vuelve al trabajo sin sumar pomodoro', () => {
    let s = start(createPomodoroState());
    for (let i = 0; i < WORK_SECONDS; i++) s = tick(s);
    for (let i = 0; i < BREAK_SECONDS; i++) s = tick(s);
    expect(s.phase).toBe('work');
    expect(s.remaining).toBe(WORK_SECONDS);
    expect(s.completedPomodoros).toBe(1);
  });

  it('reset vuelve al ciclo inicial conservando el contador', () => {
    let s = start(createPomodoroState());
    for (let i = 0; i < WORK_SECONDS; i++) s = tick(s);
    s = reset(s);
    expect(s.phase).toBe('work');
    expect(s.status).toBe('idle');
    expect(s.remaining).toBe(WORK_SECONDS);
    expect(s.completedPomodoros).toBe(1);
  });
});

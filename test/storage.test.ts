import { describe, expect, it } from 'vitest';
import { createPomodoroState, start, tick, WORK_SECONDS } from '../src/pomodoro';
import { loadPomodoroState, savePomodoroState, type StorageLike } from '../src/storage';

function makeStorage(): StorageLike {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
  };
}

function corrupt(storage: StorageLike, value: string): void {
  storage.setItem('pomodoro-knight:state', value);
}

describe('persistencia', () => {
  it('guarda y recupera el estado', () => {
    const storage = makeStorage();
    let s = start(createPomodoroState());
    s = tick(s);
    savePomodoroState(storage, s);
    expect(loadPomodoroState(storage)).toEqual(s);
    expect(loadPomodoroState(storage)?.remaining).toBe(WORK_SECONDS - 1);
  });

  it('sin datos guardados devuelve null', () => {
    expect(loadPomodoroState(makeStorage())).toBeNull();
  });

  it('JSON corrupto devuelve null', () => {
    const storage = makeStorage();
    corrupt(storage, '{oops');
    expect(loadPomodoroState(storage)).toBeNull();
  });

  it('estado inválido (enums o rangos) devuelve null', () => {
    const storage = makeStorage();
    corrupt(
      storage,
      '{"phase":"work","status":"volando","remaining":10,"total":1500,"completedPomodoros":0}',
    );
    expect(loadPomodoroState(storage)).toBeNull();
    corrupt(
      storage,
      '{"phase":"work","status":"running","remaining":-5,"total":0,"completedPomodoros":1.5}',
    );
    expect(loadPomodoroState(storage)).toBeNull();
  });
});

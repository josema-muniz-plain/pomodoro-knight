import { describe, it, expect } from 'vitest';

describe(' Vitest está configurado', () => {
  it('ejecuta aserciones básicas', () => {
    expect(1 + 1).toBe(2);
  });

  it('maneja arrays', () => {
    expect([1, 2, 3].filter((n) => n > 1)).toEqual([2, 3]);
  });
});

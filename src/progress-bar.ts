/**
 * Barra de progreso ASCII, p. ej. `[#####.....]`.
 * `fraction` es el progreso (0 = vacía, 1 = llena); se recorta al rango [0, 1].
 */

export function renderProgressBar(fraction: number, width = 20, filled = '#', empty = '.'): string {
  const clamped = Math.min(1, Math.max(0, fraction));
  const filledCount = Math.round(clamped * width);
  return `[${filled.repeat(filledCount)}${empty.repeat(width - filledCount)}]`;
}

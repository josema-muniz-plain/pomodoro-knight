/**
 * Dígitos grandes en ASCII: fuente de 7 segmentos de 5 filas × 3 columnas.
 * Ejemplo con "25":
 *   ### ###      ###  ###
 *   # # # #      # #  # #
 *   # # ###      # #  ###
 *   # # # #      # ## # #
 *   # # ###      ## #####
 */

const GLYPHS: Record<string, string[]> = {
  '0': ['###', '# #', '# #', '# #', '###'],
  '1': [' # ', ' # ', ' # ', ' # ', ' # '],
  '2': ['###', '  #', '###', '#  ', '###'],
  '3': ['###', '  #', '###', '  #', '###'],
  '4': ['# #', '# #', '###', '  #', '  #'],
  '5': ['###', '#  ', '###', '  #', '###'],
  '6': ['###', '#  ', '###', '# #', '###'],
  '7': ['###', '  #', '  #', '  #', '  #'],
  '8': ['###', '# #', '###', '# #', '###'],
  '9': ['###', '# #', '###', '  #', '###'],
  ':': [' ', '#', ' ', '#', ' '],
};

/** Filas del glifo de un carácter; blanco de 5 filas si no existe. */
export function glyphRows(char: string): string[] {
  return GLYPHS[char] ?? [' ', ' ', ' ', ' ', ' '];
}

/** Renderiza unos segundos como "MM:SS" con dígitos grandes (una línea por fila). */
export function renderBigTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const text = `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const rows = ['', '', '', '', ''];
  for (const char of text) {
    const glyph = glyphRows(char);
    for (let i = 0; i < 5; i++) rows[i] += (rows[i] ? ' ' : '') + glyph[i];
  }
  return rows.join('\n');
}

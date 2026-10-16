/**
 * Parseo de sprites `.txt`: cabecera de metadatos (`# key: value`) + cuerpo ASCII.
 * Sigue las mismas reglas que `scripts/validate-sprites.mjs`.
 */

export interface Sprite {
  headers: Record<string, string>;
  body: string;
}

const HEADER_RE = /^#\s*([A-Za-z_][\w]*)\s*:\s*(.*)$/;

export function parseSprite(raw: string): Sprite {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const headers: Record<string, string> = {};
  let i = 0;
  while (i < lines.length) {
    const match = HEADER_RE.exec(lines[i]);
    if (!match) break;
    headers[match[1].toLowerCase()] = match[2].trim();
    i++;
  }
  const bodyLines = lines.slice(i);
  // Recorta líneas vacías de los bordes (no del medio, que sí cuentan como filas).
  while (bodyLines.length && bodyLines[0].trim() === '') bodyLines.shift();
  while (bodyLines.length && bodyLines[bodyLines.length - 1].trim() === '') bodyLines.pop();
  return { headers, body: bodyLines.join('\n') };
}

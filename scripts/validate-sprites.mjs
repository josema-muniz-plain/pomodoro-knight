#!/usr/bin/env node
/**
 * validate-sprites: valida los sprites ASCII del juego.
 *
 * Reglas (ver README §🎨 Reglas del ASCII art):
 *   - Cabecera de metadatos: líneas `# key: value` al inicio del archivo.
 *     Claves obligatorias: `level` (entero ≥ 1) y `name` (no vacío).
 *   - Cuerpo (sprite): como máximo 24 columnas × 10 filas.
 *   - Solo caracteres ASCII imprimibles (0x20–0x7E). Sin emojis ni tabuladores.
 *   - Un sprite por nivel (sin niveles duplicados entre archivos).
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SPRITES_DIR = join(ROOT, 'sprites');
const MAX_WIDTH = 24;
const MAX_HEIGHT = 10;
const HEADER_RE = /^#\s*([A-Za-z_][\w]*)\s*:\s*(.*)$/;
// Solo ASCII imprimible: espacio (0x20) hasta '~' (0x7E).
const PRINTABLE = /^[\x20-\x7e]*$/;

function listSpriteFiles() {
  if (!existsSync(SPRITES_DIR)) {
    return { ok: false, reason: `directorio no encontrado: ${SPRITES_DIR}` };
  }
  const files = readdirSync(SPRITES_DIR)
    .filter((f) => f.endsWith('.txt'))
    .sort();
  return { ok: true, files };
}

function parseSprite(path) {
  const raw = readFileSync(path, 'utf8').replace(/\r\n/g, '\n').split('\n');
  const headers = {};
  let i = 0;
  while (i < raw.length) {
    const match = HEADER_RE.exec(raw[i]);
    if (!match) break;
    headers[match[1].toLowerCase()] = match[2].trim();
    i++;
  }
  let body = raw.slice(i);
  // Recorta líneas vacías de los bordes (no del medio, que sí cuentan como filas).
  while (body.length && body[0].trim() === '') body.shift();
  while (body.length && body[body.length - 1].trim() === '') body.pop();
  return { headers, body };
}

function validateSprite(file) {
  const path = join(SPRITES_DIR, file);
  const { headers, body } = parseSprite(path);
  const errors = [];

  const levelRaw = headers.level;
  const name = headers.name;
  if (levelRaw === undefined) errors.push('falta la cabecera "level"');
  if (!name) errors.push('falta la cabecera "name"');
  const level = Number(levelRaw);
  if (levelRaw !== undefined && (!Number.isInteger(level) || level < 1)) {
    errors.push(`"level" inválido: "${levelRaw}" (debe ser un entero ≥ 1)`);
  }

  if (body.length === 0) errors.push('sprite vacío (sin cuerpo)');
  if (body.length > MAX_HEIGHT) {
    errors.push(`demasiadas filas: ${body.length} > ${MAX_HEIGHT}`);
  }

  let width = 0;
  for (const row of body) {
    if (!PRINTABLE.test(row)) {
      errors.push(`carácter no imprimible (ASCII) en: ${JSON.stringify(row)}`);
    }
    // El ancho se mide sin el espacio en blanco final (es invisible).
    width = Math.max(width, row.replace(/\s+$/, '').length);
  }
  if (width > MAX_WIDTH) errors.push(`demasiado ancho: ${width} > ${MAX_WIDTH}`);

  return { file, level, name, width, height: body.length, errors };
}

const list = listSpriteFiles();
if (!list.ok) {
  console.error(`✗ ${list.reason}`);
  process.exit(1);
}
if (list.files.length === 0) {
  console.error('✗ no se encontraron sprites (.txt) en sprites/');
  process.exit(1);
}

const results = list.files.map(validateSprite);

// Comprueba niveles duplicados entre sprites.
const byLevel = new Map();
for (const r of results) {
  if (!Number.isInteger(r.level)) continue;
  const prev = byLevel.get(r.level);
  if (prev) {
    r.errors.push(`nivel duplicado: ${r.level} (ya estaba en ${prev})`);
  } else {
    byLevel.set(r.level, r.file);
  }
}

const valid = results.filter((r) => r.errors.length === 0);
const invalid = results.filter((r) => r.errors.length > 0);

for (const r of results) {
  const tag = r.errors.length === 0 ? '✓' : '✗';
  const meta = `"${r.name ?? '?'}" (nivel ${r.level ?? '?'}) ${r.width}×${r.height}`;
  console.log(`${tag} ${r.file} — ${meta}`);
  for (const e of r.errors) console.log(`    · ${e}`);
}
console.log(
  `\nValidados ${results.length} sprite(s): ${valid.length} OK, ${invalid.length} con errores.`,
);

if (invalid.length > 0) process.exit(1);

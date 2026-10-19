import { describe, expect, it } from 'vitest';
import { glyphRows, renderBigTime } from '../src/big-digits';
import { renderProgressBar } from '../src/progress-bar';
import { parseSprite } from '../src/sprite';

describe('big digits', () => {
  it('fuente de 7 segmentos correcta', () => {
    expect(glyphRows('0')).toEqual(['###', '# #', '# #', '# #', '###']);
    expect(glyphRows('1')).toEqual([' # ', ' # ', ' # ', ' # ', ' # ']);
    expect(glyphRows('4')).toEqual(['# #', '# #', '###', '  #', '  #']);
    expect(glyphRows(':')).toEqual([' ', '#', ' ', '#', ' ']);
  });

  it('renderiza MM:SS en 5 líneas del mismo ancho', () => {
    const lines = renderBigTime(25 * 60).split('\n');
    expect(lines).toHaveLength(5);
    const width = lines[0].length;
    for (const line of lines) expect(line.length).toBe(width);
  });

  it('renderiza 12:34 componiendo los glifos con un espacio', () => {
    const lines = renderBigTime(12 * 60 + 34).split('\n');
    const glyphs = ['1', '2', ':', '3', '4'].map(glyphRows);
    for (let row = 0; row < 5; row++) {
      const expected = glyphs.map((g) => g[row]).join(' ');
      expect(lines[row]).toBe(expected);
    }
  });

  it('renderiza cero segundos como 00:00', () => {
    const lines = renderBigTime(0).split('\n');
    expect(lines[0]).toBe('### ###   ### ###');
    expect(lines[2]).toBe('# # # #   # # # #');
    // Fila de los dos puntos: 9 almohadillas (4 dígitos ×2 + 1 del ':').
    expect(lines[1].match(/#/g)).toHaveLength(9);
  });
});

describe('progress bar', () => {
  it('vacía al inicio y llena al final', () => {
    expect(renderProgressBar(0, 10)).toBe('[..........]');
    expect(renderProgressBar(1, 10)).toBe('[##########]');
  });

  it('mitad exacta', () => {
    expect(renderProgressBar(0.5, 10)).toBe('[#####.....]');
  });

  it('recorta fracciones fuera de rango', () => {
    expect(renderProgressBar(-3, 5)).toBe('[.....]');
    expect(renderProgressBar(2, 5)).toBe('[#####]');
  });
});

describe('parseSprite', () => {
  it('extrae cabeceras y el cuerpo por separado', () => {
    const raw = '# level: 1\n# name: Tomatito\n\n  o  \n /|\\ \n  |  \n';
    const sprite = parseSprite(raw);
    expect(sprite.headers).toEqual({ level: '1', name: 'Tomatito' });
    expect(sprite.body).toBe('  o  \n /|\\ \n  |  ');
  });

  it('sin cabeceras devuelve todo el texto', () => {
    expect(parseSprite('x\ny').body).toBe('x\ny');
  });

  it('recorta líneas vacías de los bordes', () => {
    expect(parseSprite('# a: 1\n\nart\n\n\n').body).toBe('art');
  });

  it('la cabecera solo cuenta si empieza en la primera línea', () => {
    const sprite = parseSprite('\n# a: 1\nart');
    expect(sprite.headers).toEqual({});
    expect(sprite.body).toBe('# a: 1\nart');
  });
});

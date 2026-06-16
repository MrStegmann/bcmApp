export interface Point {
  x: number;
  y: number;
}

// Calcula la distancia perpendicular de un punto a una línea
const perpendicularDistance = (pt: Point, lineStart: Point, lineEnd: Point): number => {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;

  // Si la línea es un punto
  if (dx === 0 && dy === 0) {
    return Math.hypot(pt.x - lineStart.x, pt.y - lineStart.y);
  }

  const length = Math.hypot(dx, dy);
  return Math.abs(dy * pt.x - dx * pt.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x) / length;
};

// Algoritmo de Douglas-Peucker para simplificar trazados
export const simplifyPath = (points: Point[], epsilon: number): Point[] => {
  if (points.length <= 2) {
    return points;
  }

  let dmax = 0;
  let index = 0;
  const end = points.length - 1;

  for (let i = 1; i < end; i++) {
    const d = perpendicularDistance(points[i], points[0], points[end]);
    if (d > dmax) {
      index = i;
      dmax = d;
    }
  }

  if (dmax > epsilon) {
    const recResults1 = simplifyPath(points.slice(0, index + 1), epsilon);
    const recResults2 = simplifyPath(points.slice(index), epsilon);

    return recResults1.slice(0, -1).concat(recResults2);
  } else {
    return [points[0], points[end]];
  }
};

// Genera una línea ondulada a partir de un trazado
export const createWavyPath = (points: Point[], amplitude = 5, wavelength = 15): Point[] => {
  if (points.length < 2) return points;

  const wavyPoints: Point[] = [];
  
  // Calcular la longitud total de cada segmento
  let totalLength = 0;
  const segments = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i+1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy);
    segments.push({ p1, p2, len, dx, dy, nx: -dy / len, ny: dx / len });
    totalLength += len;
  }

  const stopWaveDistance = 25; // Parar la onda antes de la punta de flecha
  
  let currentDist = 0;
  for (const seg of segments) {
    if (seg.len === 0) continue;
    
    // Resolución de pasos para la onda (en píxeles)
    const step = 2; 
    
    for (let d = 0; d < seg.len; d += step) {
      if (currentDist + d > totalLength - stopWaveDistance) {
        // Trayectoria recta (sin onda)
        wavyPoints.push({
          x: seg.p1.x + (seg.dx * (d / seg.len)),
          y: seg.p1.y + (seg.dy * (d / seg.len))
        });
      } else {
        // Efecto ondulado usando el vector normal
        const t = currentDist + d;
        const waveOffset = Math.sin((t / wavelength) * Math.PI * 2) * amplitude;
        
        wavyPoints.push({
          x: seg.p1.x + (seg.dx * (d / seg.len)) + (seg.nx * waveOffset),
          y: seg.p1.y + (seg.dy * (d / seg.len)) + (seg.ny * waveOffset)
        });
      }
    }
    currentDist += seg.len;
  }
  
  // Añadir el punto final exacto
  wavyPoints.push(points[points.length - 1]);
  
  return wavyPoints;
};

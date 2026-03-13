export default function getDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

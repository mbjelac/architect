export function shade(color: string | undefined, factor: number): [number, number, number] {
  if (!color) {
    const gray = Math.round(160 * factor);
    return [gray, gray, gray];
  }
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return [
    Math.round(r * factor),
    Math.round(g * factor),
    Math.round(b * factor),
  ];
}

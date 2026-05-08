import p5 from "p5";
import {BLOCK_SIZE} from "../constants";
import {shade} from "./shade";

export function drawPyramid(p: p5, sides: number, color?: string) {
  const h = BLOCK_SIZE / 2;
  const floorY = -(BLOCK_SIZE * 0.15) / 2;
  const apexY = floorY - BLOCK_SIZE;
  const apex: [number, number, number] = [0, apexY, 0];

  const vertices: [number, number, number][] = [];
  for (let i = 0; i < sides; i++) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / sides;
    vertices.push([h * Math.cos(angle), floorY, h * Math.sin(angle)]);
  }

  // Base
  p.fill(...shade(color, 1.0));
  p.beginShape();
  for (const v of vertices) {
    p.vertex(...v);
  }
  p.endShape(p.CLOSE);

  // Side faces
  for (let i = 0; i < sides; i++) {
    const factor = 0.875 - (i * 0.25) / sides;
    p.fill(...shade(color, factor));
    p.beginShape();
    p.vertex(...vertices[i]);
    p.vertex(...vertices[(i + 1) % sides]);
    p.vertex(...apex);
    p.endShape(p.CLOSE);
  }
}

import p5 from "p5";
import {BLOCK_SIZE} from "../constants";

export function drawPyramid3(p: p5) {
  const h = BLOCK_SIZE / 2;
  const floorY = -(BLOCK_SIZE * 0.15) / 2;
  const apexY = floorY - BLOCK_SIZE;
  const r = h;

  const angle0 = -Math.PI / 2;
  const angle1 = angle0 + (2 * Math.PI) / 3;
  const angle2 = angle0 + (4 * Math.PI) / 3;

  const v0: [number, number, number] = [r * Math.cos(angle0), floorY, r * Math.sin(angle0)];
  const v1: [number, number, number] = [r * Math.cos(angle1), floorY, r * Math.sin(angle1)];
  const v2: [number, number, number] = [r * Math.cos(angle2), floorY, r * Math.sin(angle2)];
  const apex: [number, number, number] = [0, apexY, 0];

  p.fill(160, 160, 160);

  // Base
  p.beginShape();
  p.vertex(...v0);
  p.vertex(...v1);
  p.vertex(...v2);
  p.endShape(p.CLOSE);

  // Side faces
  p.fill(140, 140, 140);
  p.beginShape();
  p.vertex(...v0);
  p.vertex(...v1);
  p.vertex(...apex);
  p.endShape(p.CLOSE);

  p.fill(120, 120, 120);
  p.beginShape();
  p.vertex(...v1);
  p.vertex(...v2);
  p.vertex(...apex);
  p.endShape(p.CLOSE);

  p.fill(100, 100, 100);
  p.beginShape();
  p.vertex(...v2);
  p.vertex(...v0);
  p.vertex(...apex);
  p.endShape(p.CLOSE);
}

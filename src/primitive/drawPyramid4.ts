import p5 from "p5";
import {BLOCK_SIZE} from "../constants";

export function drawPyramid4(p: p5) {
  const h = BLOCK_SIZE / 2;
  const floorY = -(BLOCK_SIZE * 0.15) / 2;
  const apexY = floorY - BLOCK_SIZE;

  const v0: [number, number, number] = [ h, floorY,  h];
  const v1: [number, number, number] = [-h, floorY,  h];
  const v2: [number, number, number] = [-h, floorY, -h];
  const v3: [number, number, number] = [ h, floorY, -h];
  const apex: [number, number, number] = [0, apexY, 0];

  p.fill(160, 160, 160);

  // Base
  p.beginShape();
  p.vertex(...v0);
  p.vertex(...v1);
  p.vertex(...v2);
  p.vertex(...v3);
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
  p.vertex(...v3);
  p.vertex(...apex);
  p.endShape(p.CLOSE);

  p.fill(110, 110, 110);
  p.beginShape();
  p.vertex(...v3);
  p.vertex(...v0);
  p.vertex(...apex);
  p.endShape(p.CLOSE);
}

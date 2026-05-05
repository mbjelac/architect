import p5 from "p5";
import {BLOCK_SIZE} from "../constants";
import {shade} from "./shade";

export function drawPyramid4(p: p5, color?: string) {
  const h = BLOCK_SIZE / 2;
  const floorY = -(BLOCK_SIZE * 0.15) / 2;
  const apexY = floorY - BLOCK_SIZE;

  const v0: [number, number, number] = [ h, floorY,  h];
  const v1: [number, number, number] = [-h, floorY,  h];
  const v2: [number, number, number] = [-h, floorY, -h];
  const v3: [number, number, number] = [ h, floorY, -h];
  const apex: [number, number, number] = [0, apexY, 0];

  p.fill(...shade(color, 1.0));

  // Base
  p.beginShape();
  p.vertex(...v0);
  p.vertex(...v1);
  p.vertex(...v2);
  p.vertex(...v3);
  p.endShape(p.CLOSE);

  // Side faces
  p.fill(...shade(color, 0.875));
  p.beginShape();
  p.vertex(...v0);
  p.vertex(...v1);
  p.vertex(...apex);
  p.endShape(p.CLOSE);

  p.fill(...shade(color, 0.75));
  p.beginShape();
  p.vertex(...v1);
  p.vertex(...v2);
  p.vertex(...apex);
  p.endShape(p.CLOSE);

  p.fill(...shade(color, 0.625));
  p.beginShape();
  p.vertex(...v2);
  p.vertex(...v3);
  p.vertex(...apex);
  p.endShape(p.CLOSE);

  p.fill(...shade(color, 0.6875));
  p.beginShape();
  p.vertex(...v3);
  p.vertex(...v0);
  p.vertex(...apex);
  p.endShape(p.CLOSE);
}

import p5 from "p5";
import {drawPyramid3} from "./primitive/drawPyramid3";
import {CreateBody} from "./readCommands";
import {BLOCK_SIZE} from "./constants";

export function applyCommands(p: p5, commands: CreateBody[]) {
  for (const command of commands) {
    if (command.type === "pyr3") {
      p.push();
      if (command.translate) {
        const scale = BLOCK_SIZE / 100;
        p.translate(
          command.translate[0] * scale,
          -command.translate[2] * scale,
          command.translate[1] * scale
        );
      }
      if (command.rotate) {
        const toRad = Math.PI / 180;
        p.rotateY(command.rotate[0] * toRad);
        p.rotateX(command.rotate[1] * toRad);
      }
      drawPyramid3(p);
      p.pop();
    }
  }
}

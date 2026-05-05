import {drawPyramid3} from "./primitive/drawPyramid3";

import {BLOCK_SIZE} from "./constants";

export function applyCommands(p, commands) {
  for (const cmd of commands) {
    if (cmd.type === "pyr3") {
      p.push();
      if (cmd.translate) {
        const scale = BLOCK_SIZE / 100;
        p.translate(
          cmd.translate[0] * scale,
          -cmd.translate[2] * scale,
          cmd.translate[1] * scale
        );
      }
      drawPyramid3(p);
      p.pop();
    }
  }
}

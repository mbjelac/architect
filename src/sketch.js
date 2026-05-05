import p5 from "p5";
import {drawFloor} from "./drawFloor";
import {readCommands} from "./readCommands";
import {applyCommands} from "./applyCommands";
import {BLOCK_SIZE} from "./constants";

const sketch = (p) => {
  p.setup = () => {
    const container = document.getElementById("canvas-container");
    const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight, p.WEBGL);
    canvas.parent(container);
    p.ortho();
  };

  p.draw = () => {
    p.background(30);
    p.orbitControl();
    p.rotateX(-Math.PI / 4);
    p.rotateY(Math.PI / 4);
    p.stroke(150);
    drawFloor(p, BLOCK_SIZE);

    const commands = readCommands();
    applyCommands(p, commands);
  };
};

new p5(sketch);

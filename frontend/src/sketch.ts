import p5 from "p5";

const sketch = (p: p5) => {
  p.setup = () => {
    const container = document.getElementById("canvas-container")!;
    const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight, p.WEBGL);
    canvas.parent(container);
    p.ortho();

    const camDist = 800;
    const camAngleY = Math.PI / 4;
    const camAngleX = Math.PI / 4;
    const camX = camDist * Math.sin(camAngleY) * Math.cos(camAngleX);
    const camY = -camDist * Math.sin(camAngleX);
    const camZ = camDist * Math.cos(camAngleY) * Math.cos(camAngleX);
    p.camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  };

  p.draw = () => {
    p.background(30);
  };
};

new p5(sketch);

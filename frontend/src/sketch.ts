import p5 from "p5";
import {drawFloor} from "../../shared/drawFloor";
import {BLOCK_SIZE} from "../../shared/constants";
import {initToolbar, getSelectedBuilding} from "./toolbar";
import {Sektor} from "./sektor/Sektor";

const GRID_SIZE = 10;
const sektor = new Sektor();

function screenToGrid(p: p5, mx: number, my: number): { x: number; y: number } | null {
  // Convert screen coords to normalized device coords relative to canvas center
  const cx = mx - p.width / 2;
  const cy = my - p.height / 2;

  // Account for ortho zoom
  const zoom = 1.2;
  const ndcX = (cx / p.width) * 2 * zoom;
  const ndcY = (cy / p.height) * 2 * zoom;

  // Camera parameters (must match setup)
  const camDist = 800;
  const camAngleY = Math.PI / 4;
  const camAngleX = Math.PI / 6;

  // Camera right and up vectors in world space for ortho projection
  // Camera looks from (sin(aY)*cos(aX), -sin(aX), cos(aY)*cos(aX)) toward origin
  const sinY = Math.sin(camAngleY);
  const cosY = Math.cos(camAngleY);
  const sinX = Math.sin(camAngleX);
  const cosX = Math.cos(camAngleX);

  // Right vector (camera X axis) - perpendicular to look direction in XZ plane
  const rightX = cosY;
  const rightZ = -sinY;

  // Up vector (camera Y axis) - cross product of forward and right
  const upX = -sinY * sinX;
  const upY = cosX;
  const upZ = -cosY * sinX;

  // Point on the near plane in world space (ortho: ray origin varies, direction is constant)
  const hw = p.width * zoom / 2;
  const hh = p.height * zoom / 2;
  const worldOffsetX = ndcX * hw;
  const worldOffsetY = ndcY * hh;

  // Ray origin = camera position + right * worldOffsetX + up * worldOffsetY
  const camX = camDist * sinY * cosX;
  const camY = -camDist * sinX;
  const camZ = camDist * cosY * cosX;

  const rayOx = camX + rightX * worldOffsetX + upX * worldOffsetY;
  const rayOy = camY + upY * worldOffsetY;
  const rayOz = camZ + rightZ * worldOffsetX + upZ * worldOffsetY;

  // Ray direction = toward the look target (origin) = normalized(-camX, -camY, -camZ)
  const dirX = -sinY * cosX;
  const dirY = sinX;
  const dirZ = -cosY * cosX;

  // Intersect with Y=0 plane: rayOy + t * dirY = 0
  if (Math.abs(dirY) < 1e-6) return null;
  const t = -rayOy / dirY;
  if (t < 0) return null;

  const worldX = rayOx + t * dirX;
  const worldZ = rayOz + t * dirZ;

  // Convert world coords to grid coords
  const gx = Math.floor(worldX / BLOCK_SIZE + GRID_SIZE / 2);
  const gy = Math.floor(worldZ / BLOCK_SIZE + GRID_SIZE / 2);

  if (gx < 0 || gx >= GRID_SIZE || gy < 0 || gy >= GRID_SIZE) return null;
  return { x: gx, y: gy };
}

const sketch = (p: p5) => {
  p.setup = () => {
    const container = document.getElementById("canvas-container")!;
    const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight, p.WEBGL);
    canvas.parent(container);
    const zoom = 1.2;
    const hw = container.offsetWidth * zoom / 2;
    const hh = container.offsetHeight * zoom / 2;
    p.ortho(-hw, hw, -hh, hh);

    const camDist = 800;
    const camAngleY = Math.PI / 4;
    const camAngleX = Math.PI / 6;
    const camX = camDist * Math.sin(camAngleY) * Math.cos(camAngleX);
    const camY = -camDist * Math.sin(camAngleX);
    const camZ = camDist * Math.cos(camAngleY) * Math.cos(camAngleX);
    p.camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  };

  p.mousePressed = () => {
    const selected = getSelectedBuilding();
    if (!selected) return;

    const grid = screenToGrid(p, p.mouseX, p.mouseY);
    if (!grid) return;

    sektor.createBuilding({ type: selected, x: grid.x, y: grid.y });
  };

  p.draw = () => {
    p.background(30);

    p.ambientLight(60);
    p.pointLight(255, 255, 255, 2 * BLOCK_SIZE, -3 * BLOCK_SIZE, -2 * BLOCK_SIZE);

    p.orbitControl();
    p.stroke(150);

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        p.push();
        p.translate(
          (x - GRID_SIZE / 2 + 0.5) * BLOCK_SIZE,
          0,
          (z - GRID_SIZE / 2 + 0.5) * BLOCK_SIZE,
        );
        drawFloor(p, BLOCK_SIZE);
        p.pop();
      }
    }

    document.getElementById("canvas-container")!.dataset.rendered = "true";
  };
};

new p5(sketch);
initToolbar();

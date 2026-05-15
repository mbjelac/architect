import p5 from "p5";
import {drawFloor} from "../../shared/drawFloor";
import {parseCommands} from "../../shared/parseCommands";
import {applyCommands} from "../../shared/applyCommands";
import {BLOCK_SIZE} from "../../shared/constants";
import {initToolbar, getSelectedBuilding, getBuildingCode} from "./toolbar";
import {Sektor} from "./sektor/Sektor";

const GRID_SIZE = 10;
const sektor = new Sektor();
const placedBuildings: { type: string; x: number; y: number; code: string }[] = [];
let errorTimeout: ReturnType<typeof setTimeout> | null = null;

const ZOOM = 1.2;
const CAM_DIST = 800;
const CAM_ANGLE_Y = Math.PI / 4;
const CAM_ANGLE_X = Math.PI / 6;

// Precompute camera basis vectors
const fwdX = -Math.sin(CAM_ANGLE_Y) * Math.cos(CAM_ANGLE_X);
const fwdY = Math.sin(CAM_ANGLE_X);
const fwdZ = -Math.cos(CAM_ANGLE_Y) * Math.cos(CAM_ANGLE_X);

// Right = normalize(forward × (0,1,0))
const rawRightX = fwdY * 0 - fwdZ * 1;  // fwdY*0 - fwdZ*1 = -fwdZ
const rawRightZ = fwdX * 1 - fwdY * 0;  // fwdX
// rawRightY = fwdZ*0 - fwdX*0 = 0
const rightLen = Math.sqrt(rawRightX * rawRightX + rawRightZ * rawRightZ);
const rightX = rawRightX / rightLen;
const rightZ = rawRightZ / rightLen;

// Up = right × forward
const upX = 0 * fwdZ - rightZ * fwdY;
const upY = rightZ * fwdX - rightX * fwdZ;
const upZ = rightX * fwdY - 0 * fwdX;

// Floor box half-extents
const HALF = BLOCK_SIZE / 2;
const FLOOR_HEIGHT = BLOCK_SIZE * 0.15;

function gridToWorld(gx: number, gy: number): { wx: number; wz: number } {
  return {
    wx: (gx - GRID_SIZE / 2 + 0.5) * BLOCK_SIZE,
    wz: (gy - GRID_SIZE / 2 + 0.5) * BLOCK_SIZE,
  };
}

function rayAABB(
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  minX: number, minY: number, minZ: number,
  maxX: number, maxY: number, maxZ: number,
): number | null {
  let tmin = -Infinity;
  let tmax = Infinity;

  // X slab
  if (Math.abs(dx) < 1e-10) {
    if (ox < minX || ox > maxX) return null;
  } else {
    let t1 = (minX - ox) / dx;
    let t2 = (maxX - ox) / dx;
    if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
    tmin = Math.max(tmin, t1);
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }

  // Y slab
  if (Math.abs(dy) < 1e-10) {
    if (oy < minY || oy > maxY) return null;
  } else {
    let t1 = (minY - oy) / dy;
    let t2 = (maxY - oy) / dy;
    if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
    tmin = Math.max(tmin, t1);
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }

  // Z slab
  if (Math.abs(dz) < 1e-10) {
    if (oz < minZ || oz > maxZ) return null;
  } else {
    let t1 = (minZ - oz) / dz;
    let t2 = (maxZ - oz) / dz;
    if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
    tmin = Math.max(tmin, t1);
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }

  return tmin;
}

function findClickedTile(mx: number, my: number, canvasW: number, canvasH: number): { x: number; y: number } | null {
  // Convert pixel to NDC (-1 to 1), Y flipped
  const ndcX = (mx / canvasW) * 2 - 1;
  const ndcY = (my / canvasH) * 2 - 1;

  // Ortho half-extents
  const hw = canvasW * ZOOM / 2;
  const hh = canvasH * ZOOM / 2;

  // Ray origin: camera eye + offset along right and up
  const eyeX = CAM_DIST * Math.sin(CAM_ANGLE_Y) * Math.cos(CAM_ANGLE_X);
  const eyeY = -CAM_DIST * Math.sin(CAM_ANGLE_X);
  const eyeZ = CAM_DIST * Math.cos(CAM_ANGLE_Y) * Math.cos(CAM_ANGLE_X);

  const ox = eyeX + rightX * ndcX * hw + upX * ndcY * hh;
  const oy = eyeY + 0 * ndcX * hw + upY * ndcY * hh;
  const oz = eyeZ + rightZ * ndcX * hw + upZ * ndcY * hh;

  // Ray direction: forward (same for all pixels in ortho)
  const dx = fwdX;
  const dy = fwdY;
  const dz = fwdZ;

  let bestT = Infinity;
  let bestTile: { x: number; y: number } | null = null;

  for (let gx = 0; gx < GRID_SIZE; gx++) {
    for (let gy = 0; gy < GRID_SIZE; gy++) {
      const { wx, wz } = gridToWorld(gx, gy);
      const t = rayAABB(
        ox, oy, oz,
        dx, dy, dz,
        wx - HALF, -FLOOR_HEIGHT / 2, wz - HALF,
        wx + HALF, FLOOR_HEIGHT / 2, wz + HALF,
      );
      if (t !== null && t < bestT) {
        bestT = t;
        bestTile = { x: gx, y: gy };
      }
    }
  }

  return bestTile;
}

const sketch = (p: p5) => {
  p.setup = () => {
    const container = document.getElementById("canvas-container")!;
    const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight, p.WEBGL);
    canvas.parent(container);
    const hw = container.offsetWidth * ZOOM / 2;
    const hh = container.offsetHeight * ZOOM / 2;
    p.ortho(-hw, hw, -hh, hh);

    const camX = CAM_DIST * Math.sin(CAM_ANGLE_Y) * Math.cos(CAM_ANGLE_X);
    const camY = -CAM_DIST * Math.sin(CAM_ANGLE_X);
    const camZ = CAM_DIST * Math.cos(CAM_ANGLE_Y) * Math.cos(CAM_ANGLE_X);
    p.camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  };

  p.mousePressed = () => {
    const selected = getSelectedBuilding();
    if (!selected) return;

    const grid = findClickedTile(p.mouseX, p.mouseY, p.width, p.height);
    if (!grid) return;

    const result = sektor.createBuilding({ type: selected, x: grid.x, y: grid.y });

    for (const building of result.addedBuildings) {
      const code = getBuildingCode(building.type);
      if (code) {
        placedBuildings.push({ type: building.type, x: building.x, y: building.y, code });
      }
    }

    if (result.error !== undefined) {
      const errorEl = document.getElementById("error-message")!;
      errorEl.textContent = result.error;
      errorEl.style.display = "block";
      if (errorTimeout) clearTimeout(errorTimeout);
      errorTimeout = setTimeout(() => {
        errorEl.style.display = "none";
      }, 5000);
    }
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
        const { wx, wz } = gridToWorld(x, z);
        p.translate(wx, 0, wz);
        drawFloor(p, BLOCK_SIZE);
        p.pop();
      }
    }

    for (const building of placedBuildings) {
      p.push();
      const { wx, wz } = gridToWorld(building.x, building.y);
      p.translate(wx, 0, wz);
      const commands = parseCommands(building.code);
      applyCommands(p, commands);
      p.pop();
    }

    document.getElementById("canvas-container")!.dataset.rendered = "true";
  };
};

new p5(sketch);
initToolbar();

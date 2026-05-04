import { test, expect } from "@playwright/test";

test("default scene", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("canvas");

  // Wait for WebGL to render a few frames and stabilize
  await page.waitForTimeout(1000);

  const canvas = page.locator("#canvas-container");
  await expect(canvas).toHaveScreenshot("default-scene.png", {
    maxDiffPixelRatio: 0.01,
  });
});

test("pyr3 produces 3-sided pyramid", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("canvas");

  await page.locator("#editor textarea").fill("pyr3");
  await page.waitForTimeout(1000);

  const canvas = page.locator("#canvas-container");
  await expect(canvas).toHaveScreenshot("pyr3.png", {
    maxDiffPixelRatio: 0.01,
  });
});

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

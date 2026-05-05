import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("canvas");
});

test("default scene", async ({ page }) => {
  await expectScreenshot(page, "default-scene");
});

test("pyr3 produces 3-sided pyramid", async ({ page }) => {
  await page.locator("#editor textarea").fill("pyr3");
  await expectScreenshot(page, "pyr3");
});

async function expectScreenshot(page, name) {
  await page.waitForTimeout(1000);
  const canvas = page.locator("#canvas-container");
  await expect(canvas).toHaveScreenshot(`${name}.png`, {
    maxDiffPixelRatio: 0.01,
  });
}

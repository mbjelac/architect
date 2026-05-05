import { test, expect } from "@playwright/test";

export { test, expect };

export function setup() {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("canvas");
  });
}

export async function expectScreenshot(page, name) {
  await page.locator('#canvas-container[data-rendered="true"]').waitFor({ timeout: 2000 });
  await page.waitForTimeout(50);
  const canvas = page.locator("#canvas-container");
  await expect(canvas).toHaveScreenshot(`${name}.png`, {
    maxDiffPixelRatio: 0.01,
  });
}

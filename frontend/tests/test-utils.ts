import { test, expect, Page } from "@playwright/test";

export { test, expect };

export function setup() {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("canvas");
  });
}

export async function expectScreenshot(page: Page, name: string) {
  await page.waitForTimeout(100);
  const canvas = page.locator("#canvas-container");
  await expect(canvas).toHaveScreenshot(`${name}.png`, {
    maxDiffPixelRatio: 0.01,
  });
}

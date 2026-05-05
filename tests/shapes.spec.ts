import { test, setup, expectScreenshot } from "./test-utils";

setup();

test("default scene", async ({ page }) => {
  await expectScreenshot(page, "default-scene");
});

test("pyr3 produces 3-sided pyramid", async ({ page }) => {
  await page.locator("#editor textarea").fill("pyr3");
  await expectScreenshot(page, "pyr3");
});

import { test, setup, expectScreenshot } from "./test-utils";

setup();

test("renders empty grid of floors", async ({ page }) => {
  await expectScreenshot(page, "empty-grid");
});

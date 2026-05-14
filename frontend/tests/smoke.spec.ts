import { test, setup, expectScreenshot } from "./test-utils";

setup();

test("renders empty scene", async ({ page }) => {
  await expectScreenshot(page, "empty-scene");
});

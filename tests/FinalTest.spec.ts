import { test } from "@playwright/test";

test("Step 1 - login to mail", async ({ page }) => {
    await page.goto("https://mailfence.com/");
    await page.locator("#signin").click();
    //await page.getByText("Log in").click();
    await page.locator("#UserID").fill("alik");
    await page.locator("#Password").fill("sEepqTaxB8P5@qw");
    await page.locator('[value="Enter"]').click();
});

import { test } from "@playwright/test";

test("Step 1 - login to mail", async ({ page }) => {
    await page.goto("https://mailfence.com/");
    await page.locator("#signin").click();
    //await page.getByText("Log in").click();
    await page.locator("#UserID").fill("alik");
    await page.locator("#Password").fill("sEepqTaxB8P5@qw");
    await page.locator('[value="Enter"]').click();

    await page.locator('[title="New"]').click();
    // загрузка файла пока не получается
    //  await page.locator('[class="icon icon16-Image"]').click()
    // const fileUpload = page.locator('[type="file"][name="docgwt-uid-33"]')
    //  await fileUpload.setInputFiles('D:/Alexander/STUDY/testfile.txt')
    const currentUnreadMails = page
        .locator("#treeInbox")
        .locator('[class="GCSDBRWBOXB"]')
        .textContent();
    await page
        .locator('[type="text"][tabindex="1"]')
        .fill("alik@mailfence.com");
    await page.locator('[type="text"][tabindex="4"]').fill("Send txt file");
    await page.locator("#mailSend").click();

    /*  // check message is delivered
  const messageIcon = page.locator('[class="icon24-Message toolImg"]')
  await messageIcon.hover()
  const tooltip = await page.locator('[class="GCSDBRWBNV GCSDBRWBMV GCSDBRWBFW"]').locator('[class="GCSDBRWBEW GCSDBRWBIH"]').textContent()
  expect(tooltip).toEqual('Messages - 1 Unread')
*/
    await page.waitForTimeout(5000);
    await page.getByTitle("Refresh").click();
    const newUnreadMails = page
        .locator("#treeInbox")
        .locator('[class="GCSDBRWBOXB"]')
        .textContent();
    expect(newUnreadMails).not.toEqual(currentUnreadMails);
    //go to inbox page
    await page.locator("#treeInbox").click();
});
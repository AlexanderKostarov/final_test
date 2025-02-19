import { test, expect } from "@playwright/test";

test("Step 1 - login to mail", async ({ page }) => {
    // 1. Login to mail
    await page.goto("https://mailfence.com/");
    await page.locator("#signin").click();
    await page.locator("#UserID").fill("alik");
    await page.locator("#Password").fill("sEepqTaxB8P5@qw");
    await page.locator('[value="Enter"]').click();
    // 2. Attach .txt file
    await page.locator('[title="New"]').click();
    await page
        .locator('[class="GCSDBRWBKSB GCSDBRWBO"]')
        .getByText("Attachment")
        .click();
    const fileUpload = page.locator('[type="file"][name="docgwt-uid-33"]');
    await fileUpload.setInputFiles("./test-data/testfile.txt");
    await page.waitForTimeout(2000);

    // 3. Send email with attached file to yourself
    const currentUnreadMails = page
        .locator("#treeInbox")
        .locator('[class="GCSDBRWBOXB"]')
        .textContent();
    await page
        .locator('[type="text"][tabindex="1"]')
        .fill("alik@mailfence.com");
    await page.locator('[type="text"][tabindex="4"]').fill("Send txt file 1");
    await page.locator("#mailSend").click();
    // 4. Check email is received
    await page.waitForTimeout(2000);
    await page.getByTitle("Refresh").click();
    const newUnreadMails = page
        .locator("#treeInbox")
        .locator('[class="GCSDBRWBOXB"]')
        .textContent();
    expect(newUnreadMails).not.toEqual(currentUnreadMails);

    await page.locator("#treeInbox").click();
    // 5. Open received mail
    await page.locator('tr[tabindex="0"]').first().click();
    // 6. Save the attached file to documents
    await page.getByTitle("testfile.txt (1 KB)").hover();
    await page
        .getByTitle("testfile.txt (1 KB)")
        .locator('[class="icon-Arrow-down"]')
        .click();
    await page.getByText("Save in Documents").click();
    await page.getByText("My documents").click();
    await page.waitForTimeout(2000);
    await page.getByText("Save").click();
    // 7. Open documents area
    await page.locator('[class="icon24-Documents toolImg"]').click();
    await page.waitForTimeout(2000);

    // 8. Move file from documents to trash folder by drag'n'drop action
    await page
        .locator('[class="GCSDBRWBFT GCSDBRWBCKB name"]')
        .dragTo(page.locator("#doc_tree_trash"));

    /*    await page.locator('[class="GCSDBRWBFT GCSDBRWBCKB name"]').hover();
    await page.mouse.down();
    await page.locator('#doc_tree_trash').hover();
    await page.mouse.up();*/
    // ER: file was moved
    /*  await page.locator("#doc_tree_trash").click()
    await page.waitForTimeout(2000);
    const fileAccounts = (await page.getByText("testfile.txt").count()) > 0;
    if (fileAccounts) {
        console.log("File was moved");
    } else {
        console.log("File was not moved");
    } */
});

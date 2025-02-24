import { test, expect } from "@playwright/test";

test("Step 1 - login to mail", async ({ page }) => {
    function generateMailSubject(length: number): string{
        return Math.random().toString(36).substring(2, 2 + length)
    }
    const mailSubjectName = generateMailSubject(15)
    // 1. Login to mail
    await page.goto("https://mailfence.com/");
    await page.locator("#signin").click();
    await page.locator("#UserID").fill("alik");
    await page.locator("#Password").fill("sEepqTaxB8P5@qw");
    await page.locator('[value="Enter"]').click();
    // 2. Attach .txt file
    await page.locator('[title="New"]').click();
    await page
        .locator('[class="GCSDBRWBISB GCSDBRWBJSB"]')
        .first()
        .click();
    const fileUpload = page.locator('[type="file"][name="docgwt-uid-33"]');
    await fileUpload.setInputFiles("./test-data/testfile.txt");
   // await page.waitForLoadState('load')
    await page.locator('[class="GCSDBRWBJRB"]').waitFor()

    // 3. Send email with attached file to yourself
    await page
        .locator('[type="text"][tabindex="1"]')
        .fill("alik@mailfence.com");
    await page.locator('[type="text"][tabindex="4"]').fill(mailSubjectName);
    await page.locator("#mailSend").click();

    const timeSent = new Date();
    
    // 4. Check email is received
    await page.locator("#treeInbox").click();
/*    let indicator = 0
    let mailLocator =  page.locator('tr[tabindex="0"]').filter({has: page.locator('[class="listSubject"][title= "Auto mail 1"]')}).filter({has: page.locator('[class="GCSDBRWBJUB"]').locator('[title="Alexander Kostarov  "]')}).first()
    let timeReceived = new Date(await page.locator('tr[tabindex="0"]').locator('[class="GCSDBRWBIUB"]').first().getAttribute('title'))
    console.log('timeSent = ', timeSent)
    console.log('timeReceived = ', timeReceived)

    while (indicator == 0) {
        await page.locator('tr[tabindex="0"]').first().waitFor()
        timeReceived = new Date(await page.locator('tr[tabindex="0"]').locator('[class="GCSDBRWBIUB"]').first().getAttribute('title'))
        console.log(timeReceived)
        if (await mailLocator.count() > 0 && timeReceived.getTime() >= timeSent.getTime()) {
            break;
        }
            */
    let indicator = 0
    while (indicator === 0) {
        if (await page.locator('[class="GCSDBRWBKUB"]').locator(`[title="${mailSubjectName}"]`).count() > 0) {
            break;
        }
        await page.locator('[title="Refresh"]').click()
    }


    
    // 5. Open received mail

    await page.locator(`[title = "${mailSubjectName}"]`).click();
    // 6. Save the attached file to documents

    await page.getByTitle("testfile.txt (1 KB)").hover();
    await page
        .getByTitle("testfile.txt (1 KB)")
        .locator('[class="icon-Arrow-down"]')
        .click();
    await page.getByText("Save in Documents").click();

    await page.locator('[class="GCSDBRWBEY"]').locator('[class="GCSDBRWBDX treeItemRoot GCSDBRWBLX"]').locator('[class="treeItemLabel"]').click();
    await page.locator('[tabindex="0"][class="btn GCSDBRWBO defaultBtn"]').waitFor()
    await page.locator('[class="btn GCSDBRWBO defaultBtn"]').click();
    // 7. Open documents area
    await page.locator('[id="nav-docs"]').click();
    const documentLocator = page.locator('tr[tabindex="0"]').filter({hasText: "testfile.txt"})
    await documentLocator.waitFor() //meant that page is uploaded, instead of waitForTimeout

    // 8. Move file from documents to trash folder by drag'n'drop action
    const trashCoordinates = await page
        .locator("#doc_tree_trash")
        .boundingBox();
    const fileCoordinates = await page
        .locator('tr[tabindex="0"]').filter({hasText: "testfile.txt"})
        .boundingBox();
    await page.locator('tr[tabindex="0"]').filter({hasText: "testfile.txt"}).hover();
    await page.mouse.down();
 /*   if (fileCoordinates) {
        await page.mouse.move(
            fileCoordinates.x + fileCoordinates.width / 3,
            fileCoordinates.y + fileCoordinates.height / 3
        );
    } */
    if (trashCoordinates) {
        await page.mouse.move(
            trashCoordinates.x + trashCoordinates.width / 2,
            trashCoordinates.y + trashCoordinates.height / 2,
            { steps: 20}
        ); // Move mouse to the center of the element
    }

    await page
        .locator('[id="doc_tree_trash"]')
        .hover();
    await page.mouse.up();
    // ER: file was moved
    await page.locator("#doc_tree_trash").click();
 //   await page.locator('[class="GCSDBRWBOBC"]').waitFor() //show us that trash page is opened
    await expect(page.locator('tr[tabindex="0"]').first().locator('[class="GCSDBRWBPJB"]')).toHaveText('»testfile.txt')
});

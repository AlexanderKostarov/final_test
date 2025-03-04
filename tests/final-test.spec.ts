import { test, expect, Locator } from "@playwright/test";
import { Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import { BaseElement } from "../src/base-element";
import { ButtonElement } from "../src/button-element";
import { InputElement } from "../src/input-element";
import { UploadElement } from "../src/upload-element";
import { promises as fs } from "fs";
import path from "path";
dotenv.config();

const userMail = process.env.USER_Mail;
const userPassword = process.env.USER_PASSWORD;
const mailSubjectName = faker.address.zipCode();
const fileName = `${mailSubjectName}.txt`;



test("Step 1 - login to mail", async ({ page }) => {

    createFile();
    const documentLocator = page.locator(`[title="${fileName}"]`);
    // 1. Login to mail
    const fillUserName = new InputElement(page.locator("#UserID"))
    const fillUserPassword = new InputElement(page.locator("#Password"))
    const enterButton = new ButtonElement(page.locator(".btn"))

    await page.goto(process.env.LOGIN_PAGE);
    await fillUserName.enterText(userMail)
    await fillUserPassword.enterText(userPassword);
    await enterButton.clickButton()
   
   
    // 2. Attach .txt file
    const newMailButton = new ButtonElement(page.locator('[title="New"]'))
    const addAttachmentButton = new ButtonElement(page.locator('xpath=(//*[@class="GCSDBRWBISB GCSDBRWBJSB"])[1]'))
    const uploadNewFile = new UploadElement(page.locator('[type="file"][name="docgwt-uid-33"]'))

    await newMailButton.clickButton()
    await addAttachmentButton.clickButton()
    await uploadNewFile.uploadFile(`./src/${fileName}`)

    await page.locator('[class="GCSDBRWBJRB"]').waitFor();

    // 3. Send email with attached file to yourself
    const newMailRecipient = new InputElement(page.locator('[type="text"][tabindex="1"]'))
    const newMailsubject = new InputElement(page.locator('[type="text"][tabindex="4"]'))
    const sendMailButton = new ButtonElement(page.locator("#mailSend"))
    const getToInboxButton = new ButtonElement(page.locator("#treeInbox"))

    await newMailRecipient.enterText(process.env.USER_MAIL)
    await newMailsubject.enterText(mailSubjectName)
    await sendMailButton.clickButton()

    // 4. Check email is received
    const refreshButton = new ButtonElement(page.locator('[title="Refresh"]'));

    await getToInboxButton.clickButton()

    await waitUntilMailIsReceived(documentLocator, refreshButton)
   
    // 5. Open received mail
    const openMail = new ButtonElement(page.locator(`[title = "${mailSubjectName}"]`))
   
    await openMail.clickButton()

    // 6. Save the attached file to documents
    const attachedFile = new ButtonElement(page.locator('[class="GCSDBRWBJRB GCSDBRWBO"]'))
    const attachedFilesDropdown = new ButtonElement(page.locator('[class="GCSDBRWBJRB GCSDBRWBO"] [class="icon-Arrow-down"]'))
    const saveInDocumentsButton = new ButtonElement(page.locator('xpath=(//*[@class="GCSDBRWBOQ menu"])[1]'))
    const saveTomyDocumentsFolder = new ButtonElement(page.locator('[class="GCSDBRWBEY"] [class="GCSDBRWBDX treeItemRoot GCSDBRWBLX"]'))
    const saveAttachmentToMyDocumentsButton = new ButtonElement(page.locator('[tabindex="0"][class="btn GCSDBRWBO defaultBtn"]'))

    await attachedFile.hoverElement()
    await attachedFilesDropdown.clickButton()
    await saveInDocumentsButton.clickButton()
    await saveTomyDocumentsFolder.clickButton()

/*    await page
        .locator('[tabindex="0"][class="btn GCSDBRWBO defaultBtn"]')
        .waitFor();
*/
    await saveAttachmentToMyDocumentsButton.clickButton()  
    // 7. Open documents area
    const getToDocumentsAreaButton = new ButtonElement(page.locator('[id="nav-docs"]'))
    const myDocumentsFolder = new ButtonElement(page.locator('[class="GCSDBRWBDX treeItemRoot GCSDBRWBLX nodeSel"]'))

    await getToDocumentsAreaButton.clickButton()
    await myDocumentsFolder.clickButton()
    await documentLocator.waitFor(); //meant that page is uploaded, instead of waitForTimeout

    // 8. Move file from documents to trash folder by drag'n'drop action

    const requiredDocument = new ButtonElement(page.locator('[class="GCSDBRWBFT GCSDBRWBCKB name"]').filter({ hasText: `${fileName}` }))
    const trashFolderElement = new BaseElement(page.locator("#doc_tree_trash"));
    const openedTrashPageIdentifier = new BaseElement(page.locator('[class="GCSDBRWBOBC"]'))
    await moveToTrash(page, requiredDocument, trashFolderElement)
    // ER: file was moved


    await trashFolderElement.clickButton();

    await openedTrashPageIdentifier.waitForElementAppears; //show us that trash page is opened

    await requiredDocument.checkToBeVisible()
    deleteFile();
});

async function createFile() {
    const fileText = mailSubjectName;
    const folderPath = path.join(__dirname, "../src");
    const filePath = path.join(folderPath, fileName);
    await fs.writeFile(filePath, fileText);
}

async function deleteFile() {
    const filePath = path.join(__dirname, "../src", `${fileName}`);
    await fs.unlink(filePath);
}

async function moveToTrash(page: Page, requiredDocument: ButtonElement, trashFolderElement: BaseElement) {
    const trashCoordinates = await trashFolderElement.getCoordinates()
    await requiredDocument.hoverElement()
    await page.mouse.down();
    if (trashCoordinates)
        await page.mouse.move(
            trashCoordinates.x + trashCoordinates.width / 2,
            trashCoordinates.y + trashCoordinates.height / 2,
            { steps: 20 } 
        ); 
    
    await trashFolderElement.hoverElement();
    await page.mouse.up();
}

async function waitUntilMailIsReceived (documentLocator: Locator, refreshButton: ButtonElement) {
    const startTime = Date.now();
    const loopDuration = 5000;
    let indicator = 0;
    while (indicator === 0 && Date.now() - startTime < loopDuration) {
        if ((await documentLocator.count()) > 0) {
            break;
        }
        await refreshButton.clickButton()
    }

}
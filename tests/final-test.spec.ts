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
    // 1. Login to mail
    const fillUserName = new InputElement(page.locator("#UserID"))
    const fillUserPassword = new InputElement(page.locator("#Password"))
    const enterButton = new ButtonElement(page.locator(".btn"))

    if (userMail !== undefined && userPassword !== undefined && process.env.LOGIN_PAGE !== undefined) {
        await page.goto(process.env.LOGIN_PAGE);
        await fillUserName.enterText(userMail)
        await fillUserPassword.enterText(userPassword);
    }
    else
        console.log('userMail or password or LOGIN_PAGE is undefined')
    await enterButton.click()
    // 2. Attach .txt file
    const newMailButton = new ButtonElement(page.locator('[title="New"]'))
    const addAttachmentButton = new ButtonElement(page.locator('xpath=(//*[@class="GCSDBRWBISB GCSDBRWBJSB"])[1]'))
    const uploadNewFileElement = new UploadElement(page.locator('[type="file"][name="docgwt-uid-33"]'))
    const waitAttachmentIsUploaded = new BaseElement(page.locator('[class="GCSDBRWBJRB"]'))

    await newMailButton.click()
    await addAttachmentButton.click()
    await uploadNewFileElement.uploadFile(`./src/${fileName}`)

    await waitAttachmentIsUploaded.waitForElementAppears()

    // 3. Send email with attached file to yourself
    const newMailRecipientField = new InputElement(page.locator('[type="text"][tabindex="1"]'))
    const newMailsubjectField = new InputElement(page.locator('[type="text"][tabindex="4"]'))
    const sendMailButton = new ButtonElement(page.locator("#mailSend"))
    const getToInboxButton = new ButtonElement(page.locator("#treeInbox"))

    if (userMail !== undefined)
        await newMailRecipientField.enterText(userMail)
    else console.log('Usermail is undefined')
    await newMailsubjectField.enterText(mailSubjectName)
    await sendMailButton.click()

    // 4. Check email is received
    
    await getToInboxButton.click()
    const documentLocator = page.locator(`[title="${fileName}"]`);
    const checkLettersAreUploaded = new BaseElement(page.locator('[class="GCSDBRWBBU"] [tabindex="0"]').first())
    const refreshButton = new ButtonElement(page.locator('[title="Refresh"]'));
    await waitUntilMailIsReceived(documentLocator, refreshButton, checkLettersAreUploaded)
   
    // 5. Open received mail
    const openSelectedMailButton = new ButtonElement(page.locator(`[title = "${mailSubjectName}"]`))
   
    await openSelectedMailButton.click()

    // 6. Save the attached file to documents
    const attachedFileElement = new BaseElement(page.locator('[class="GCSDBRWBJRB GCSDBRWBO"]'))
    const attachedFilesDropdownButton = new ButtonElement(page.locator('[class="GCSDBRWBJRB GCSDBRWBO"] [class="icon-Arrow-down"]'))
    const saveInDocumentsButton = new ButtonElement(page.locator('xpath=(//*[@class="GCSDBRWBOQ menu"])[1]'))
    const saveToMyDocumentsFolderButton = new ButtonElement(page.locator('[class="GCSDBRWBEY"] [class="GCSDBRWBDX treeItemRoot GCSDBRWBLX"]'))
    const saveAttachmentButton = new ButtonElement(page.locator('[tabindex="0"][class="btn GCSDBRWBO defaultBtn"]'))

    await attachedFileElement.hoverElement()
    await attachedFilesDropdownButton.click()
    await saveInDocumentsButton.click()
    await saveToMyDocumentsFolderButton.click()
    await saveAttachmentButton.click()  
    // 7. Open documents area
    const getToDocumentsAreaButton = new ButtonElement(page.locator('[id="nav-docs"]'))
    const myDocumentsFolderButton = new ButtonElement(page.locator('[class="GCSDBRWBDX treeItemRoot GCSDBRWBLX nodeSel"]'))
    const waitDocumentAppears = new BaseElement(documentLocator)
    await getToDocumentsAreaButton.click()
    await myDocumentsFolderButton.click()
    await waitDocumentAppears.waitForElementAppears; //meant that page is uploaded, instead of waitForTimeout

    // 8. Move file from documents to trash folder by drag'n'drop action

    const requiredDocumentElement = new BaseElement(page.locator('[class="GCSDBRWBFT GCSDBRWBCKB name"]').filter({ hasText: `${fileName}` }))
    const trashFolderElement = new BaseElement(page.locator("#doc_tree_trash"));
    const openedTrashPageIdentifierElement = new BaseElement(page.locator('[class="GCSDBRWBBU"] [tabindex="0"]').first())
    await moveToTrash(page, requiredDocumentElement, trashFolderElement)
    // ER: file was moved


    await trashFolderElement.click();
    await openedTrashPageIdentifierElement.waitForElementAppears; //show us that trash page is opened
    await requiredDocumentElement.checkToBeVisible()
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

async function moveToTrash(page: Page, requiredDocument: BaseElement, trashFolderElement: BaseElement) {
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
 //   await requiredDocument.waitForElementExpires()
}

async function waitUntilMailIsReceived (documentLocator: Locator, refreshButton: ButtonElement, checkLettersAreUploaded: BaseElement) {
    const startTime = Date.now();
    const maxTimeout = 5000;
    while ( Date.now() - startTime < maxTimeout) {
        await checkLettersAreUploaded.waitForElementAppears
        if (await documentLocator.isVisible()) {
            break;
        }
        else {
            await refreshButton.click()  
        } 
    }

}
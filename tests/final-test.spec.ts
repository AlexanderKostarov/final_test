import { test, expect, Locator } from "@playwright/test";
import { Page } from "@playwright/test";

import { BaseElement } from "../src/base-element";
import { ButtonElement } from "../src/button-element";
import { InputElement } from "../src/input-element";
import { UploadElement } from "../src/upload-element";
import path from "path";
import { FileManager } from "../src/file-manager";

const userMail = process.env.USER_Mail;
const userPassword = process.env.USER_PASSWORD;
const loginPage = "/sw?type=L&state=0&lf=mailfence";

let newFileName: string

//const fileName = `${mailSubjectName}.txt`;

test.beforeEach(async ({ page }) => {
    const newFile = new FileManager();
    newFileName = await newFile.createRandomFile();
});

test.afterEach(async ({ page }) => {
    const fileForRemoval = new FileManager();
    fileForRemoval.deleteFile(newFileName);
});

test("Step 1 - login to mail", async ({ page }) => {
    // 1. Login to mail
    await test.step("Log in", async () => {
        const fillUserName = new InputElement(
            page.locator("#UserID"),
            "UserID"
        );
        const fillUserPassword = new InputElement(
            page.locator("#Password"),
            "Password"
        );
        const enterButton = new ButtonElement(page.locator(".btn"), "Enter");
        if (dataIsDefined()) {
            await page.goto(loginPage);
            await fillUserName.enterText(userMail);
            await fillUserPassword.enterText(userPassword);
        } else {
            throw new Error("Custom error: data in .env is undefined");
        }
        await enterButton.click();
    });

    // 2. Attach .txt file
    await test.step(`Attach .txt file`, async () => {
        const newMailButton = new ButtonElement(
            page.locator('[title="New"]'),
            "New Mail"
        );
        const addAttachmentButton = new ButtonElement(
            page.locator('xpath=(//*[@class="GCSDBRWBISB GCSDBRWBJSB"])[1]'),
            "ttachment"
        );
        const uploadNewFileElement = new UploadElement(
            page.locator('[type="file"][name="docgwt-uid-33"]'),
            "From your computer"
        );
        const waitAttachmentIsUploaded = new BaseElement(
            page.locator('[class="GCSDBRWBJRB"]'),
            "uploaded attachment Element"
        );
        const relativeFilePath = `./test-data/${newFileName}`;
        await newMailButton.click();
        await addAttachmentButton.click();
        await uploadNewFileElement.uploadFile(relativeFilePath);

        await waitAttachmentIsUploaded.waitForElementAppears();
    });

    // 3. Send email with attached file to yourself
    await test.step("Send email to yourself", async () => {
        const mailRecipientField = new InputElement(
            page.locator('[type="text"][tabindex="1"]'),
            "Mail recipient"
        );
        const mailsubjectField = new InputElement(
            page.locator('[type="text"][tabindex="4"]'),
            "Mail subject"
        );
        const sendMailButton = new ButtonElement(
            page.locator("#mailSend"),
            "Send Mail"
        );

        const mailSubjectName = newFileName;

        await mailRecipientField.enterText(userMail);
        await mailsubjectField.enterText(mailSubjectName);
        await sendMailButton.click();
    });

    // 4. Check email is received
    await test.step("Check email is received", async () => {
        const inboxButton = new ButtonElement(
            page.locator("#treeInbox"),
            "Inbox"
        );
        await inboxButton.click();
        const documentLocator = page.locator(`[title="${newFileName}"]`);
        const uploadedLettersElement = new BaseElement(
            page.locator('[class="GCSDBRWBBU"] [tabindex="0"]').first(),
            "what element?!"
        );
        const refreshButton = new ButtonElement(
            page.locator('[title="Refresh"]'),
            "Refresh"
        );
        await waitUntilMailIsReceived(
            documentLocator,
            refreshButton,
            uploadedLettersElement
        );
    });

    // 5. Open received mail
    await test.step(`open received mail`, async () => {
        const openSelectedMailButton = new ButtonElement(
            page.locator(`[title = "${newFileName}"]`),
            "Our received mail"
        );
        await openSelectedMailButton.click();
    });

    // 6. Save the attached file to documents
    await test.step("Save the attached file", async () => {
        const attachedFileElement = new BaseElement(
            page.locator('[class="GCSDBRWBJRB GCSDBRWBO"]'),
            "attached file"
        );
        const attachedFilesDropdownButton = new ButtonElement(
            page.locator(
                '[class="GCSDBRWBJRB GCSDBRWBO"] [class="icon-Arrow-down"]'
            ),
            "attached files dropwown"
        );
        const saveInDocumentsButton = new ButtonElement(
            page.locator('xpath=(//*[@class="GCSDBRWBOQ menu"])[1]'),
            "Save id documents"
        );
        const saveToMyDocumentsFolderButton = new ButtonElement(
            page.locator(
                '[class="GCSDBRWBEY"] [class="GCSDBRWBDX treeItemRoot GCSDBRWBLX"]'
            ),
            "Select My Documents folder"
        );
        const saveAttachmentButton = new ButtonElement(
            page.locator('[tabindex="0"][class="btn GCSDBRWBO defaultBtn"]'),
            "Save attachment"
        );

        await attachedFileElement.hoverElement();
        await attachedFilesDropdownButton.click();
        await saveInDocumentsButton.click();
        await saveToMyDocumentsFolderButton.click();
        await saveAttachmentButton.click();
    });

    // 7. Open documents area
    await test.step("Open documents area", async () => {
        const documentsAreaButton = new ButtonElement(
            page.locator('[id="nav-docs"]'),
            "Documents area"
        );
        const myDocumentsFolderButton = new ButtonElement(
            page.locator(
                '[class="GCSDBRWBDX treeItemRoot GCSDBRWBLX nodeSel"]'
            ),
            "My documents folder"
        );
        const waitDocumentAppears = new BaseElement(
            page.locator(`[title="${newFileName}"]`),
            "downloaded document"
        );
        await documentsAreaButton.click();
        await myDocumentsFolderButton.click();
        await waitDocumentAppears.waitForElementAppears(); //meant that page is uploaded, instead of waitForTimeout
    });

    // 8. Move file from documents to trash folder by drag'n'drop action
    await test.step("Move file to trash", async () => {
        const requiredDocumentElement = new BaseElement(
            page
                .locator('[class="GCSDBRWBFT GCSDBRWBCKB name"]')
                .filter({ hasText: `${newFileName}` }),
            "required doc element"
        );
        const trashFolderElement = new BaseElement(
            page.locator("#doc_tree_trash"),
            "Trash folder"
        );
        const trashPageIdentifierElement = new BaseElement(
            page.locator('[class="GCSDBRWBBU"] [tabindex="0"]').first(),
            "trash page is opened"
        );
        await moveToTrash(page, requiredDocumentElement, trashFolderElement);
        // ER: file was moved

        await trashFolderElement.click();
        await trashPageIdentifierElement.waitForElementAppears(); //show us that trash page is opened
        await requiredDocumentElement.checkToBeVisible();
    });
});

function dataIsDefined() {
    if (userMail === undefined) {
        throw new Error("Custom error: userMail is undefined");
    } else {
        if (userPassword === undefined) {
            throw new Error("Custom error: userPassword is undefined");
        } else {
            if (loginPage === undefined) {
                throw new Error("Custom error: loginPage is undefined");
            } else {
                return true;
            }
        }
    }
}

async function moveToTrash(
    page: Page,
    requiredDocument: BaseElement,
    trashFolderElement: BaseElement
) {
    const trashCoordinates = await trashFolderElement.getCoordinates();
    await requiredDocument.hoverElement();
    await page.mouse.down();
    if (trashCoordinates) {
        await page.mouse.move(
            trashCoordinates.x + trashCoordinates.width / 2,
            trashCoordinates.y + trashCoordinates.height / 2,
            { steps: 20 }
        );
    } else {
        throw new Error("Custom error: didn't find trash coordinates");
    }
    await trashFolderElement.hoverElement();
    await page.mouse.up();
    //   await requiredDocument.waitForElementExpires()
}

async function waitUntilMailIsReceived(
    documentLocator: Locator,
    refreshButton: ButtonElement,
    uploadedLettersElement: BaseElement
) {
    const startTime = Date.now();
    const maxTimeout = 5000;
    while (Date.now() - startTime < maxTimeout) {
        await uploadedLettersElement.waitForElementAppears();
        if (await documentLocator.isVisible()) {
            break;
        } else {
            await refreshButton.click();
        }
    }
}

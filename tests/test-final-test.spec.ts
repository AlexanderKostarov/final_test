import { test, expect, Locator } from "@playwright/test";
import { Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { BaseElement } from "../src/base-element";
import { ButtonElement } from "../src/button-element";
import { InputElement } from "../src/input-element";
import { UploadElement } from "../src/upload-element";
import path from "path";
import { FileManager } from "../src/file-manager";
import { TestfileManager } from "../src/test-file-manager";

const userMail = process.env.USER_MAIL;
const userPassword = process.env.USER_PASSWORD;
const loginPage = "/sw?type=L&state=0&lf=mailfence";
const folderPath = path.join(__dirname, "../test-data")
const mailSubjectName = faker.string.alpha(15)
//let fileDataObject: object
//const fileDataObject = new FileManager(folderPath)


let newFileManager = TestfileManager.createRandomFile(folderPath)

test.beforeEach(async () => {
    
});

test.afterEach(async () => {
    await TestfileManager.deleteFile(((await newFileManager).filePath));
});

test("Mailfence test with mails", async ({ page }) => {
    await test.step("1. Login to mail", async () => {
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
            await fillUserName.enterText(userMail!);
            await fillUserPassword.enterText(userPassword!);
        } else {
            throw new Error("Custom error: data in .env is undefined");
        }
        await enterButton.click();
    });
    await test.step(`2. Attach .txt file`, async () => {
        const newMailButton = new ButtonElement(
            page.locator('[title="New"]'),
            "New Mail"
        );
        const addAttachmentButton = new ButtonElement(
            page.locator('xpath=(//*[@class="GCSDBRWBISB GCSDBRWBJSB"])[1]'),
            "attachment"
        );
        const uploadNewFileElement = new UploadElement(
            page.locator('[type="file"][name="docgwt-uid-33"]'),
            "From your computer"
        );
        const uploadedAttachmentElement = new BaseElement(
            page.locator('[class="GCSDBRWBJRB"]'),
            "uploaded attachment Element"
        );
  //      const relativeFilePath = fileDataObject.fileObject.filePath;
        await newMailButton.click();
        await addAttachmentButton.click();
        await uploadNewFileElement.uploadFile((await newFileManager).filePath);
        await uploadedAttachmentElement.waitForElementAppears();
    });

    await test.step("3. Send email with attached file to yourself", async () => {
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


        await mailRecipientField.enterText(userMail!);
        await mailsubjectField.enterText(mailSubjectName);
        await sendMailButton.click();
    });

    await test.step("4. Check email is received", async () => {
        const inboxButton = new ButtonElement(
            page.locator("#treeInbox"),
            "Inbox"
        );
 //       await inboxButton.click();
        const mailLocator = new BaseElement(page.locator(`[title="${mailSubjectName}"]`), 'mail locator');
        const uploadedLettersElement = new BaseElement(
            page.locator('[class="GCSDBRWBBU"] [tabindex="0"]').first(),
            "all letters element"
        );
        const refreshButton = new ButtonElement(
            page.locator('[title="Refresh"]'),
            "Refresh"
        );
        await waitUntilMailIsReceived(
            mailLocator,
            refreshButton,
            uploadedLettersElement
        );
    });

    await test.step(`5. Open received mail`, async () => {
        const selectedMailButton = new ButtonElement(
            page.locator(`[title = "${mailSubjectName}"]`),
            "Our received mail"
        );
        await selectedMailButton.click();
    });

    await test.step("6. Save the attached file to documents", async () => {
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
 //       await page.waitForTimeout(2000)
    });

    await test.step("7. Open documents area", async () => {
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
        const documentElement = new BaseElement(
            page.locator(`[title="${(await newFileManager).fileName}"]`),
            "downloaded document"
        );
        await documentsAreaButton.click();
        await myDocumentsFolderButton.click();
 //       await page.waitForTimeout(2000)
        await documentElement.waitForElementAppears();
    });

    await test.step("8. Move file from documents to trash folder by drag'n'drop action", async () => {
        const requiredDocumentElement = new BaseElement(
            page
                .locator('[class="GCSDBRWBFT GCSDBRWBCKB name"]')
                .filter({ hasText: `${(await newFileManager).fileName}` }),
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
        await trashFolderElement.click();
        await trashPageIdentifierElement.waitForElementAppears(); //show us that trash page is opened
        await requiredDocumentElement.checkToBeVisible();
    });
});

function dataIsDefined() {
    if (process.env.USER_MAIL === undefined) {
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
            { steps: 30 }
        );
    } else {
        throw new Error("Custom error: didn't find trash coordinates");
    }
 //   await trashFolderElement.hoverElement();
    await page.mouse.up();
    await requiredDocument.waitForElementDissapears()
}

async function waitUntilMailIsReceived(
    mailLocator: BaseElement,
    refreshButton: ButtonElement,
    uploadedLettersElement: BaseElement
) {
    let i = 1;
    let lastMessage;
    do {
        await refreshButton.click();
        await uploadedLettersElement.waitForElementAppears(2000);
        lastMessage = await mailLocator.isVisibleElement()
        i++
        console.log(lastMessage)
    } while (i < 20 && !lastMessage)
    console.log(lastMessage)
}

function waitForSecond() {
    return new Promise(resolve => setTimeout(resolve, 1000));
}
import { test, expect, Locator } from "@playwright/test";
import { Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { BaseElement } from "../src/Elements/base-element";
import { ButtonElement } from "../src/Elements/button-element";
import { InputElement } from "../src/Elements/input-element";
import { UploadElement } from "../src/Elements/upload-element";
import path from "path";
import { FileConfig, FileManager } from "../src/Utils/file-manager";
import { LoginPage } from "../src/Pages/login-page";
import { MessagePage } from "../src/Pages/messages-page";
import { NewMailForm } from "../src/Page_Components/New-Mail-Form";
import { SaveAttachment } from "../src/Page_Components/save-attachment";
import { DocumentsPage } from "../src/Pages/documents-page";

const userMail = process.env.USER_MAIL;
const userPassword = process.env.USER_PASSWORD;
const loginPage = "/sw?type=L&state=0&lf=mailfence";
const folderPath = path.join(__dirname, "../test-data");
const mailSubjectName = faker.string.alpha(15);

let fileAttachment: FileConfig;

test.beforeEach(async () => {
    fileAttachment = await FileManager.createRandomFile(folderPath);
});

test.afterEach(async () => {
    await FileManager.deleteFile(fileAttachment.filePath);
});

test("Mailfence test with mails", async ({ page }) => {
    await test.step("1. Login to mail", async () => {
        await page.goto(loginPage);
        const loginPageManager = new LoginPage(page);
        await loginPageManager.fillUserName(userMail!);
        await loginPageManager.fillUserPassword(userPassword!);
        await loginPageManager.clickEnterButton();
    });

    await test.step(`2. Attach .txt file`, async () => {
    
        const messagePageManager = new MessagePage(page)
        await messagePageManager.getToNewMailPage()
        await messagePageManager.newMailForm.attachFileFunction(fileAttachment.filePath)
    });

    await test.step("3. Send email with attached file to yourself", async () => {
        const newMailPageManager = new MessagePage(page)
        await newMailPageManager.newMailForm.enterRecipientAddress(userMail!);
        await newMailPageManager.newMailForm.enterMailSubjectName(mailSubjectName);
        await newMailPageManager.newMailForm.clickSendButton();
    });

    await test.step("4. Check email is received", async () => {
        const mailReceivedElement = new MessagePage(page)
        await mailReceivedElement.waitUntilMessageIsReceived(mailSubjectName);
    });

    await test.step(`5. Open received mail`, async () => {
        const mailReceivedElement = new MessagePage(page)
        await mailReceivedElement.openNeededMail(mailSubjectName)
    });

    await test.step("6. Save the attached file to documents", async () => {
        const saveAttachment = new SaveAttachment(page);
        await saveAttachment.hoverElement();
        await saveAttachment.openDropdown();
        await saveAttachment.saveInDocuments();
    });

    await test.step("7. Open documents area", async () => {
        const documentPage = new DocumentsPage(page, fileAttachment.fileName);
        await documentPage.openDocumentsArea();
        await documentPage.waitForNeededDocumentAppears();
    });

    await test.step("8. Move file from documents to trash folder by drag'n'drop action", async () => {
        const requiredDocumentManager = new DocumentsPage(page, fileAttachment.fileName);
        await requiredDocumentManager.moveToTrash();
        await requiredDocumentManager.getToTrashFolder();
        await requiredDocumentManager.waitForTrashPageIdentifierElementAppears();
        await requiredDocumentManager.checkReqieredDocumentIsInTrash();
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

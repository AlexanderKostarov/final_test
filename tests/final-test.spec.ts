import { test, expect, Locator } from "@playwright/test";
import { Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import path from "path";
import { FileConfig, FileManager } from "../src/Utils/file-manager";
import { LoginPage } from "../src/Pages/login-page";
import { MessagePage } from "../src/Pages/messages-page";
import { SaveAttachment } from "../src/Page_Components/save-attachment";
import { DocumentsPage } from "../src/Pages/documents-page";

const userMail = process.env.USER_MAIL;
const userPassword = process.env.USER_PASSWORD;
const loginPageURL = "/sw?type=L&state=0&lf=mailfence";
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
   
        await page.goto(loginPageURL);
        const loginPage = new LoginPage(page);
        await loginPage.login(userMail!, userPassword!)

        const newMailPage = new MessagePage(page)
        await newMailPage.getToNewMailPage()

        await newMailPage.fillNewMailData(userMail!, mailSubjectName, fileAttachment.filePath)
        await newMailPage.sendMail()

        const inboxPageWithNeededMail = new MessagePage(page)
        await inboxPageWithNeededMail.waitUntilMessageIsReceived(mailSubjectName);

        await inboxPageWithNeededMail.openNeededMail(mailSubjectName)

        await inboxPageWithNeededMail.saveAttachmentToDocuments();

    
        const documentPage = new DocumentsPage(page);
        await documentPage.openDocumentsArea();
        await documentPage.moveToTrash(fileAttachment.fileName);

        await documentPage.checkReqieredDocumentIsInTrash(fileAttachment.fileName);
    
});

function dataIsDefined() {
    if (process.env.USER_MAIL === undefined) {
        throw new Error("Custom error: userMail is undefined");
    } else {
        if (userPassword === undefined) {
            throw new Error("Custom error: userPassword is undefined");
        } else {
            if (loginPageURL === undefined) {
                throw new Error("Custom error: loginPage is undefined");
            } else {
                return true;
            }
        }
    }
}

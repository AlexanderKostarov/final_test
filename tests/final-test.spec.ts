import { test, expect, Locator } from "@playwright/test";
import { Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import path from "path";
import { FileConfig, FileManager } from "../src/Utils/file-manager";
import { LoginPage } from "../src/Pages/login-page";
import { MessagePage } from "../src/Pages/messages-page";
import { SaveAttachment } from "../src/Page_Components/save-attachment";
import { DocumentsPage } from "../src/Pages/documents-page";
import { Header } from "../src/Pages/header";

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
    await loginPage.login(userMail!, userPassword!);

    const messagePage = new MessagePage(page);
    await messagePage.openNewMailForm();

    await messagePage.fillNewMailForm({userMail: userMail!, mailSubject: mailSubjectName, attachmentAddress: fileAttachment.filePath});
    await messagePage.sendMail();

    await messagePage.waitUntilMessageIsReceived(mailSubjectName);

    await messagePage.openMailBySubject(mailSubjectName);

    await messagePage.saveAttachmentToDocuments();

    const navigator = new Header(page)
    await navigator.navigateToDocumentPage()

    const documentPage = new DocumentsPage(page);
    await documentPage.navigateToMyDocuments();
    await documentPage.moveFileToTrash(fileAttachment.fileName);

    await documentPage.checkDocumentIsInTrash(fileAttachment.fileName);
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

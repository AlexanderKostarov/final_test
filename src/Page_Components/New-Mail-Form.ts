import { Page, test } from "@playwright/test"
import { ButtonElement } from "../Elements/button-element";
import { InputElement } from "../Elements/input-element";
import { AttachFile } from "./attach-file";
import { MessagesNavBar } from "./messages-nav-bar";



export class NewMailForm {
        page: Page
        mailRecipientField
        mailsubjectField
        attachFile
        sendMailButton
        newMailPage

        constructor(page: Page) {
            this.page = page
            this.mailRecipientField = new InputElement(this.page.locator('[type="text"][tabindex="1"]'), "Mail recipient");
            this.mailsubjectField = new InputElement(this.page.locator('[type="text"][tabindex="4"]'),"Mail subject");
            this.attachFile = new AttachFile(this.page)
            this.sendMailButton = new ButtonElement(this.page.locator("#mailSend"), "Send Mail");
            this.newMailPage = new MessagesNavBar(page)
        }
    
    async enterRecipientAddress(recipientAddress: string) {
        await this.mailRecipientField.enterText(recipientAddress);
    }

    async enterMailSubjectName(mailSubjectName: string) {
        await this.mailsubjectField.enterText(mailSubjectName);
    }

    async attachFileFunction(filePath: string) {
        await this.attachFile.attachFile(filePath)
    }

    async sendMail() {
        await this.sendMailButton.click();
    }

    async fillNewMailData(userMail: string, mailSubject: string, attachmentAddress: string) {
        await this.enterRecipientAddress(userMail)
        await this.enterMailSubjectName(mailSubject)
        await this.attachFileFunction(attachmentAddress)
    }
}
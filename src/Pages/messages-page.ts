import { Page, test } from "@playwright/test";
import { MessagesNavBar } from "../Page_Components/messages-nav-bar";
import { NewMailForm } from "../Page_Components/New-Mail-Form";
import { ReceivedMessage } from "../Page_Components/received-message";
import { SaveAttachment } from "../Page_Components/save-attachment";

export class MessagePage {
    page: Page;
    messageNavBar;
    newMailForm;
    receivedMessage;
    attachment

    constructor(page: Page) {
        this.page = page;
        this.messageNavBar = new MessagesNavBar(this.page);
        this.newMailForm = new NewMailForm(this.page);
        this.receivedMessage = new ReceivedMessage(this.page);
        this.attachment = new SaveAttachment(this.page)
    }

    async getToNewMailPage() {
        await test.step(`Get to New Mail page`, async () => {
            await this.messageNavBar.clickNewMailButton();
        });
    }

    async waitUntilMessageIsReceived(mailSubjectName: string) {
        await test.step("Check email is received", async () => {
            await this.receivedMessage.waitUntilMailIsReceived(mailSubjectName);
        })
    }

    async openNeededMail(mailSubjectName: string) {
        await test.step(`Open received mail`, async () => {
            await this.receivedMessage.openNeededMail(mailSubjectName);
        })
    }

    async fillNewMailData(userMail: string, mailSubject: string, attachmentLocation: string){
        await test.step(`Fill data for the new mail`, async () => {
            await this.newMailForm.fillNewMailData(userMail, mailSubject, attachmentLocation)
        })
    }
    async sendMail(){
        await test.step(`Send new mail`, async() => {
            await this.newMailForm.sendMail()
        })
    }
    async saveAttachmentToDocuments(){
        await test.step(`Save the attached file to documents`, async() => {
            await this.attachment.saveInDocuments()
        })
    }
}

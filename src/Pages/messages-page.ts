import { Page } from "@playwright/test"
import { MessagesNavBar } from "../Page_Components/messages-nav-bar"
import { NewMailForm } from "../Page_Components/New-Mail-Form"
import { MessageIsReceived } from "../Page_Components/message-is-received"

export class MessagePage {
    page: Page
    newMailButton
    newMailForm
    receivedMessage

    constructor(page: Page) {
        this.page = page
        this.newMailButton = new MessagesNavBar(this.page)
        this.newMailForm = new NewMailForm(this.page)
        this.receivedMessage = new MessageIsReceived(this.page)
    }

    async getToNewMailPage() {
        await this.newMailButton.clickNewMailButton()
    }

    async waitUntilMessageIsReceived(mailSubjectName: string){
        await this.receivedMessage.waitUntilMailIsReceived(mailSubjectName)
    }

    async openNeededMail(mailSubjectName: string) {
        await this.receivedMessage.openNeededMail(mailSubjectName)
    }
}
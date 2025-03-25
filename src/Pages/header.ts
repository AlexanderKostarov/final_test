import { Page, test } from "@playwright/test";
import { ButtonElement } from "../Elements/button-element";


export class Header{
    page: Page
    documentsButton
    messagesButton

    constructor(page: Page){
        this.page = page
        this.documentsButton = new ButtonElement(
                    page.locator('[id="nav-docs"]'),
                    "Documents page"
                );
        this.messagesButton = new ButtonElement(
            page.locator('[id="nav-mail"]'),
            "Messages page"
        );        

    }

    async navigateToDocumentPage() {
        await test.step(`Navigate to Documents page`, async () => {
            await this.documentsButton.click()
        });
    }

    async navigateToMessagesPage() {
        await this.messagesButton.click()
    }

}
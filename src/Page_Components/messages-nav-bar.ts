import { Page } from "@playwright/test"
import { ButtonElement } from "../Elements/button-element";

export class MessagesNavBar {
    page: Page
    newMailButton
    refreshButton

    constructor(page: Page) {
        this.page = page
        this.newMailButton = new ButtonElement(this.page.locator('[title="New"]'), "New Mail");
        this.refreshButton = new ButtonElement(this.page.locator('[title="Refresh"]'), "Refresh");
    }

    async clickNewMailButton() {
        await this.newMailButton.click()
    }

    async clickRefreshButton() {
        await this.refreshButton.click()
    }
}
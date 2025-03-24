import { Page } from "@playwright/test";
import { ButtonElement } from "../Elements/button-element";

export class MessageList {
    page: Page
    selectedMailButton

    constructor(page: Page){
        this.page = page
        this.selectedMailButton = new ButtonElement(
            page.locator(`[title = "${mailSubjectName}"]`),
            "Our received mail"
        );
    }

    async  
}
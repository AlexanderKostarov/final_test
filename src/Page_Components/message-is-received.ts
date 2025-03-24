import { Page } from "@playwright/test";
import { BaseElement } from "../Elements/base-element";
import { ButtonElement } from "../Elements/button-element";

export class MessageIsReceived {
    page: Page
    uploadedLettersElement
    refreshButton

    constructor(page: Page){
        this.page = page
        this.refreshButton = new ButtonElement(page.locator('[title="Refresh"]'), "Refresh");
        this.uploadedLettersElement = new BaseElement(page.locator('[class="GCSDBRWBBU"] [tabindex="0"]').first(), "all letters element");
    }

    async waitUntilMailIsReceived(mailSubjectName: string) {
        let tryNumber = 1;
        let isNeededMessageAppeared;
        const neededMailElement = new BaseElement(this.page.locator(`[title="${mailSubjectName}"]`), "mail locator")
        do {
            await this.refreshButton.click();
            try {
                await this.uploadedLettersElement.waitForElementAppears(2000);
                isNeededMessageAppeared = await neededMailElement.isVisibleElement();
            } catch {
                console.log(
                    `Element with all letters was not uploaded at the try #${tryNumber}`
                );
            }
            tryNumber++;
        } 
        while (tryNumber < 20 && !isNeededMessageAppeared);
    }

    async openNeededMail(mailSubjectName: string) {
        const selectedMailButton = new ButtonElement(this.page.locator(`[title = "${mailSubjectName}"]`), "Our received mail");
        await selectedMailButton.click()
    }
}

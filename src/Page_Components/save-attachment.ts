import { Page } from "@playwright/test";
import { BaseElement } from "../Elements/base-element";
import { ButtonElement } from "../Elements/button-element";

export class SaveAttachment {
    page: Page
    attachedFileElement
    attachedFilesDropdownButton
    saveInDocumentsButton
    saveToMyDocumentsFolderButton
    saveAttachmentButton

    constructor (page: Page) {
        this.page = page
        this.attachedFileElement = new BaseElement(page.locator('[class="GCSDBRWBJRB GCSDBRWBO"]'), "attached file");
        this.attachedFilesDropdownButton = new ButtonElement(page.locator('[class="GCSDBRWBJRB GCSDBRWBO"] [class="icon-Arrow-down"]'), "attached files dropwown");
        this.saveInDocumentsButton = new ButtonElement(page.locator('xpath=(//*[@class="GCSDBRWBOQ menu"])[1]'), "Save in documents");
        this.saveToMyDocumentsFolderButton = new ButtonElement(page.locator('[class="GCSDBRWBEY"] [class="GCSDBRWBDX treeItemRoot GCSDBRWBLX"]'),"Select My Documents folder");
        this.saveAttachmentButton = new ButtonElement(page.locator('[tabindex="0"][class="btn GCSDBRWBO defaultBtn"]'),"Save attachment");
    }

    async hoverElement() {
        await this.attachedFileElement.hoverElement()
    }
    async openDropdown() {
        await this.attachedFilesDropdownButton.click()
    }
    async saveInDocuments() {
        await this.saveInDocumentsButton.click()
        await this.saveToMyDocumentsFolderButton.click()
        await this.saveAttachmentButton.click()
    }

}
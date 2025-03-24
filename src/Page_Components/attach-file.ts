import { Page } from "@playwright/test"
import { ButtonElement } from "../Elements/button-element"
import { UploadElement } from "../Elements/upload-element"
import { BaseElement } from "../Elements/base-element"

export class AttachFile {
    page: Page
    addAttachmentButton
    uploadNewFileElement
    uploadedAttachmentElement

    constructor(page: Page){
        this.page = page
        this.addAttachmentButton = new ButtonElement(this.page.locator('xpath=(//*[@class="GCSDBRWBISB GCSDBRWBJSB"])[1]'),"attachment");
        this.uploadNewFileElement = new UploadElement(this.page.locator('[type="file"][name="docgwt-uid-33"]'), "From your computer");
        this.uploadedAttachmentElement = new BaseElement(this.page.locator('[class="GCSDBRWBJRB"]'),"uploaded attachment Element");    
    }

    async attachFile(filePath: string) {  // (await fileAttachment).filePath
        await this.addAttachmentButton.click();
        await this.uploadNewFileElement.uploadFile(filePath);
        await this.uploadedAttachmentElement.waitForElementAppears();
    }
}
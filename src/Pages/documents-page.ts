import { Page } from "@playwright/test"
import { ButtonElement } from "../Elements/button-element"
import { BaseElement } from "../Elements/base-element"

export class DocumentsPage {
    page: Page
    requiredDocumentTitle: string
    documentElement
    documentsAreaButton
    myDocumentsFolderButton
    trashFolderElement
    trashPageIdentifierElement
    documentForMoveElement

    constructor(page: Page, requiredDocumentTitle: string){
        this.page = page
        this.requiredDocumentTitle = requiredDocumentTitle
        this.documentElement = new BaseElement(
            page.locator(`[title="${this.requiredDocumentTitle}"]`),
            "downloaded document"
        );
        this.documentsAreaButton = new ButtonElement(
            page.locator('[id="nav-docs"]'),
            "Documents area"
        );
        this.myDocumentsFolderButton = new ButtonElement(
            page.locator(
                '[class="GCSDBRWBDX treeItemRoot GCSDBRWBLX nodeSel"]'
            ),
            "My documents folder"
        );
        this.trashFolderElement = new BaseElement(
            page.locator("#doc_tree_trash"),
            "Trash folder"
        );
        this.trashPageIdentifierElement = new BaseElement(
            page.locator('[class="GCSDBRWBBU"] [tabindex="0"]').first(),
            "trash page is opened"
        );
        this.documentForMoveElement = new BaseElement(
            page
                .locator('[class="GCSDBRWBFT GCSDBRWBCKB name"]')
                .filter({ hasText: `${this.requiredDocumentTitle}` }),
            "required doc element"
        );
    }

    async openDocumentsArea() {
        await this.documentsAreaButton.click();
        await this.myDocumentsFolderButton.click();
    }
    async waitForNeededDocumentAppears(){
        await this.documentElement.waitForElementAppears();
    }

    async moveToTrash() {
        const trashCoordinates = await this.trashFolderElement.getCoordinates();
        await this.documentForMoveElement.hoverElement();
        await this.page.mouse.down();
        if (trashCoordinates) {
            await this.page.mouse.move(
                trashCoordinates.x + trashCoordinates.width / 2,
                trashCoordinates.y + trashCoordinates.height / 2,
                { steps: 30 }
            );
        } else {
            throw new Error("Custom error: didn't find trash coordinates");
        }
        await this.page.mouse.up();
        await this.documentForMoveElement.waitForElementDissapears();
    }

    async getToTrashFolder() {
        await this.trashFolderElement.click()
    }

    async waitForTrashPageIdentifierElementAppears(){
        this.trashPageIdentifierElement.waitForElementAppears()
    }
    
    async checkReqieredDocumentIsInTrash(){
        this.documentForMoveElement.checkToBeVisible()
    }
}
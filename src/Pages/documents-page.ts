import { Page, test } from "@playwright/test";
import { ButtonElement } from "../Elements/button-element";
import { BaseElement } from "../Elements/base-element";

export class DocumentsPage {
    page: Page;
    documentsAreaButton;
    myDocumentsFolderButton;
    trashFolderElement;
    trashPageIdentifierElement;

    constructor(page: Page) {
        this.page = page;

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
    }

    async openDocumentsArea() {
        await test.step("Open documents area", async () => {
            await this.documentsAreaButton.click();
            await this.myDocumentsFolderButton.click();
        });
    }

    async moveToTrash(fileName: string) {
        await test.step("Move file from documents to trash folder by drag'n'drop action", async () => {
            const neededElement = new BaseElement(
                this.page
                    .locator('[class="GCSDBRWBFT GCSDBRWBCKB name"]')
                    .filter({ hasText: `${fileName}` }),
                "required doc element"
            );
           
            await neededElement.waitForElementAppears()
            
            const trashCoordinates = await this.trashFolderElement.getCoordinates();
            await neededElement.hoverElement();
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
            await neededElement.waitForElementDissapears();
        });
    }

    async getToTrashFolder() {
        await this.trashFolderElement.click();
    }

    async waitForTrashPageIdentifierElementAppears() {
        this.trashPageIdentifierElement.waitForElementAppears();
    }

    async checkReqieredDocumentIsInTrash(fileName: string) {
        await test.step("Check required file is in trash", async () => {
            await this.getToTrashFolder();
            await this.waitForTrashPageIdentifierElementAppears();
            const neededElement = new BaseElement(
                this.page
                    .locator('[class="GCSDBRWBFT GCSDBRWBCKB name"]')
                    .filter({ hasText: `${fileName}` }),
                "required doc element"
            );
            neededElement.checkToBeVisible();
        });
    }
}

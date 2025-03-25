import { Page, test, expect } from "@playwright/test";
import { ButtonElement } from "../Elements/button-element";
import { BaseElement } from "../Elements/base-element";
import { Header } from "./header";

export class DocumentsPage {
    page: Page;
    myDocumentsFolderButton;
    trashFolderElement;
    trashPageIdentifierElement;
    getElement = (fileName: string) => {
        return this.page
        .locator('[class="GCSDBRWBFT GCSDBRWBCKB name"]')
        .filter({ hasText: `${fileName}` })
    }
    fileElement = (fileName: string) => {
        return new BaseElement(
            this.page
                .locator('[class="GCSDBRWBFT GCSDBRWBCKB name"]')
                .filter({ hasText: `${fileName}` }),
            "required doc element"
        );
    };

    constructor(page: Page) {
        this.page = page;
        
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

    async navigateToMyDocuments() {
        await test.step("Open My documents", async () => {
            await this.myDocumentsFolderButton.click();
        });
    }

    async moveFileToTrash(fileName: string) {
        await test.step("Move file from documents to trash folder by drag'n'drop action", async () => {
            await this.fileElement(fileName).waitForElementAppears();

            const trashCoordinates =
                await this.trashFolderElement.getCoordinates();
            await this.fileElement(fileName).hoverElement();
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
            await this.fileElement(fileName).waitForElementDissapears();
        });
    }

    async openTrashFolder() {
        await this.trashFolderElement.click();
    }

    async waitForTrashPageIdentifierElementAppears() {
        this.trashPageIdentifierElement.waitForElementAppears();
    }

    async checkDocumentIsInTrash(fileName: string) {
        await test.step("Open trash folder", async () => {
            await this.openTrashFolder();
        });
        await test.step("Check required file is in trash", async () => {
         //   this.fileElement(fileName).IsVisible(); // expect use here
            await expect(this.getElement(fileName)).toBeVisible()   
        });
    }
}

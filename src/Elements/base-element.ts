import { Locator, Page, expect, test } from "@playwright/test";

export class BaseElement {
    locator: Locator;
    name: string;

    constructor(locator: Locator, name: string) {
        this.locator = locator;
        this.name = name;
    }

    getElement() {
        return this.locator;
    }

    async click() {
        await test.step(`${this.name} click`, async () => {
            await this.getElement().click();
        });
    }

    async isVisibleElement() {
        return await test.step(`${this.name} is visible`, async () => {
            return await this.getElement().isVisible();
        });
        //        return await this.getElement().isVisible();
    }

    async hoverElement() {
        await test.step(`${this.name} hover`, async () => {
            await this.getElement().hover();
        });
    }

    async getCoordinates() {
        return await test.step(`Get trash folder's coordinates`, async () => {
            return await this.getElement().boundingBox();
        });
    }

    async IsVisible() {
        await test.step(`check ${this.name} is visible`, async () => {
            await expect(this.getElement()).toBeVisible();
        });
    }

    async waitForElementAppears(timeout?: number) {
        await test.step(`wait for ${this.name} appearance`, async () => {
            await this.getElement().waitFor({
                state: "visible",
                timeout: timeout,
            });
        });
    }

    async waitForElementDissapears() {
        await test.step(`wait for ${this.name} dissapears`, async () => {
            await this.getElement().waitFor({
                state: "detached",
                timeout: 1000,
            });
        });
    }
}

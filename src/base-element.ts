import { Locator, Page, expect, test } from "@playwright/test";

export class BaseElement {
    locator: Locator
    private name: string = this.constructor.name

    constructor(locator: Locator, name?: string){
        this.locator = locator
        if(name) this.name=name
    }

    getElement() {
       return this.locator
    }

    async clickButton() {
        await this.getElement().click()
    }

    async isVisible() {
        return await this.getElement().isVisible();
    }

    async hoverElement() {
        await this.getElement().hover()
    }

    async getCoordinates() {
        return await this.getElement().boundingBox()
    }

    async checkToBeVisible() {
        await expect(this.getElement()).toBeVisible()
    }

    async waitForElementAppears() {
        await this.getElement().waitFor()
    }

}
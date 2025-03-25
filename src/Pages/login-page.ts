import { Page, test, Locator } from "@playwright/test";
import { ButtonElement } from "../Elements/button-element";
import { InputElement } from "../Elements/input-element";

export class LoginPage {
    page: Page;
    enterButton;
    userNameField;
    userPasswordField;

    constructor(page: Page) {
        this.page = page;
        this.enterButton = new ButtonElement(
            this.page.locator(".btn"),
            "Enter"
        );
        this.userNameField = new InputElement(
            this.page.locator("#UserID"),
            "UserID"
        );
        this.userPasswordField = new InputElement(
            this.page.locator("#Password"),
            "Password"
        );
    }

    async fillUserName(userName: string) {
        await this.userNameField.enterText(userName);
    }

    async fillUserPassword(userPassword: string) {
        await this.userPasswordField.enterText(userPassword);
    }

    async clickEnterButton() {
        await this.enterButton.click();
    }

    async login(userMail: string, userPassword: string) {
        await test.step("Login to mailfence", async () => {
            await this.fillUserName(userMail);
            await this.fillUserPassword(userPassword);
            await this.clickEnterButton();
        });
    }
}

import { Locator, test, Page } from '@playwright/test';
import { BaseElement } from './base-element';

export class InputElement extends BaseElement {


  constructor(locator: Locator, name: string) {
    super(locator, name)
  }

  // Method to enter text into the input field
  async enterText(text: string) {
    await test.step(`${this.name} input field`, async () => {
      await this.getElement().fill(text)
    })
    
  }


}
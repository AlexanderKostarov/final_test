import { Locator, Page } from '@playwright/test';
import { BaseElement } from './base-element';

export class InputElement extends BaseElement {


  constructor(locator: Locator, name?: string) {
    super(locator, name)
  }

  // Method to enter text into the input field
  async enterText(text: string) {
    await this.getElement().fill(text)
  }
}
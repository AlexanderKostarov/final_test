import { Locator, Page, test } from '@playwright/test';
import { BaseElement } from './base-element';

export class UploadElement extends BaseElement{

  constructor(locator: Locator, name: string) {
    super(locator, name)
  }

  // Method to upload a file by specifying the file path
  async uploadFile(filePath: string) {
    await test.step(`${this.name} element`, async() => {
      await this.getElement().setInputFiles(filePath); // Set the input file
    })
    
  }
}
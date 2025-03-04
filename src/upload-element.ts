import { Locator, Page } from '@playwright/test';
import { BaseElement } from './base-element';

export class UploadElement extends BaseElement{

  constructor(locator, name?) {
    super(locator, name)
  }

  // Method to upload a file by specifying the file path
  async uploadFile(filePath: string) {
    await this.getElement().setInputFiles(filePath); // Set the input file
  }
}
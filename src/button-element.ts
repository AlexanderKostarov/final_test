import { Locator, Page } from '@playwright/test';
import { BaseElement } from './base-element';

export class ButtonElement extends BaseElement {
    
    constructor(locator: Locator, name: string) {
        super(locator, name)
    }

    isEnabled() {
        return this.getElement().isEnabled();
    }
}
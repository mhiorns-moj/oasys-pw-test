import { Locator, Page } from '@playwright/test'


export class IconContainer {

    selector: Locator

    constructor(page: Page, selector: string) {

        this.selector = page.locator(selector)
    }

}

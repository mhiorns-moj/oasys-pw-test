import { Locator, expect, Page } from '@playwright/test'

import * as lib from 'lib'

export class IconContainer {

    selector: Locator

    constructor(page: Page, selector: string) {

        this.selector = page.locator(selector)
    }

}

import { Page } from '@playwright/test'

export class Radiogroup<T extends string> {

    selector: string
    browserPage: Page
    options: (T | '-')[]

    constructor(selector: string, browserPage: Page, options: (T | '-')[]) {

        this.browserPage = browserPage
        this.selector = selector
        this.options = options
    }

    async setValue(value: T) {

        if (value != null) {
            const itemNo = this.options.indexOf(value)
            const itemSuffix = itemNo == 0 ? '' : `-${itemNo + 1}`  // First item has no suffix on the id used to find it, remainder are -2, -3 etc
            await this.browserPage.locator(`${this.selector}${itemSuffix}`).click()
        }
    }
}

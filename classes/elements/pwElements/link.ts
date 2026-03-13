import { Page } from '@playwright/test'

export class Link {

    selector: string
    browserPage: Page

    constructor(selector: string, browserPage: Page) {

        this.selector = selector
        this.browserPage = browserPage
    }

    async click() {

        if (this.selector.startsWith('#') || this.selector.includes('[')) {
            await this.browserPage.locator(this.selector).click()
        } else {
            await this.browserPage.getByText(this.selector).click()
        }
    }

    async getFullText(): Promise<string> {

        const link = this.selector.startsWith('#') || this.selector.includes('[')
            ? this.browserPage.locator(this.selector)
            : this.browserPage.getByText(this.selector)

        return await link.textContent()
    }
}
import { Locator, Page } from '@playwright/test'


export class Link {

    selector: Locator

    constructor(readonly page: Page, selector: string) {

        this.selector = selector.startsWith('#') || selector.includes('[') || selector.includes('.')
            ? page.locator(selector)
            : page.getByRole('link', { name: selector })
    }

    async click() {

        await this.selector.first().click()
        await waitForPageUpdate(this.page)
    }

    async checkStatus(expectedStatus: ElementStatus) {

        const count = await this.selector.count()
        const actualStatus = count > 0 ? 'enabled' : 'notVisible'
        expect (actualStatus).toBe(expectedStatus)
    }

    async getFullText(): Promise<string> {

        return await this.selector.textContent()
    }
}
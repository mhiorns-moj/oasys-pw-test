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

    async checkStatus(expectedStatus: ElementStatus) {  // TODO 

        // cy.get('#content').then((containerDiv) => {

        //     const element = this.selector.startsWith('#') || this.selector.includes('[') ? containerDiv.find(this.selector) : containerDiv.find(`a:contains('${this.selector}')`)
        //     const actualStatus = element.length > 0 ? 'enabled' : 'notVisible'
        //     if (expectedStatus != actualStatus) {
        //         throw new Error(`Incorrect status for ${this.selector} - expected ${expectedStatus}, found ${actualStatus}`)
        //     }
        // })
    }

    async getFullText(): Promise<string> {

        return await this.selector.textContent()
    }
}
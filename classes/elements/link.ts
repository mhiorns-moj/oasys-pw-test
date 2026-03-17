import { Locator, Page, expect } from '@playwright/test'

import * as lib from 'lib'

export class Link {

    selector: Locator

    constructor(page: Page, selector: string) {

        this.selector = selector.startsWith('#') || selector.includes('[')
            ? page.locator(selector)
            : page.getByRole('link', { name: selector })
    }

    async click() {

        await this.selector.click()
        // oasys.Nav.waitForPageUpdate()
    }

    async checkStatus(expectedStatus: ElementStatus) {

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
import { Page } from '@playwright/test'

export class Button {

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
            await this.browserPage.getByRole('button', { name: this.selector }).click()
        }
    }

    async checkStatus(): Promise<ElementStatus> {

        const button = this.selector.startsWith('#') || this.selector.includes('[')
            ? this.browserPage.locator(this.selector)
            : this.browserPage.getByRole('button', { name: this.selector })

        const count = await button.count()
        if (count == 0) {
            return 'notVisible'
        }
        const visible = await button.isVisible()
        const disabled = await button.isDisabled()

        return !visible ? 'notVisible' : disabled ? 'visible' : 'enabled'
    }
}
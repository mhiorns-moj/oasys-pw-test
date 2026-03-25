import { Locator, Page } from '@playwright/test'


export class Button {

    selector: Locator

    constructor(page: Page, selector: string) {

        this.selector = selector.startsWith('#') || selector.includes('[')
            ? page.locator(selector).first()
            : page.getByRole('button', { name: selector }).first()
    }

    async click() {
        await this.selector.click()
    }

    async checkStatus(status: ElementStatus) {

        const actualStatus = await this.getStatus()
        expect(actualStatus).toBe(status)
    }

    async getStatus(): Promise<ElementStatus> {

        const count = await this.selector.count()
        if (count == 0) {
            return 'notVisible'
        }
        const visible = await this.selector.isVisible()
        const disabled = await this.selector.isDisabled()

        return !visible ? 'notVisible' : disabled ? 'visible' : 'enabled'
    }

    static async sanClick(page: Page, item: SanId) {

        await page.getByRole('button', { name: item.id }).first().click()
    }
}
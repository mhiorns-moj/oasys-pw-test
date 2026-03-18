import { Locator, expect, Page } from '@playwright/test'

import * as lib from 'lib'


export class Button {

    selector: Locator

    constructor(page: Page, selector: string) {

        this.selector = selector.startsWith('#') || selector.includes('[')
            ? page.locator(selector)
            : page.getByRole('button', { name: selector })
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
import { Page } from '@playwright/test'


export class Shuttle {

    constructor(readonly page: Page, readonly selector: string) { }

    async addItemUsingFilter(item: string) {

        await this.setFilter('left', item)
        await this.selectVisibleItem('left', 0)
        await this.clickButton('select')
    }

    async addItems(items: string[]) {

        for (const item of items) {
            await this.addItemUsingFilter(item)
        }

        log(`Added items to ${this.selector}: ${JSON.stringify(items)}`)
    }

    async setFilter(side: 'left' | 'right', filter: string) {

        const filterSelector = `#${side}Filter${this.selector}`
        await this.page.locator(filterSelector).pressSequentially(filter, { delay: 50 })
    }

    async clickButton(button: 'selectall' | 'select' | 'remove' | 'removeall') {

        const buttonSelector = `#${button}${this.selector}`
        await this.page.locator(buttonSelector).click()
    }

    async selectVisibleItem(side: 'left' | 'right', index: number) {

        const titleCaseSide = side.charAt(0).toUpperCase() + side.substring(1)
        await this.page.locator(`#select${titleCaseSide}${this.selector}`).locator('option').nth(index).click()
    }

}
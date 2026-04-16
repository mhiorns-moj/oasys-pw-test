import { Page } from '@playwright/test'


export class Shuttle {

    constructor(readonly page: Page, readonly selector: string) { }

    async addItemUsingFilter(item: string) {

        await this.setFilter('left', item)
        await this.selectVisibleItem('left', 0)
        await this.clickButton('select')
    }

    // async addItems(items: string[]) {

    //     await this.clickButton('removeall')

    //     items.forEach((item) => {
    //         await this.goToStart('left')
    //         await this.findAndSelect('left', item)
    //     })

    //     log(`Added items to ${this.selector}: ${JSON.stringify(items)}`)
    // }

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

    // async getItems(side: 'left' | 'right', alias: string) {

    //     const titleCaseSide = side.charAt(0).toUpperCase() + side.substring(1)
    //     cy.get(`#select${titleCaseSide}${this.selector}`).find('option').then((options) => {
    //         const items: string[] = []
    //         for (let i = 0; i < options.length; i++) {
    //             items.push(options[i].innerText)
    //         }
    //         cy.wrap(items).as(alias)
    //     })
    // }

    // async checkButtonEnabled(button: string, alias: string) {

    //     let result: ElementStatus = 'visible'

    //     cy.get(button).then((b) => {
    //         if (b.is(':enabled')) {
    //             result = 'enabled'
    //         }
    //     }).then(() => {
    //         cy.wrap(result).as(alias)
    //     })

    // }

    // async goToStart(side: 'left' | 'right') {

    //     this.clickUntilGone(side, 'prev')
    // }

    // async clickUntilGone(side: 'left' | 'right', button: 'prev' | 'next', attempt = 0) {

    //     if (attempt === 20) {
    //         throw new Error(`clickUntilGone failure for ${side}`)
    //     }

    //     const titleCaseSide = side.charAt(0).toUpperCase() + side.substring(1)
    //     const buttonSelector = `#${button}Page${titleCaseSide}${this.selector}`

    //     cy.get(`#shuttle${this.selector}`).then((shuttle) => {
    //         const enabled = shuttle.find(`${buttonSelector}:enabled`).length > 0
    //         if (enabled) {
    //             cy.get(buttonSelector).click()
    //             this.clickUntilGone(side, button, ++attempt)
    //         }
    //     })
    // }


    // async findAndSelect(side: 'left' | 'right', item: string, attempt = 0) {

    //     if (attempt === 20) {
    //         throw new Error(`findAndSelect failure for ${item}`)
    //     }

    //     const titleCaseSide = side.charAt(0).toUpperCase() + side.substring(1)
    //     const buttonSelector = `#nextPage${titleCaseSide}${this.selector}`

    //     this.getItems(side, 'visibleItems')
    //     cy.get<string[]>('@visibleItems').then((items) => {
    //         if (items.includes(item)) {
    //             cy.get(`#select${titleCaseSide}${this.selector}`).select(items.indexOf(item))
    //             this.clickButton('select')
    //         } else {
    //             cy.get(`#shuttle${this.selector}`).then((shuttle) => {
    //                 const enabled = shuttle.find(`${buttonSelector}:enabled`).length > 0
    //                 if (enabled) {
    //                     cy.get(buttonSelector).click()
    //                     this.findAndSelect(side, item, ++attempt)
    //                 }
    //             })
    //         }
    //     })

    // }
}
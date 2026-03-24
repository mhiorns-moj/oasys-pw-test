import { Locator, expect, Page } from '@playwright/test'

import * as lib from 'lib'

export class Shuttle {

    selector: Locator

    constructor(page: Page, selector: string) {

        this.selector = page.locator(selector)
    }

    addItemUsingFilter(item: string) {

        this.setFilter('left', item)
        this.selectVisibleItem('left', 0)
        this.clickButton('select')
    }

    addItems(items: string[]) {

        this.clickButton('removeall')

        items.forEach((item) => {
            this.goToStart('left')
            this.findAndSelect('left', item)
        })

        log(`Added items to ${this.selector}: ${JSON.stringify(items)}`)
    }

    setFilter(side: 'left' | 'right', filter: string) {

        const filterSelector = `#${side}Filter${this.selector}`
        cy.get(filterSelector).clear()
        if (filter != '') {
            cy.get(filterSelector).type(filter)
        }
    }

    clickButton(button: 'selectall' | 'select' | 'remove' | 'removeall') {

        const buttonSelector = `#${button}${this.selector}`
        cy.get(buttonSelector).click()
    }

    selectVisibleItem(side: 'left' | 'right', index: number) {

        const titleCaseSide = side.charAt(0).toUpperCase() + side.substring(1)
        cy.get(`#select${titleCaseSide}${this.selector}`).select(index)
    }

    getItems(side: 'left' | 'right', alias: string) {

        const titleCaseSide = side.charAt(0).toUpperCase() + side.substring(1)
        cy.get(`#select${titleCaseSide}${this.selector}`).find('option').then((options) => {
            const items: string[] = []
            for (let i = 0; i < options.length; i++) {
                items.push(options[i].innerText)
            }
            cy.wrap(items).as(alias)
        })
    }

    checkButtonEnabled(button: string, alias: string) {

        let result: ElementStatus = 'visible'

        cy.get(button).then((b) => {
            if (b.is(':enabled')) {
                result = 'enabled'
            }
        }).then(() => {
            cy.wrap(result).as(alias)
        })

    }

    goToStart(side: 'left' | 'right') {

        this.clickUntilGone(side, 'prev')
    }

    clickUntilGone(side: 'left' | 'right', button: 'prev' | 'next', attempt = 0) {

        if (attempt === 20) {
            throw new Error(`clickUntilGone failure for ${side}`)
        }

        const titleCaseSide = side.charAt(0).toUpperCase() + side.substring(1)
        const buttonSelector = `#${button}Page${titleCaseSide}${this.selector}`

        cy.get(`#shuttle${this.selector}`).then((shuttle) => {
            const enabled = shuttle.find(`${buttonSelector}:enabled`).length > 0
            if (enabled) {
                cy.get(buttonSelector).click()
                this.clickUntilGone(side, button, ++attempt)
            }
        })
    }


    findAndSelect(side: 'left' | 'right', item: string, attempt = 0) {

        if (attempt === 20) {
            throw new Error(`findAndSelect failure for ${item}`)
        }

        const titleCaseSide = side.charAt(0).toUpperCase() + side.substring(1)
        const buttonSelector = `#nextPage${titleCaseSide}${this.selector}`

        this.getItems(side, 'visibleItems')
        cy.get<string[]>('@visibleItems').then((items) => {
            if (items.includes(item)) {
                cy.get(`#select${titleCaseSide}${this.selector}`).select(items.indexOf(item))
                this.clickButton('select')
            } else {
                cy.get(`#shuttle${this.selector}`).then((shuttle) => {
                    const enabled = shuttle.find(`${buttonSelector}:enabled`).length > 0
                    if (enabled) {
                        cy.get(buttonSelector).click()
                        this.findAndSelect(side, item, ++attempt)
                    }
                })
            }
        })

    }
}
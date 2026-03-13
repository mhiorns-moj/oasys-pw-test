import { Locator, expect, Page } from '@playwright/test'

import * as oasys from 'lib'

export class Lov {

    selector: Locator

    constructor(page: Page, selector: string) {

        this.selector = page.locator(selector)
    }

    setValue(value: string) {
        let id = this.selector.charAt(0) == '#' ? this.selector.substring(1) : this.selector
        let div = `div[aria-labelledby='${id}']`
        cy.get(`${div} a`).click()

        cy.get(`iframe[title='Search Dialog']`).its('0.contentDocument.body').as('iframe')
        cy.get('@iframe').find('#SEARCH').type(value)
        cy.get('@iframe').find(`input[type='button'][value='Search']`).click()
        cy.get('@iframe').find('a').contains(value).click()
    }

    checkValue(value: string) {

        let id = this.selector.charAt(0) == '#' ? this.selector.substring(1) : this.selector
        let div = `div[aria-labelledby='${id}']`
        cy.get(`${div} input`).should('have.attr', 'title').then((title) => { expect(title).to.contain(value) })
    }

    getValue(alias: string) {

        let id = this.selector.charAt(0) == '#' ? this.selector.substring(1) : this.selector
        let div = `div[aria-labelledby='${id}']`
        cy.get(`${div} input`).invoke('val').as(alias)
    }

    /**
     * Gets the current status and value of a text or input element, assumes it exists
     * Parameter is a Cypress alias which can then be used to access the return value.
     * The return value is an ElementStatusAndValue object, containing status and value properties.
     */
    getStatusAndValue(alias: string) {

        let result: ElementStatusAndValue = { status: 'notVisible', value: '' }

        cy.get('#content').then((containerDiv) => {

            let element = containerDiv.find(this.selector)

            if (element.length > 0) { // If element exists in the DOM

                if (element.is(':visible')) {

                    result.status = 'enabled'

                    this.getValue('val')
                    cy.get('@val').then((val) => result.value = val.toString())

                    if (!element.is(':enabled')) {
                        let id = this.selector.charAt(0) == '#' ? this.selector.substring(1) : this.selector
                        let div = `div[aria-labelledby='${id}']`
                        let lovButton = containerDiv.find(`${div} a`)
                        if (!lovButton.is(':visible')) {
                            result.status = 'readonly'
                        }
                    }
                }
            }

        })
        cy.wrap(result).as(alias)
    }

    checkOptionNotPresent(option: string) {

        let id = this.selector.charAt(0) == '#' ? this.selector.substring(1) : this.selector
        let div = `div[aria-labelledby='${id}']`
        cy.get(`${div} a`).click()

        cy.get(`iframe[title='Search Dialog']`).its('0.contentDocument.body').as('iframe')
        cy.get('@iframe').find('#SEARCH').type(option)
        cy.get('@iframe').find(`input[type='button'][value='Search']`).click()
        cy.get('@iframe').then((frame) => {

            if (frame.find(`a:contains('${option}')`).length > 0) {
                throw new Error(`${this.selector}: expected ${option} not to be available`)
            }
        })
        cy.get(`button[title='Close']`).click()
    }
}

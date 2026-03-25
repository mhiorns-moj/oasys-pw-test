import { Page } from '@playwright/test'


export class Lov {

    constructor(readonly page: Page, readonly selector: string) { }

    async setValue(value: string) {

        let id = this.selector.charAt(0) == '#' ? this.selector.substring(1) : this.selector
        let link = `div[aria-labelledby='${id}'] a`
        await this.page.locator(link).click()

        const frame = this.page.locator(`iframe[title='Search Dialog']`).contentFrame()
        await frame.locator('#SEARCH').fill(value)
        await frame.locator(`input[type='button'][value='Search']`).click()
        await frame.getByRole('link').filter({ hasText: value }).click()
    }

    // checkValue(value: string) {

    //     let id = this.selector.charAt(0) == '#' ? this.selector.substring(1) : this.selector
    //     let div = `div[aria-labelledby='${id}']`
    //     cy.get(`${div} input`).should('have.attr', 'title').then((title) => { expect(title).to.contain(value) })
    // }

    async getValue(): Promise<string> {

        let id = this.selector.charAt(0) == '#' ? this.selector.substring(1) : this.selector
        let div = `div[aria-labelledby='${id}']`
        return await this.page.locator(`${div} input`).inputValue()
    }

    /**
     * Gets the current status and value of a text or input element, assumes it exists
     * Parameter is a Cypress alias which can then be used to access the return value.
     * The return value is an ElementStatusAndValue object, containing status and value properties.
     */
    // getStatusAndValue(alias: string) {

    //     let result: ElementStatusAndValue = { status: 'notVisible', value: '' }

    //     cy.get('#content').then((containerDiv) => {

    //         let element = containerDiv.find(this.selector)

    //         if (element.length > 0) { // If element exists in the DOM

    //             if (element.is(':visible')) {

    //                 result.status = 'enabled'

    //                 this.getValue('val')
    //                 cy.get('@val').then((val) => result.value = val.toString())

    //                 if (!element.is(':enabled')) {
    //                     let id = this.selector.charAt(0) == '#' ? this.selector.substring(1) : this.selector
    //                     let div = `div[aria-labelledby='${id}']`
    //                     let lovButton = containerDiv.find(`${div} a`)
    //                     if (!lovButton.is(':visible')) {
    //                         result.status = 'readonly'
    //                     }
    //                 }
    //             }
    //         }

    //     })
    //     cy.wrap(result).as(alias)
    // }

    async checkValueNotPresent(value: string) {

        let id = this.selector.charAt(0) == '#' ? this.selector.substring(1) : this.selector
        let link = `div[aria-labelledby='${id}'] a`
        await this.page.locator(link).click()

        const frame = this.page.locator(`iframe[title='Search Dialog']`).contentFrame()
        await frame.locator('#SEARCH').fill(value)
        await frame.locator(`input[type='button'][value='Search']`).click()

        await frame.getByRole('link').filter({ hasText: '- All -' }).isVisible()  // Wait for search results
        const count = await frame.getByRole('link').filter({ hasText: value }).count()
        expect(count).toBe(0)

        await this.page.locator('button[title="Close"]').click()
    }
}

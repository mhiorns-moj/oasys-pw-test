import { Locator, Page } from '@playwright/test'


export class Checkbox {

    selector: Locator

    constructor(page: Page, selector: string) {

        this.selector = page.locator(selector)
    }

    async setValue(value: boolean) {

        if (value) {
            await this.selector.check()
        }
        else {
            await this.selector.uncheck()
        }
    }

    // checkValue(value: boolean) {

    //     if (value) {
    //         cy.get(this.selector).should('be.checked')
    //     }
    //     else {
    //         cy.get(this.selector).should('not.be.checked')
    //     }
    // }

    // checkStatus(status: ElementStatus) {

    //     this.getStatusAndValue('result')
    //     cy.get<ElementStatusAndValue>('@result').then((result) => {
    //         if (status != result.status) {
    //             throw new Error(`Incorrect status for ${this.selector}: expected ${status}, found ${result.status}`)
    //         }
    //     })
    // }

    /**
     * Gets the current value the checkbox, assumes it exists.
     */
    // getValue() {

    //     cy.get(this.selector).invoke('prop', 'checked').as(alias)
    // }


    /**
    * Gets the current status and value of a text element, assumes it exists
    * The return value is an ElementStatusAndValue object, containing status and value properties.
    */
    async getStatusAndValue(): Promise<ElementStatusAndValue> {

        const result: ElementStatusAndValue = { status: 'notVisible', value: '' }

        const count = await this.selector.count()

        if (count == 0) {
            return result
        }
        const visible = await this.selector.isVisible()
        const disabled = await this.selector.isDisabled()

        result.status = !visible ? 'notVisible' : disabled ? 'visible' : 'enabled'
        result.value = this.selector.isChecked().toString()

        return result
    }

    /**
     * Select any number of items in a group of checkboxes.  Parameters are:
     *   - item: a SanId defining a San checkbox group
     *   - item: comma-separated list of the name(s) of the item(s) to select.  Any options not included in the list will be unchecked (empty string to clear all).
     */
    static async sanSetValue(page: Page, item: SanId, value: string) {

        const itemsToCheck = value.split(',').map((item) => item.trim())

        for (let i = 0; i < item.options.length; i++) {
            const itemSuffix = i == 0 ? '' : `-${i + 1}`

            if (itemsToCheck.includes(item.options[i])) {
                await page.locator(`${item.id}${itemSuffix}`).check()

            } else if (item.options[i] != '-') {   // '-' is used as a separator in the list of IDs
                const elementCount = await page.locator(`${item.id}${itemSuffix}:visible`).count()
                if (elementCount == 1) {
                    await page.locator(`${item.id}${itemSuffix}`).uncheck()
                }
            }
        }
    }
}

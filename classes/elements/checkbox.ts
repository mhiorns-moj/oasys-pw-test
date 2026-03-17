import { Locator, expect, Page } from '@playwright/test'

import * as lib from 'lib'

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

}

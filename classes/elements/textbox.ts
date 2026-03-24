import { Locator, expect, Page } from '@playwright/test'

import * as lib from 'lib'

export class Textbox<T> {

    selector: Locator

    constructor(readonly page: Page, selector: string, readonly slowType: boolean = false) {

        this.selector = page.locator(selector)
    }

    async setValue(value: T) {

        let textValue = value as string
        if (value == null) {
            textValue = ''
        } else if (typeof value == 'number') {
            textValue = value == 0 ? '0' : value.toString()
        } else if (typeof value != 'string') {
            textValue = lib.OasysDateTime.oasysDateAsString(value as OasysDate)
        }
        if (this.slowType) {  // Handle date fields, the normal fill doesn't work for these
            await this.selector.click()
            await this.page.waitForTimeout(50)
            await this.selector.pressSequentially(textValue, { delay: 50 })
        } else {
            await this.selector.fill(textValue)
        }
    }

    async checkValue(value: T, partial: boolean = false) {

        let textValue = value as string
        if (value == null) {
            textValue = ''
        } else if (typeof value == 'number') {
            textValue = value == 0 ? '0' : value.toString()
        } else if (typeof value != 'string') {
            textValue = lib.OasysDateTime.oasysDateAsString(value as OasysDate)
        }

        const statusAndValue = await this.getStatusAndValue()
        if (partial) {
            expect(statusAndValue.value).toContain(value)
        } else {
            expect(statusAndValue.value).toBe(textValue)
        }
    }

    async getValue(): Promise<string> {

        const statusAndValue = await this.getStatusAndValue()
        return statusAndValue.value
    }

    // checkStatus(status: ElementStatus) {

    //     this.getStatusAndValue('result')
    //     cy.get<ElementStatusAndValue>('@result').then((result) => {
    //         if (status != result.status) {
    //             throw new Error(`Incorrect status for ${this.selector}: expected ${status}, found ${result.status}`)
    //         }
    //     })
    // }

    // checkLabel(label: string) {

    //     cy.get(this.selector).parent().parent().parent().find('label').then((labelElement) => {
    //         const actualLabel = labelElement[0].textContent
    //         if (actualLabel != label) {
    //             throw new Error(`Incorrect label for ${this.selector}: expected '${label}', found '${actualLabel}'`)
    //         }
    //     })
    // }

    /**
     * Gets the current status and value of a text element, assumes it exists
     * 
     * The return value is an ElementStatusAndValue object, containing status and value properties.
     */
    async getStatusAndValue(): Promise<ElementStatusAndValue> {

        const result: ElementStatusAndValue = { status: 'notVisible', value: '' }
        const count = await this.selector.count()

        if (count > 0) { // If element exists in the DOM

            const visible = await this.selector.isVisible()
            if (visible) {
                result.status = 'enabled'
                result.value = await this.selector.textContent()

                let readonly = await this.selector.isEditable()
                if (readonly) {
                    result.status = 'readonly'
                } else {
                    readonly = (await this.selector.getAttribute('input_readonly')) == 'true' ||
                        (await this.selector.getAttribute('readonly')) == 'true' ||
                        (await this.selector.getAttribute('mimic_readonly')) == 'true'
                    if (readonly) {
                        result.status = 'readonly'
                    }
                }
            }

        }
        return result
    }


    /**
     * Enter text in a textbox.  Parameters are:
     *   - item: a SanId defining a San textbox
     *   - text: the text to enter
     */
    static async sanSetValue(page: Page, item: SanId, value: string) {

        await page.locator(item.id).fill(value)
    }

    /**
     * Check the text in a textbox.  Parameters are:
     *   - item: a SanId defining a San textbox
     *   - text: the text to check
     */
    static async sanCheckValue(page: Page, item: SanId, value: string) {

        await expect(page.locator(item.id)).toHaveText(value)
    }

}

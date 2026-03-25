import { Locator, Page } from '@playwright/test'
import { OasysPage } from 'classes/oasysPage'


export class Select<T extends string> {

    private selector: Locator
    private roSelector: Locator

    constructor(private readonly page: Page, selector: string) {

        this.selector = page.locator(selector)
        this.roSelector = page.locator(`#XI_${selector.substring(1)}`)
    }

    async setValue(value: T) {

        await this.selector.selectOption(value as string)
        await waitForPageUpdate(this.page, 10)
    }

    async setValueByIndex(index: number) {

        await this.selector.selectOption({ index: index })
    }

    async checkValue(value: T) {

        const statusAndValue = await this.getStatusAndValue()
        expect(statusAndValue.value).toBe(value as string)
    }

    async getValue(): Promise<string> {

        return await this.selector.textContent()
    }

    // checkStatus(status: ElementStatus) {

    //     this.getStatusAndValue('result')
    //     cy.get<ElementStatusAndValue>('@result').then((result) => {
    //         if (status != result.status) {
    //             throw new Error(`Incorrect status for ${ this.selector }: expected ${ status }, found ${ result.status } `)
    //         }
    //     })
    // }

    // checkStatusAndValue(status: ElementStatus, value: T) {

    //     this.getStatusAndValue('result')
    //     cy.get<ElementStatusAndValue>('@result').then((result) => {
    //         expect(result.status).to.equal(status)
    //         if (status != 'notVisible') {
    //             this.checkValue(value)
    //         }
    //     })
    // }

    // checkOptions(expectedOptions: string[]) {

    //     cy.get(this.selector).children('option').then((elements) => {
    //         const actualOptions: string[] = []
    //         for (let i = 0; i < elements.length; i++) {
    //             actualOptions.push(elements[i].text)
    //         }
    //         if (actualOptions.length != expectedOptions.length) {
    //             throw new Error(`${ this.selector }: expected ${ JSON.stringify(expectedOptions) }, actual: ${ JSON.stringify(actualOptions) } `)
    //         }
    //         for (let i = 0; i < actualOptions.length; i++) {
    //             if (!expectedOptions.includes(actualOptions[i])) {
    //                 throw new Error(`${ this.selector }: expected ${ JSON.stringify(expectedOptions) }, actual: ${ JSON.stringify(actualOptions) } `)
    //             }
    //         }
    //     })
    // }

    async checkOptionNotAvailable(option: T) {

        const options = await this.getOptions()
        expect(options).not.toContain(option as string)
    }

    /**
     * Gets the current status and value of a select element, assumes it exists
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
                result.value = await this.selector.evaluate((sel: HTMLSelectElement) => sel.options[sel.options.selectedIndex].textContent)

                let readonly = await this.selector.isEditable()
                if (readonly) {
                    result.status = 'readonly'
                }
            } else {
                // If the select is not visible, check for the related read-only text box
                const roCount = await this.roSelector.count()
                if (roCount > 0) {
                    const roVisible = await this.roSelector.isVisible()
                    if (roVisible) {
                        result.status = 'readonly'
                        result.value = await this.roSelector.textContent()
                    }
                }
            }

        }
        return result
    }

    async getOptions(): Promise<string[]> {

        return await this.selector.locator('option').allTextContents()
    }

    /**
     * Select an item in a combo box.  Parameters are:
     *   - item: a SanId defining a San combo
     *   - text: the text to select
     */
    static async sanSetValue(page: Page, item: SanId, value: string) {

        await page.locator(item.id).selectOption(value as string)
    }
}

import { Locator, Page } from '@playwright/test'


export class Text {

    private selector: Locator

    constructor(page: Page, selector: string) {

        this.selector = page.locator(selector)
    }

    /**
     * Check if the element contains the specified text.  The optional second parameter can be set to true to indicate a partial match (i.e. contains rather than equals).
     */
    async checkValue(value: string, partial: boolean = false) {

        const actualValue = await this.selector.textContent()
        if (partial) {
            expect(actualValue).toContain(value)
        } else {
            expect(actualValue).toEqual(value)
        }
    }

    async getValue(): Promise<string> {

        const statusAndValue = await this.getStatusAndValue()
        return statusAndValue.value
    }

    async checkStatus(status: ElementStatus) {

        const statusAndValue = await this.getStatusAndValue()
        expect(statusAndValue.status).toEqual(status)
    }

    async logValue(desc: string = null) {

        const statusAndValue = await this.getStatusAndValue()
        log(`${desc || this.selector}: ${statusAndValue.value}`)
    }

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

        result.status = visible ? 'visible' : 'notVisible'
        result.value = await this.selector.innerText()

        return result
    }
}

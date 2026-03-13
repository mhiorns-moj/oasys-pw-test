export class Select<T extends string> {

    selector: string

    constructor(selector: string) {

        this.selector = selector
    }

    setValue(value: T) {

        let textValue = value as string
        cy.get(this.selector).select(textValue)
        cy.wait(1)  // A small delay forces Cypress find elements again in case the select triggers a page update.
    }

    setValueByIndex(index: number) {

        cy.get(this.selector).select(index)
        cy.wait(1)
    }

    checkValue(value: T) {

        let textValue = value as string
        this.getStatusAndValue('result')
        cy.get<ElementStatusAndValue>('@result').then((result) => {
            if (textValue != result.value.trim()) {
                throw new Error(`Incorrect value for ${this.selector}: expected ${textValue}, found ${result.value.trim()}`)
            }
        })
    }

    getValue(alias: string) {

        cy.get(this.selector).find(':selected').invoke('text').as(alias)
    }

    checkStatus(status: ElementStatus) {

        this.getStatusAndValue('result')
        cy.get<ElementStatusAndValue>('@result').then((result) => {
            if (status != result.status) {
                throw new Error(`Incorrect status for ${this.selector}: expected ${status}, found ${result.status}`)
            }
        })
    }

    checkStatusAndValue(status: ElementStatus, value: T) {

        this.getStatusAndValue('result')
        cy.get<ElementStatusAndValue>('@result').then((result) => {
            expect(result.status).to.equal(status)
            if (status != 'notVisible') {
                this.checkValue(value)
            }
        })
    }

    checkOptions(expectedOptions: string[]) {

        cy.get(this.selector).children('option').then((elements) => {
            const actualOptions: string[] = []
            for (let i = 0; i < elements.length; i++) {
                actualOptions.push(elements[i].text)
            }
            if (actualOptions.length != expectedOptions.length) {
                throw new Error(`${this.selector}: expected ${JSON.stringify(expectedOptions)}, actual: ${JSON.stringify(actualOptions)}`)
            }
            for (let i = 0; i < actualOptions.length; i++) {
                if (!expectedOptions.includes(actualOptions[i])) {
                    throw new Error(`${this.selector}: expected ${JSON.stringify(expectedOptions)}, actual: ${JSON.stringify(actualOptions)}`)
                }
            }
        })
    }

    checkOptionNotAvailable(option: T) {

        cy.get(this.selector).children('option').then((elements) => {
            const actualOptions: string[] = []
            for (let i = 0; i < elements.length; i++) {
                actualOptions.push(elements[i].text)
            }
            if (actualOptions.includes(option)) {
                throw new Error(`${this.selector}: includes unexpected option ${option}`)
            }
        })
    }

    /**
     * Gets the current status and value of a select element, assumes it exists
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
                        result.status = 'readonly'
                    }

                } else {
                    // If the select is not visible, check for the related read-only text box
                    let roSelector = `#XI_${this.selector.substring(1)}`

                    if (containerDiv.find(roSelector).length > 0 && containerDiv.find(roSelector).is(':visible')) {
                        result.status = 'readonly'
                        cy.get(roSelector).invoke('val').then((val: string) => result.value = val)
                    }
                }
            }

        })
        cy.wrap(result).as(alias)
    }

}

export class Text {

    selector: string

    constructor(selector: string) {

        this.selector = selector
    }

    /**
     * Check if the element contains the specified text.  The optional second parameter can be set to true to indicate a partial match (i.e. contains rather than equals).
     */
    checkValue(value: string, partial: boolean = false) {

        cy.get(this.selector).should(partial ? 'contain' : 'have.text', value)
    }

    getValue(alias: string) {

        cy.get(this.selector).invoke('val').as(alias)
    }

    checkStatus(status: ElementStatus) {

        this.getStatusAndValue('result')
        cy.get<ElementStatusAndValue>('@result').then((result) => {
            if (status != result.status) {
                throw new Error(`Incorrect status for ${this.selector}: expected ${status}, found ${result.status}`)
            }
        })
    }

    /**
     * Gets the current status and value of a text element, assumes it exists
     * Parameter is a Cypress alias which can then be used to access the return value.
     * The return value is an ElementStatusAndValue object, containing status and value properties.
     */
    getStatusAndValue(alias: string) {

        let result: ElementStatusAndValue = { status: 'notVisible', value: '' }

        cy.get('#content').then((containerDiv) => {

            let element = containerDiv.find(this.selector)

            if (element.length > 0) { // If element exists in the DOM

                if (element.is(':visible')) {
                    result.status = 'visible'
                }
            }

        })
        cy.wrap(result).as(alias)
    }
}

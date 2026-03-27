export class TextEditor {

    selector: string

    constructor(selector: string) {

        this.selector = selector
    }

    setValue(value: string) {

        let id = this.selector.charAt(0) == '#' ? this.selector.substring(1) : this.selector
        let div = `div[aria-labelledby='${id}']`
        cy.get(div).find('iframe').its('0.contentDocument').as('iframe')
        cy.get('@iframe').find('body').type(value)
    }

    checkValue(value: string) {

        let id = this.selector.charAt(0) == '#' ? this.selector.substring(1) : this.selector
        let div = `div[aria-labelledby='${id}']`
        cy.get(div).find('iframe').its('0.contentDocument.body').as('iframe')
        cy.get('@iframe').find('p').should('have.text', value)
    }

    getValue(alias: string) {

        let id = this.selector.charAt(0) == '#' ? this.selector.substring(1) : this.selector
        let div = `div[aria-labelledby='${id}']`
        cy.get(div).find('iframe').its('0.contentDocument.body').as('iframe')
        cy.get('@iframe').find('p').invoke('text').as(alias)
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
                        result.status = 'readonly'
                    }
                }
            }

        })
        cy.wrap(result).as(alias)
    }

}

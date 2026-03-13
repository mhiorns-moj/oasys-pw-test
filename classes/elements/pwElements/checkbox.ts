export class Checkbox {

    selector: string

    constructor(selector: string) {

        this.selector = selector
    }

    setValue(value: boolean) {

        if (value) {
            cy.get(this.selector).check()
        }
        else {
            cy.get(this.selector).uncheck()
        }
        this.checkValue(value)
    }

    checkValue(value: boolean) {

        if (value) {
            cy.get(this.selector).should('be.checked')
        }
        else {
            cy.get(this.selector).should('not.be.checked')
        }
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
     * Gets the current value the checkbox, assumes it exists.
     * Parameter is a Cypress alias which can then be used to access the return value.
     */
    getValue(alias: string) {

        cy.get(this.selector).invoke('prop', 'checked').as(alias)
    }


    /**
     * Gets the current status and value of the checkbox, assumes it exists
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

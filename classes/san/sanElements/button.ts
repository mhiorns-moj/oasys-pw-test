export class Button {

    selector: string

    constructor(selector: string) {

        this.selector = selector
    }

    click() {
        if (this.selector.startsWith('#') || this.selector.includes('[')) {
            cy.get(this.selector).eq(0).click()
        } else {
            cy.get(`button[value='${this.selector}']`).eq(0).click()  // Handle duplicate matches (e.g. Save button on assessment) by selecting the first match
        }
    }

    checkStatus(status: ElementStatus) {

        this.getStatus('result')
        cy.get<ElementStatus>('@result').then((result) => {
            if (status != result) {
                throw new Error(`Incorrect status for ${this.selector}: expected ${status}, found ${result}`)
            }
        })
    }

    /**
     * Gets the current status button
     * Parameter is a Cypress alias which can then be used to access the return value.
     * The return value is a status object.
     */
    getStatus(alias: string) {

        let result: ElementStatus = 'notVisible'

        const s = (this.selector.startsWith('#') || this.selector.includes('[')) ? this.selector : `button[value='${this.selector}']`
        cy.get('#container').then((content) => {
            if (content.find(s).length > 0) {
                result = 'enabled'
            }
        }).then(() => {
            cy.wrap(result).as(alias)
        })

    }

}
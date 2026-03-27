
export class Link {

    selector: string

    constructor(selector: string) {

        this.selector = selector
    }

    click() {

        if (this.selector.startsWith('#') || this.selector.startsWith('.') || this.selector.includes('[')) {
            cy.get(this.selector).eq(0).click()
        } else {
            cy.contains('a', this.selector).click()
        }
        oasys.Nav.waitForPageUpdate()
    }

    checkStatus(expectedStatus: ElementStatus) {

        cy.get('#content').then((containerDiv) => {

            const element = this.selector.startsWith('#') || this.selector.includes('[') ? containerDiv.find(this.selector) : containerDiv.find(`a:contains('${this.selector}')`)
            const actualStatus = element.length > 0 ? 'enabled' : 'notVisible'
            if (expectedStatus != actualStatus) {
                throw new Error(`Incorrect status for ${this.selector} - expected ${expectedStatus}, found ${actualStatus}`)
            }
        })
    }
}
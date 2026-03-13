/**
 * __oasys.Nav.*function*__  
 * 
 * Top-level library functions such as login and history.
 * 
 * See also the [`Page`](../../Classes/classes/page.Page.html) class which has a `goto()` method to navigate through the OASys menus 
 * as well as other methods to interact with pre-defined elements on OASys pages.  
 * @module Navigation
 */



/**
 * Goto any of the predefined OASys pages, assuming the relevant menu option is available on screen.
 * 
 * Returns a page object that can be used to populate items on the page.
 */
export function goto<Type extends OasysPage>(p: { new(): Type }): Type {
    return new p().goto()
}


/**
 * Waits a short time for the Please Wait or 'updating' element to appear, then (if shown) waits (using the standard Cypress timeout) for it to disappear again.
 */
export function waitForPageUpdate() {

    let updatingElement = '*[class~="blockUI"],*[class~="u-Processing"]'

    cy.wait(500)
    if (Cypress.$(updatingElement).length > 0) {
        cy.get(updatingElement).should('not.exist')  // If shown, wait for it to go
    }
}

/**
 * Clicks the button that should trigger an alert, optionally checks the alert text then and accepts the alert.
 */
export function handleAlert(buttonToClick: string, exptectedText: string = null) {

    // Set up a Cypress event to trap the alert
    cy.on('window:confirm', (str) => {
        if (exptectedText != null) {
            expect(str).to.equal(exptectedText)
        }
    })
    clickButton(buttonToClick)
}


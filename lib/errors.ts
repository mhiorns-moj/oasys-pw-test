/**
 * __oasys.Errors.*function*__  
 * 
 * Functions for checking errors displayed to the user.
 * 
 * @module Errors
*/


/**
 * Check for a message in the standard OASys error banner, fails the test if it is not visible.
 */
export function checkErrorMessage(message: string) {

    cy.contains('p', 'Error(s) have occurred').should('be.visible')
    cy.get('.a-Notification-list').children('li').then((elements) => {
        const errors: string[] = []
        for (let i = 0; i < elements.length; i++) {
            errors.push(elements[i].innerText)
        }
        if (!errors.includes(message)) {
            throw new Error(`Error message ${message} not found.  Errors found: ${JSON.stringify(errors)}`)
        }
    })
}

/**
 * Checks that the errors listed in the specified data file are visible on the sign & lock page.  Fails the test if any are missing.
 * 
 * Assumes that the file is in data/errorText; the parameter passed should be just the filename without folder or extension.
 */
export function checkSignAndLockErrorsVisible(errorFile: string) {

    cy.log(`Checking for errors listed in data/errorText/${errorFile}`)
    cy.fixture<string[]>(`errorText/${errorFile}`).then((errors) => {
        errors.forEach((error) => {
            cy.contains('td', error).should('be.visible')
        })
    })
}

/**
 * Checks that the errors listed in the specified data file are NOT visible on the sign & lock page.  Fails the test if any are visible.
 * 
 * Assumes that the file is in data/errorText; the parameter passed should be just the filename without folder or extension.
 */
export function checkSignAndLockErrorsNotVisible(errorFile: string) {

    cy.log(`Checking for errors listed in data/errorText/${errorFile}`)
    cy.fixture<string[]>(`errorText/${errorFile}`).then((errors) => {
        errors.forEach((error) => {
            cy.contains('td', error).should('not.exist')
        })
    })
}

/**
 * Checks that single given error is visible/not visible on the sign & lock page, fails the test if not.
 */
export function checkSingleSignAndLockError(error: string, expectVisible: boolean) {

    if (expectVisible) {
        cy.contains('td', error).should('be.visible')
    } else {
        cy.contains('td', error).should('not.exist')
    }
}
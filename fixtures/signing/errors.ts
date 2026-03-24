
export class Errors {
    /**
     * Check for a message in the standard OASys error banner, fails the test if it is not visible.
     */


    /**
     * Checks that the errors listed in the specified data file are visible on the sign & lock page.  Fails the test if any are missing.
     * 
     * Assumes that the file is in data/errorText; the parameter passed should be just the filename without folder or extension.
     */
    async checkSignAndLockErrorsVisible(errorFile: string) {

        log(`Checking for errors listed in data/errorText/${errorFile}`)
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
    async checkSignAndLockErrorsNotVisible(errorFile: string) {

        log(`Checking for errors listed in data/errorText/${errorFile}`)
        cy.fixture<string[]>(`errorText/${errorFile}`).then((errors) => {
            errors.forEach((error) => {
                cy.contains('td', error).should('not.exist')
            })
        })
    }

    /**
     * Checks that single given error is visible/not visible on the sign & lock page, fails the test if not.
     */
    async checkSingleSignAndLockError(error: string, expectVisible: boolean) {

        if (expectVisible) {
            cy.contains('td', error).should('be.visible')
        } else {
            cy.contains('td', error).should('not.exist')
        }
    }

}
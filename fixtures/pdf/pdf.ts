/**
 * __oasys.Pdf.*function*__  
 * 
 * Handle PDF files downloaded from OASys (offender and assessment prints)
 * 
 * @module PDF documents
 */

/**
 * Starts a file watcher to look for PDF downloads, then runs the specified action - this should trigger the PDF generation, e.g. clicking the print button.
 * 
 * Waits for a PDF file to be created , then checks that it contains text listed in the inclusions parameter (string[]),
 * and does not contain text listed in the exclusions parameter.  Returns a failure true/false status using an alias.
 *  */
export function checkPdf(action: Function, inclusions: string[], exclusions: string[], resultAlias: string) {

    cy.task('startPdfWatcher').then(() => {

        action()

        if (Cypress.browser.name == 'electron') {  // Skip PDF checking if running in Electron {
            cy.wrap(false).as(resultAlias)
        } else {
            cy.task('getPdf').then((result: { filename: string, contents: string[] }) => {

                cy.groupedLogStart(`Checking PDF contents: ${result.filename}`)
                let failed = false

                inclusions.forEach((inclusion) => {
                    if (result.contents.filter((line) => line.includes(inclusion)).length == 0) {
                        cy.groupedLog(`Expected inclusion ${inclusion} not found.`)
                        failed = true
                    }
                })
                exclusions.forEach((exclusion) => {
                    if (result.contents.filter((line) => line.includes(exclusion)).length != 0) {
                        cy.groupedLog(`Expected exclusion ${exclusion} found.`)
                        failed = true
                    }
                })
                cy.groupedLogEnd()
                cy.wrap(failed).as(resultAlias)
            })
        }
    })

}
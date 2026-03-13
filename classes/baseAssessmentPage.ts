import { OasysPage, Element } from 'classes'

/**
 * this.page is a base class for assessment pages that contain the standard navigation buttons
 */
export class BaseAssessmentPage extends OasysPage {

    name = 'BaseAssessmentPage'

    context = new Element.Text(this.page, '#contextright')
    save = new Element.Button(this.page, 'Save')
    next = new Element.Button(this.page, 'Next')
    previous = new Element.Button(this.page, 'Previous')
    close = new Element.Button(this.page, 'Close')
    print = new Element.Button(this.page, 'Print')
    markAsComplete = new Element.Button(this.page, 'Mark As Complete')

    /**
     * Navigate to the page, click on Mark as Complete, and then check that the section is marked complete.
     */
    // markCompleteAndCheck() {

    //     this.goto()
    //     this.markAsComplete.click()
    //     this.checkCompletionStatus(true)
    // }

    /**
     * Checks that a section has the expected completion status on the floating menu.  Parameter is true if expected to be complete.
     */
    // checkCompletionStatus(expectedStatus: boolean): typeof this.page {

    //     if (this.page.menu.level2 === undefined) {
    //         cy.get(`#leftmenuul li:contains("${this.page.menu.level1}") img`).invoke('attr', 'title').then((imageTitle) => {
    //             const complete = imageTitle == 'Section Complete'
    //             if (complete != expectedStatus) {
    //                 throw new Error(`${this.page.name} - expected completion status ${expectedStatus}, actual ${complete}.`)
    //             }
    //             cy.log(`${this.page.name} - completion status: ${complete}.`)
    //         })
    //     } else {
    //         cy.get(`#leftmenuul li:contains("${this.page.menu.level1}") ul li:contains("${this.page.menu.level2}")`).children().then((menuItem) => {

    //             let complete = false
    //             for (let i = 0; i < menuItem.length; i++) {
    //                 if (menuItem[i].textContent == this.page.menu.level2) {
    //                     if (i > 0 && menuItem[i - 1].textContent == '') {
    //                         complete = true
    //                         break
    //                     }
    //                 }
    //             }
    //             if (complete != expectedStatus) {
    //                 throw new Error(`${this.page.name} - expected completion status ${expectedStatus}, actual ${complete}.`)
    //             }
    //             cy.log(`${this.page.name} - completion status: ${complete}.`)
    //         })
    //     }
    //     return this.page
    // }

    // getPncFromScreenContext(resultAlias: string) {

    //     this.page.context.getValue('context')
    //     cy.get<string>('@context').then((context) => {
    //         cy.wrap(context.split('|')[3].trim()).as(resultAlias)
    //     })
    // }

}



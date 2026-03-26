
/**
 * The SanPage class is used to define SAN pages, including all the elements on the page (i.e. text boxes, buttons etc), and the menu options used
 * to access it (either main menu or floating menu).  Individual pages are in the `oasys\pages` folder, grouped by functional area into subfolders.
 * Any new pages must be added to the relevant `index.ts` file, they can then be referenced in a test as e.g. `pages.San.Section2`.
 * @module
 */

export abstract class SanPage {

    name: string
    title: string
    menu: Menu
    idPrefix: string

    constructor(idPrefix: string = '') {
        this.idPrefix = idPrefix
    }

    /**
     * Sets the value of a multiple element on the pages, each identified by the element name
     * If you provide a PageData type (e.g. setValues<LoginData>(...)), Typescript provides a dropdown for the elements available.
     * 
     * Returns the page object so you can chain other commands.
     * 
     * Writes to the log, unless suppressLog (optional) is true.
     */
    setValues(elementValues: PageData, suppressLog: boolean = false): typeof this {

        Object.keys(elementValues).forEach(elementName => {

            const element = this[elementName]
            if (element == null) {
                throw new Error(`Invalid element name on ${this.name} - ${elementName}`)
            }
            element.setValue(elementValues[elementName])
        })

        if (!suppressLog) log(`Set values on ${this.name} page: ${JSON.stringify(elementValues)} `)
        return this
    }

    /**
     * Checks the value of a multiple element on the pages, each identified by the element name (not case sensitive)
     * The test will fail if any of the values don't match.
     *      
     * Returns the page object so you can chain other commands.
     * 
     * Writes to the log, unless suppressLog (optional) is true.
     */
    checkValues(elementValues: PageData, suppressLog: Boolean = false): typeof this {

        Object.keys(elementValues).forEach(elementName => {

            const element = this[elementName]
            if (element == null) {
                throw new Error(`Invalid element name on ${this.name} - ${elementName}`)
            }
            element.checkValue(elementValues[elementName].toString())
        })

        if (!suppressLog) log(`Checked values on ${this.name} page: ${JSON.stringify(elementValues)} `)
        return this
    }

    /**
     * Writes the value and status of all input and text elements on the page to the log.
     * 
     * Returns the page object so you can chain other commands.
     */
    logValuesAndStatuses(ignoreHidden: boolean = false): typeof this {

        cy.groupedLogStart(`Element values and statuses ${ignoreHidden ? '(visible only) ' : ''}on page: ${this.name} `)
        Object.keys(this).forEach((e) => {

            let element = this[e]
            if (element != null && typeof element.getStatusAndValue === 'function') {  // Check if it's a property that can return a status and value
                element.getStatusAndValue('alias')
                cy.get<ElementStatusAndValue>('@alias').then((result) => {
                    if (!ignoreHidden || result.status != 'notVisible') {
                        cy.groupedLog(`${e}: '${result.value}' (${result.status})`)
                    }
                })
            }
        })
        cy.groupedLogEnd()
        return this
    }

    /**
     * Navigates to the page according to the defined menu details, assuming the relevant menu is available.
     *
     * Returns the page object so you can chain other commands.
     * 
     * Writes to the log, unless suppressLog (optional) is true.
     */
    goto(suppressLog: Boolean = false): typeof this {

        if (this.menu == null) {
            throw new Error(`Invalid goto for page ${this.name}`)

        } else if (this.menu.type == 'Subform') {

            if (this.menu.level1 != '') {
                if (this.menu.level1.startsWith('#') || this.menu.level1.includes('[')) {
                    cy.get(this.menu.level1).eq(0).click()
                } else {
                    await oasys.clickButton(this.menu.level1, true)
                }
            }
        } else if (this.menu.type == 'San') {
            cy.get('.moj-side-navigation__item a').contains(this.name).first().click().then(() => {
                // this.checkCurrent(suppressLog)  Removed for SAN release 1.11 as the titles vary depending on where you land
            })
        } else {
            throw new Error(`Invalid menu type for page ${this.name}`)
        }

        if (!suppressLog) log(`Go to page: ${this.name} `)
        return this
    }

    /**
     * Check that this page is currently displayed on screen, using the title defined in the page object.
     * 
     * Returns the page object so you can chain other commands.
     */
    checkCurrent(suppressLog: Boolean = false): typeof this {
        cy.title().should('contain', this.title)
        if (!suppressLog) log(`Check current page: ${this.title} `)
        return this
    }

    /**
     * Get the completion status of a section on the floating menu, using a result alias.
     */
    getStatus(resultAlias: string) {

        let result = false
        if (this.menu?.type != 'Floating') {
            throw new Error(`Invalid menu check for page ${this.name}`)
        }
        if (this.menu.level2 === undefined) {
            cy.get(`#leftmenuul li: contains("${this.menu.level1}") img`).invoke('attr', 'title').then((imageTitle) => {
                if (imageTitle == 'Section Complete') {
                    result = true
                }
            }).then(() => {
                cy.wrap(result).as(resultAlias)
            })
        } else {
            cy.get(`#leftmenuul li: contains("${this.menu.level1}") ul li: contains("${this.menu.level2}")`).children().then((menuItem) => {
                result = menuItem.length == 2
            }).then(() => {
                cy.wrap(result).as(resultAlias)
            })
        }
    }

}

// Interface allows SanPage classes to be passed as parameters
export interface ISanPage {
    new(): SanPage
}
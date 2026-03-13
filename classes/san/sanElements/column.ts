export class Column {

    type: ColumnType
    selector: string
    tableId?: string

    constructor(type: ColumnType, selector: string, tableId: string = null) {

        this.type = type
        this.selector = selector
        if (tableId) {
            this.tableId = `#${tableId}`
        }
    }

    /**
     * Finds text within a column element and clicks it
     */
    clickRowContaining(text: string) {

        this.getColumnHeaderId().then((id) => {
            cy.contains(`[headers="${id}"]`, text).click()
        })
    }

    /**
     * Clicks the first row of a column element.
     */
    clickFirstRow() {

        this.getColumnHeaderId().then(($id) => {
            cy.get(`[headers="${$id}"]`).eq(0).click()
        })
    }

    /**
     * Clicks the first row of a column element.
     */
    clickNthRow(n: number) {

        this.getColumnHeaderId().then(($id) => {
            cy.get(`[headers="${$id}"]`).eq(n - 1).click()
        })
    }

    getColumnHeaderId() {

        if (this.selector.startsWith('#')) {
            cy.get(this.selector).as('header')
        }
        else {
            cy.contains('th', this.selector).as('header')
        }
        return cy.get('@header').invoke('attr', 'id')
    }

    /**
     * Returns the number of rows visible in a column using an alias
     */
    getCount(resultAlias: string) {

        cy.get(this.tableId ?? '#content').then((containerDiv) => {
            const noData = containerDiv.find('.nodatafound')
            if (noData.length > 0) {
                cy.wrap(0).as(resultAlias)
            } else {
                this.getColumnHeaderId().then((id) => {
                    const rows = containerDiv.find(`[headers="${id}"]`)
                    cy.wrap(rows.length).as(resultAlias)
                })
            }
        })
    }

    /**
     * Checks that the number of rows visible in a column is as expected
     */
    checkCount(expectedCount: number) {

        cy.get(this.tableId ?? '#content').then((containerDiv) => {
            const noData = containerDiv.find('.nodatafound')
            if (noData.length > 0) {
                if (expectedCount != 0) {
                    throw new Error(`Expected ${expectedCount} rows, found 0`)
                }
            } else if (this.selector == '') {
                const rows = containerDiv.find('td')
                if (rows.length != expectedCount) {
                    throw new Error(`Expected ${expectedCount} rows, found ${rows.length}`)
                }
            } else {
                this.getColumnHeaderId().then((id) => {
                    const rows = containerDiv.find(`[headers="${id}"]`)
                    if (rows.length != expectedCount) {
                        throw new Error(`Expected ${expectedCount} rows, found ${rows.length}`)
                    }
                })
            }
        })
    }

    /**
     * Returns the data visible in a column using an alias.  Image columns return a comma-separated list of the title attributes for each row
     */
    getValues(resultAlias: string) {

        const result: string[] = []
        cy.get(this.tableId ?? '#content').then((containerDiv) => {
            const noData = containerDiv.find('.nodatafound')
            if (noData.length == 0) {
                this.getColumnHeaderId().then((id) => {
                    const rows = containerDiv.find(`[headers="${id}"]`)
                    for (let r = 0; r < rows.length; r++) {
                        if (this.type == ColumnType.ImageColumn) {
                            const images = rows[r].getElementsByTagName('img')
                            let titles = ''
                            for (let i = 0; i < images.length; i++) {
                                titles = `${titles}${images[i].getAttribute('title')},`
                            }
                            result.push(titles == '' ? '' : titles.substring(0, titles.length - 1)) // remove trailing comma
                        } else if (this.type == ColumnType.ScoresColumn) {
                            const scores = rows[r].getElementsByClassName(`BL`)
                            if (scores.length == 0) {
                                result.push('N/A')
                            } else {
                                let score = -1
                                for (let i = 0; i < scores.length; i++) {
                                    const p = scores[i].getElementsByTagName('p')
                                    if (p.length > 0) {
                                        const val = parseInt(p[0].textContent.trim())
                                        if (Number.isInteger(val)) {
                                            if (p[0].className.search('BGY') == -1) {  // If not grey
                                                score = val
                                            }
                                        }
                                    }
                                }
                                if (score == -1) {
                                    result.push(null)
                                } else {
                                    result.push(score.toString())
                                }
                            }
                        } else {
                            result.push(rows[r].textContent)
                        }
                    }
                })
            }
            cy.wrap(result).as(resultAlias)
        })
    }
}

export enum ColumnType {
    Column,
    ButtonColumn,
    ImageColumn,
    CheckboxColumn,
    ScoresColumn,
}
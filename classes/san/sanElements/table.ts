import { Column } from './column'

export class Table {

    id: string
    name: string

    constructor(id: string, name: string) {

        this.id = id
        this.name = name
    }

    /**
     * Gets data from all visible rows in an array of ColumnValues objects, each containing the column name and a string array of values, returned using an alias.
     */
    getData(resultAlias: string) {

        const result: ColumnValues[] = []
        Object.keys(this).filter((k) => !['id', 'name'].includes(k)).forEach((key) => {
            (this[key] as Column).getValues('values')
            cy.get<string[]>('@values').then((values) => {
                result.push({ name: key, values: values })
            })
        })
        cy.wrap(result).as(resultAlias)
    }

    /** 
     * Checks the content of one or more columns in a table.  Expected values should be passed as an array of ColumnValues objects,
     * each containing the column name and a string array of values.
     * 
     * Test fails on any mismatches.
     */
    checkData(expectedValues: ColumnValues[]) {

        cy.groupedLogStart(`Checking values on ${this.name} table`)
        let failed = false

        expectedValues.forEach((exp) => {
            if (this[exp.name].getValues == undefined) {
                cy.groupedLog(`Invalid column name: ${exp.name}`)
                failed = true
            } else {
                (this[exp.name] as Column).getValues('values')
                cy.get<string[]>('@values').then((values) => {
                    if (values.length != exp.values.length) {
                        cy.groupedLog(`Mismatched row count on column ${exp.name}: expected ${exp.values.length}, found ${values.length}`)
                        failed = true
                    } else {
                        for (let i = 0; i < exp.values.length; i++) {
                            if (values[i] != exp.values[i]) {
                                cy.groupedLog(`Column ${exp.name} row ${i}: expected ${exp.values[i]}, found ${values[i]}`)
                                failed = true
                            }
                        }
                    }
                })
            }
        })

        cy.groupedLogEnd().then(() => {
            if (failed) {
                throw new Error('Failed checking table')
            }
        })
    }

    /** 
     * Check if the table is visible (true) or not (false)
     */
    checkVisibility(expectVisible: boolean) {

        cy.get(`#${this.id}`).should(expectVisible ? 'be.visible' : 'not.exist')
    }

    /** 
     * Check if the table has the expected number of rows
     */
    checkCount(expectedRows: number) {

        cy.log(`Checking table row count, expected count = ${expectedRows}`)
        this.firstColumn().checkCount(expectedRows)  // Get first column property to check the row count
    }

    /**
     * Check if the table contains text
     */
    checkText(text: string) {

        cy.get(`#${this.id}`).should('contain', text)
    }

    /**
     * Click the first row in a table
     */
    clickFirstRow() {
        this.firstColumn().clickFirstRow()
    }

    /**
     * Click the nth row in a table (top row is number 1)
     */
    clickNthRow(n: number) {
        this.firstColumn().clickNthRow(n)
    }

    firstColumn(): Column {
        return (this[Object.keys(this).filter((k) => !['id', 'name'].includes(k))[0]] as Column)
    }

}
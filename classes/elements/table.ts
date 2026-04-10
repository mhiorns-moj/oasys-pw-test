import { Locator, Page } from '@playwright/test'
import { Column } from './column'


export class Table {

    selector: Locator

    constructor(readonly page: Page, readonly id: string, readonly name: string) {

        this.selector = this.page.locator(`#${id}`)
    }

    /**
     * Gets data from all visible rows in an array of ColumnValues objects, each containing the column name and a string array of values, returned using an alias.
     */
    async getData(): Promise<ColumnValues[]> {

        const result: ColumnValues[] = []
        for (const key of Object.keys(this).filter((k) => !['page', 'id', 'name', 'selector'].includes(k))) {
            const values = await (this[key as keyof this] as Column).getValues()
            result.push({ name: key, values: values })
        }
        return result
    }

    /** 
     * Checks the content of one or more columns in a table.  Expected values should be passed as an array of ColumnValues objects,
     * each containing the column name and a string array of values.
     * 
     * Test fails on any mismatches.
     */
    async checkData(expectedValues: ColumnValues[]) {

        log('', `Checking values on ${this.name} table`)
        let failed = false

        for (let exp of expectedValues) {
            const values = await (this[exp.name as keyof this] as Column).getValues()
            if (values.length != exp.values.length) {
                log(`Mismatched row count on column ${exp.name}: expected ${exp.values.length}, found ${values.length}`)
                failed = true
            } else {
                for (let i = 0; i < exp.values.length; i++) {
                    if (values[i] != exp.values[i]) {
                        log(`Column ${exp.name} row ${i}: expected ${exp.values[i]}, found ${values[i]}`)
                        failed = true
                    }
                }
            }
        }

        expect(failed).toBeFalsy()
    }

    /** 
     * Check if the table is visible (true) or not (false)
     */
    async checkVisibility(expectVisible: boolean) {

        await expect(this.selector).toBeVisible({ visible: expectVisible })
    }

    /** 
     * Check if the table has the expected number of rows
     */
    async checkRowCount(expectedRows: number) {

        log(`Checking table row count, expected count = ${expectedRows}`)
        const rows = await this.getRowCount()
        expect(rows).toBe(expectedRows)
    }

    /**
     * Check if the table contains text
     */
    async checkText(text: string) {

        await expect(this.selector).toContainText(text)
    }

    /**
     * Click the first row in a table
     */
    async clickFirstRow() {

        await this.firstColumn().clickFirstRow()
    }

    /**
     * Click the nth row in a table (top row is number 1)
     */
    async clickNthRow(n: number) {

        await this.firstColumn().clickNthRow(n)
    }

    async getRowCount(): Promise<number> {

        await this.selector.waitFor()
        const noData = await this.selector.locator('.nodatafound').count()
        if (noData) {
            return 0
        }
        return await this.selector.locator('tbody').locator('tr').count()
    }

    firstColumn(): Column {
        return (this[Object.keys(this).filter((k) => !['page', 'id', 'name', 'selector'].includes(k))[0] as keyof this] as Column)
    }

}
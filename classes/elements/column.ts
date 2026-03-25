import { Locator, Page } from '@playwright/test'


export class Column {

    selector: Locator

    constructor(readonly page: Page, readonly type: ColumnType, selector: string, readonly tableId: string = null) {

        this.type = type
        this.selector = selector.startsWith('#') || selector.includes('[')
            ? page.locator(selector)
            : page.getByRole('columnheader', { name: selector })
        if (tableId) {
            this.tableId = `#${tableId}`
        }
    }

    /**
     * Finds text within a column element and clicks it
     */
    // clickRowContaining(text: string) {

    //     this.getColumnHeaderId().then((id) => {
    //         cy.contains(`[headers="${id}"]`, text).click()
    //     })
    // }

    /**
     * Clicks the first row of a column element.
     */
    async clickFirstRow() {

        const id = await this.getColumnHeaderId()
        await this.page.locator(`[headers="${id}"]`).first().click()
    }

    /**
     * Clicks the first row of a column element.
     */
    async clickNthRow(n: number) {

        const id = await this.getColumnHeaderId()
        await this.page.locator(`[headers="${id}"]`).nth(n - 1).click()
    }

    async getColumnHeaderId(): Promise<string> {

        const id = await this.selector.getAttribute('id')
        return id
    }

    /**
     * Returns the number of rows visible in a column
     */
    async getCount(): Promise<number> {

        const container = this.page.locator(this.tableId ?? '#content')
        await container.waitFor()
        const noData = await container.locator('.nodatafound').count()

        if (noData > 0) {
            return 0
        } else {
            const id = await this.getColumnHeaderId()
            return await container.locator(`[headers="${id}"]`).count()
        }
    }

    /**
     * Checks that the number of rows visible in a column is as expected
     */
    async checkCount(expectedCount: number) {

        const count = await this.getCount()
        expect(count).toBe(expectedCount)
    }

    /**
     * Returns the data visible in a column using an alias.  Image columns return a comma-separated list of the title attributes for each row
     */
    // getValues(resultAlias: string) {

    //     const result: string[] = []
    //     cy.get(this.tableId ?? '#content').then((containerDiv) => {
    //         const noData = containerDiv.find('.nodatafound')
    //         if (noData.length == 0) {
    //             this.getColumnHeaderId().then((id) => {
    //                 const rows = containerDiv.find(`[headers="${id}"]`)
    //                 for (let r = 0; r < rows.length; r++) {
    //                     if (this.type == ColumnType.ImageColumn) {
    //                         const images = rows[r].getElementsByTagName('img')
    //                         let titles = ''
    //                         for (let i = 0; i < images.length; i++) {
    //                             titles = `${titles}${images[i].getAttribute('title')},`
    //                         }
    //                         result.push(titles == '' ? '' : titles.substring(0, titles.length - 1)) // remove trailing comma
    //                     } else if (this.type == ColumnType.ScoresColumn) {
    //                         const scores = rows[r].getElementsByClassName(`BL`)
    //                         if (scores.length == 0) {
    //                             result.push('N/A')
    //                         } else {
    //                             let score = -1
    //                             for (let i = 0; i < scores.length; i++) {
    //                                 const p = scores[i].getElementsByTagName('p')
    //                                 if (p.length > 0) {
    //                                     const val = parseInt(p[0].textContent.trim())
    //                                     if (Number.isInteger(val)) {
    //                                         if (p[0].className.search('BGY') == -1) {  // If not grey
    //                                             score = val
    //                                         }
    //                                     }
    //                                 }
    //                             }
    //                             if (score == -1) {
    //                                 result.push(null)
    //                             } else {
    //                                 result.push(score.toString())
    //                             }
    //                         }
    //                     } else {
    //                         result.push(rows[r].textContent)
    //                     }
    //                 }
    //             })
    //         }
    //         cy.wrap(result).as(resultAlias)
    //     })
    // }
}

export enum ColumnType {
    Column,
    ButtonColumn,
    ImageColumn,
    CheckboxColumn,
    ScoresColumn,
}
import { Page, TestInfo } from '@playwright/test'

import * as lib from 'lib'
import { Oasys } from 'fixtures'
import * as pages from './pages'


export class Layer3 {

    constructor(public readonly page: Page, public readonly testInfo: TestInfo, readonly oasys: Oasys) { }

    readonly section2 = new pages.Section2(this.page)
    readonly section3 = new pages.Section3(this.page)
    readonly section4 = new pages.Section4(this.page)
    readonly section5 = new pages.Section5(this.page)
    readonly section6 = new pages.Section6(this.page)
    readonly section7 = new pages.Section7(this.page)
    readonly section8 = new pages.Section8(this.page)
    readonly section9 = new pages.Section9(this.page)
    readonly section10 = new pages.Section10(this.page)
    readonly section11 = new pages.Section11(this.page)
    readonly section12 = new pages.Section12(this.page)
    readonly section13 = new pages.Section13(this.page)
    readonly summarySheet = new pages.SummarySheet(this.page)
    readonly fastReview = new pages.FastReview(this.page)

    async sections2To13NoIssues(params?: PopulateAssessmentParams) {

        await this.section2.populateNoIssues(true)
        await this.section3.populateNoIssues(true)
        await this.section4.populateNoIssues(true)
        await this.section5.populateNoIssues(true)
        await this.section6.populateNoIssues(params?.populate6_11, true)
        await this.section7.populateNoIssues(true)
        await this.section8.populateNoIssues(true)
        await this.section9.populateNoIssues(true)
        await this.section10.populateNoIssues(true)
        await this.section11.populateNoIssues(true)
        await this.section12.populateNoIssues(true)
    }

// export function sections2To13FullyPopulated(params: PopulateAssessmentParams) {

//     populate.Layer3Pages.Section2.fullyPopulated(params.maxStrings)
//     populate.Layer3Pages.Section3.fullyPopulated(params.maxStrings)
//     populate.Layer3Pages.Section4.fullyPopulated(params)
//     populate.Layer3Pages.Section5.fullyPopulated(params.maxStrings)
//     populate.Layer3Pages.Section6.fullyPopulated(params.maxStrings)
//     populate.Layer3Pages.Section7.fullyPopulated(params.maxStrings)
//     populate.Layer3Pages.Section8.fullyPopulated(params.maxStrings)
//     populate.Layer3Pages.Section9.fullyPopulated(params.maxStrings)
//     populate.Layer3Pages.Section10.fullyPopulated(params.maxStrings)
//     populate.Layer3Pages.Section11.fullyPopulated(params.maxStrings)
//     populate.Layer3Pages.Section12.fullyPopulated(params.maxStrings)
//     populate.Layer3Pages.Section13.fullyPopulated(params.maxStrings)
// }
}
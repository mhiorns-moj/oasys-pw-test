import { Page, TestInfo } from '@playwright/test'

import * as lib from 'lib'
import { Oasys } from 'fixtures'
import * as pages from './pages'


export class Risk {

    constructor(public readonly page: Page, public readonly testInfo: TestInfo, readonly oasys: Oasys) { }

    readonly roshScreeningSection1 = new pages.RoshScreeningSection1(this.page)
    readonly roshScreeningSection2to4 = new pages.RoshScreeningSection2to4(this.page)
    readonly roshScreeningSection5 = new pages.RoshScreeningSection5(this.page)

    async populateMinimal(params?: PopulateAssessmentParams) {

        await this.roshScreeningSection1.populateMinimal()
        await this.roshScreeningSection2to4.populateMinimal()
    }

}
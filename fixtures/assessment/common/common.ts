import { Page, TestInfo } from '@playwright/test'

import * as lib from 'lib'
import { Oasys } from 'fixtures'
import * as pages from './pages'


export class Common {

    constructor(public readonly page: Page, public readonly testInfo: TestInfo, readonly oasys: Oasys) { }

    offendingInformation = new pages.OffendingInformation(this.page)
    predictors = new pages.Predictors(this.page)
    selfAssessmentForm = new pages.SelfAssessmentForm(this.page)

    async populateMinimal() {

        await this.offendingInformation.populateMinimal()
        await this.predictors.populateMinimal()
        await this.selfAssessmentForm.populateMinimal()
    }

}
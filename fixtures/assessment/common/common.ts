import { Page, TestInfo } from '@playwright/test'

import * as lib from 'lib'
import { Oasys } from 'fixtures'
import * as pages from './pages'


export class Common {

    constructor(public readonly page: Page, public readonly testInfo: TestInfo, readonly oasys: Oasys) { }

    readonly offenderInformation = new pages.OffenderInformation(this.page)
    readonly offendingInformation = new pages.OffendingInformation(this.page)
    readonly predictors = new pages.Predictors(this.page)
    readonly selfAssessmentForm = new pages.SelfAssessmentForm(this.page)

    async populateMinimal(params?: PopulateAssessmentParams) {

        await this.offendingInformation.populateMinimal()
        await this.predictors.populateMinimal()
        if (params?.layer != 'Layer 3V2') {
            await this.selfAssessmentForm.populateMinimal()
        }
    }

}
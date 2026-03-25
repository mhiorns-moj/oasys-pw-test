import { Page, TestInfo } from '@playwright/test'

import * as lib from 'lib'
import { Oasys } from 'fixtures'
import * as pages from './pages'


export class Layer1 {


    constructor(private readonly page: Page, private readonly oasys: Oasys) { }

    readonly section2 = new pages.Section2(this.page)
    readonly predictorQuestions = new pages.PredictorQuestions(this.page)
    readonly roshaPredictors = new pages.RoshaPredictors(this.page)

    async populateMinimal(params?: PopulateAssessmentParams) {

        if (params?.layer == 'Layer 1V2') {
            // await this.roshaPredictors.populateMinimal()
        } else {
            await this.section2.populateMinimal()
        }
    }
}
import { Page, TestInfo } from '@playwright/test'

import * as lib from 'lib'
import { Oasys } from 'fixtures'
import * as pages from './pages'
import { SpService } from './spService/spService'


export class SentencePlan {


    constructor(public readonly page: Page, public readonly testInfo: TestInfo, readonly oasys: Oasys) { }

    readonly basicSentencePlan = new pages.BasicSentencePlan(this.page)
    readonly spService = new SpService(this.page, this.oasys)

    async populateMinimal(params?: PopulateAssessmentParams, from: 'assessment' | 'offender' = 'assessment') {

        if (params?.newSp || params?.layer == 'Layer 3V2') {

            await this.spService.goToSpService(from)
            await this.spService.populateMinimal()
        }
    }


    // export function ispFullyPopulated(params: PopulateAssessmentParams) {

    //     populate.SentencePlanPages.IspSection1to4.fullyPopulated(params.maxStrings)
    //     populate.SentencePlanPages.IspSection5.fullyPopulated(params.maxStrings)
    //     populate.SentencePlanPages.IspSection52to8.fullyPopulated(params.maxStrings)
    // }

    // export function rspFullyPopulated(params: PopulateAssessmentParams) {

    //     populate.SentencePlanPages.RspSection1to2.fullyPopulated(params.maxStrings)
    //     populate.SentencePlanPages.RspSection3to63.fullyPopulated(params.maxStrings)
    //     populate.SentencePlanPages.RspSection7.fullyPopulated(params.maxStrings)
    //     populate.SentencePlanPages.RspSection72to10.fullyPopulated(params.maxStrings)
    //     // Transfer page TODO
    // }
}
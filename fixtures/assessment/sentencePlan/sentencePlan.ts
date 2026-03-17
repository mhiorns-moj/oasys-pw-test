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

        if (params?.newSp) {
            
            await this.spService.goToSpService(from)
            await this.spService.populateMinimal()
        }
    }
}
import { Page, TestInfo } from '@playwright/test'

import * as lib from 'lib'
import { Oasys } from 'fixtures'
import * as pages from './pages'


export class Layer3 {


    constructor(public readonly page: Page, public readonly testInfo: TestInfo, readonly oasys: Oasys) { }

    readonly section2 = new pages.Section2(this.page)
    
    async populateMinimal(params?: PopulateAssessmentParams) {

        if (params?.layer == 'Layer 1V2') {
            // await this.roshaPredictors.populateMinimal()
        } else {
            await this.section2.populateMinimal()
        }
    }
}
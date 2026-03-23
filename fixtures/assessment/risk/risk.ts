import { Page, TestInfo } from '@playwright/test'

import * as lib from 'lib'
import { Oasys } from 'fixtures'
import * as pages from './pages'


export class Risk {

    constructor(public readonly page: Page, public readonly testInfo: TestInfo, readonly oasys: Oasys) { }

    readonly roshScreeningSection1 = new pages.RoshScreeningSection1(this.page)
    readonly roshScreeningSection2to4 = new pages.RoshScreeningSection2to4(this.page)
    readonly roshScreeningSection5 = new pages.RoshScreeningSection5(this.page)
    readonly roshSummary = new pages.RoshSummary(this.page)
    readonly riskManagementPlan = new pages.RiskManagementPlan(this.page)

    async populateMinimal(params?: PopulateAssessmentParams) {

        await this.roshScreeningSection1.populateMinimal()
        await this.roshScreeningSection2to4.populateMinimal()
    }

    /**
     * Enters minimum Rosh screening responses but with R1.2.1P set to Yes to get full analysis.
     * Sets risk flags to the risk level specified, and enters some basic text on risk summary and RMP.
     */
    async populateWithSpecificRiskLevel(risk: RiskLevel, withRationale: boolean = false) {

        await this.roshScreeningSection1.populateMinimal()
        await this.roshScreeningSection1.r1_2_1P.setValue('Yes')
        await this.roshScreeningSection2to4.populateMinimal(withRationale)
        await this.roshSummary.specificRiskLevel(risk)

        if (risk != 'Low') {
            await this.riskManagementPlan.minimalWithTextFields()
        }
    }
}
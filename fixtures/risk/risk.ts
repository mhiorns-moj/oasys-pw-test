import { Page, TestInfo } from '@playwright/test'

import * as lib from 'lib'
import { Oasys } from 'fixtures'
import * as pages from './pages'


export class Risk {

    constructor(private readonly page: Page, private readonly oasys: Oasys) { }

    readonly screeningSection1 = new pages.ScreeningSection1(this.page)
    readonly screeningSection2to4 = new pages.ScreeningSection2to4(this.page)
    readonly screeningSection5 = new pages.ScreeningSection5(this.page)
    readonly summary = new pages.Summary(this.page)
    readonly riskManagementPlan = new pages.RiskManagementPlan(this.page)

    async populateMinimal(params?: PopulateAssessmentParams) {

        await this.screeningSection1.populateMinimal()
        await this.screeningSection2to4.populateMinimal()
    }

    /**
     * Enters minimum Rosh screening responses but with R1.2.1P set to Yes to get full analysis.
     * Sets risk flags to the risk level specified, and enters some basic text on risk summary and RMP.
     */
    async populateWithSpecificRiskLevel(risk: RiskLevel, withRationale: boolean = false) {

        await this.screeningSection1.populateMinimal()
        await this.screeningSection1.r1_2_1P.setValue('Yes')
        await this.screeningSection2to4.populateMinimal(withRationale)
        await this.summary.specificRiskLevel(risk)

        if (risk != 'Low') {
            await this.riskManagementPlan.minimalWithTextFields()
        }
    }

    async setRationaleText(text?: string) {

        await this.screeningSection2to4.goto()
        await this.screeningSection2to4.rationale.setValue(text ?? 'Generic rationale text')
    }
}
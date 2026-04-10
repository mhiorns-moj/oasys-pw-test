import { Page } from '@playwright/test'

import * as pages from './pages'
import { BaseAssessmentPage } from 'classes'


export class Sections {

    constructor(private readonly page: Page) { }

    assessmentPk: number // Updated on creating an assessment.  Used at lock incomplete and sign&lock to call the OGRS4 regression test

    readonly baseAssessmentPage = new BaseAssessmentPage(this.page)

    // Common pages
    readonly offenderInformation = new pages.OffenderInformation(this.page)
    readonly offendingInformation = new pages.OffendingInformation(this.page)
    readonly sourcesOfInformation = new pages.SourcesOfInformation(this.page)
    readonly predictors = new pages.Predictors(this.page)
    readonly selfAssessmentForm = new pages.SelfAssessmentForm(this.page)

    // Layer 1
    readonly layer1Section2 = new pages.Layer1Section2(this.page)
    readonly predictorQuestions = new pages.PredictorQuestions(this.page)
    readonly roshaPredictors = new pages.RoshaPredictors(this.page)

    // Layer 3
    readonly section2 = new pages.Section2(this.page)
    readonly victim = new pages.Victim(this.page)
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


    async populateMinimal(params?: PopulateAssessmentParams) {

        switch (params?.layer) {
            case 'Layer 1':
                await this.predictors.populateMinimal()
                await this.offendingInformation.populateMinimal()
                await this.layer1Section2.populateMinimal()
                await this.selfAssessmentForm.populateMinimal()
                break
            case 'Layer 1V2':
                await this.roshaPredictors.populateMinimal()
                break
            case 'Layer 3':
                await this.predictors.populateMinimal()
                await this.offendingInformation.populateMinimal()
                await this.sections2To13NoIssues(params)
                await this.selfAssessmentForm.populateMinimal()
                break
            case 'Layer 3V2':
                await this.predictors.populateMinimal()
                await this.offendingInformation.populateMinimal()
                break
        }
    }

    async populateFull(params: PopulateAssessmentParams) {

        switch (params?.layer) {
            //     case 'Layer 1':
            //         await this.predictors.populateFull()
            //         await this.offendingInformation.populateFull()
            //         await this.layer1Section2.populateFull()
            //         await this.selfAssessmentForm.populateFull()
            //         break
            case 'Layer 1V2':
                await this.roshaPredictors.populateFull()
                break
            //     case 'Layer 3':
            //         await this.predictors.populateFull()
            //         await this.offendingInformation.populateFull()
            //         await this.sections2To1sections2To13populateFull3NoIssues(params)
            //         await this.selfAssessmentForm.populateFull()
            //         break
            //     case 'Layer 3V2':
            //         await this.predictors.populateFull()
            //         await this.offendingInformation.populateFull()
            //         break
        }

    }


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

    // export function sections2To13populateFull(params: PopulateAssessmentParams) {

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
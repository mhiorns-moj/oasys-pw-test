import { Page, TestInfo } from '@playwright/test'

import * as lib from 'lib'
import { Oasys, Cms, Offender } from 'fixtures'
import { Common, Layer1, Risk } from 'fixtures/assessment'
import * as pages from './pages'

import { IPage } from 'classes/oasysPage'
import { User } from 'classes/user'
import { checkOgrs4CalcsPk } from 'lib/ogrs'


export class Assessment {

    constructor(public readonly page: Page, public readonly testInfo: TestInfo, readonly oasys: Oasys, readonly cms: Cms, readonly offender: Offender) { }

    assessmentPk: number // Updated on creating an assessment.  Used at lock incomplete and sign&lock to call the OGRS4 regression test

    createAssessmentPage = new pages.CreateAssessment(this.page)
    common = new Common(this.page, this.testInfo, this.oasys)
    layer1 = new Layer1(this.page, this.testInfo, this.oasys)
    risk = new Risk(this.page, this.testInfo, this.oasys)

    /**
     * Create a probation assessment with the details provided for the Create Assessment page. Assumes you are starting on the Offender Details page.
     * 
     * The first parameter is an Assessment type object which must include purposeOfAssessment, others can be omitted to use the default values. Properties available:
     *  - purposeOfAssessment: PurposeOfAssessment
     *  - otherPleaseSpecify?: string
     *  - assessmentLayer?: AssessmentLayer
     *  - sentencePlanType?: string
     *  - includeCourtReportTemplate?: string
     *  - includeSanSections?: YesNoAnswer
     *  - selectTeam?: string
     *  - selectAssessor?: string
     *
     * The second (Yes/No) parameter should be supplied if you are expecting the option to clone from a historic assessment.
     */
    async createProb(assessmentDetails: CreateAssessmentDetails, clonePreviousHistoric?: 'Yes' | 'No') {

        await this.getToCreateAssessmentPage(true)

        await this.createAssessmentPage.setValues(assessmentDetails, true)
        await this.createAssessmentPage.create.click()
        if (clonePreviousHistoric) {
            await this.oasys.clickButton(clonePreviousHistoric)
        }

        lib.log(`Created assessment: ${JSON.stringify(assessmentDetails)}`, 'Assessment')
    }

    /**
     * Create a prison assessment with the details provided for the Create Assessment page. Assumes you are starting on the Offender Details page.
     * 
     * The first parameter is an Assessment type object which must include purposeOfAssessment, others can be omitted to use the default values. Properties available:
     *  - purposeOfAssessment: PurposeOfAssessment
     *  - otherPleaseSpecify?: string
     *  - assessmentLayer?: AssessmentLayer
     *  - sentencePlanType?: string
     *  - includeCourtReportTemplate?: string
     *  - includeSanSections?: YesNoAnswer
     *  - selectTeam?: string
     *  - selectAssessor?: string
     * 
     */
    async createPris(assessmentDetails: CreateAssessmentDetails) {

        await this.offender.offenderDetails.createAssessment.click()
        await this.createAssessmentPage.setValues(assessmentDetails, true)
        await this.createAssessmentPage.create.click()
        lib.log(`Created assessment: ${JSON.stringify(assessmentDetails)}`, 'Assessment')
    }

    /**
     * Go from the offender details page through CMS screens to the create assessment page for a probation offender. The process depends on the force CRN setting.
     */
    async getToCreateAssessmentPage(suppressLog: boolean = false) {

        await this.offender.offenderDetails.createAssessment.click()
        if (this.oasys.appConfig.probForceCrn) {
            await this.cms.cmsAssessmentSearch()
        }

        if (!suppressLog) lib.log('Navigated to CreateAssessment page')
    }

    async populateMinimal() {

        await this.common.populateMinimal()
        await this.layer1.populateMinimal()
        await this.risk.populateMinimal()
    }

    /**
     * Select any existing assessments and delete them.  Assumes you have the appropriate rights and are on the OffenderDetails page with the assessments tab visible.
     */
    // async deleteAll(surname: string, forename: string) {

    //     const tab = new this.oasys.Pages.Offender.AssessmentsTab()
    //     const deleteAssessment = new this.oasys.Pages.Assessment.Other.DeleteAssessment()

    //     tab.assessments.purposeOfAssessment.getCount('count')
    //     cy.get<number>('@count').then((count) => {
    //         for (let i = 0; i < count; i++) {
    //             tab.assessments.purposeOfAssessment.clickFirstRow()
    //             deleteAssessment.goto(true)
    //             deleteAssessment.reasonForDeletion.setValue('Testing')
    //             deleteAssessment.ok.click()
    //             this.oasys.Nav.history(surname, forename)
    //         }
    //         lib.log(`Deleted ${count} assessment(s)`)
    //     })
    // }

    /**
     * Delete the most recent assessment.  Assumes you have the appropriate rights and are on the OffenderDetails page with the assessments tab visible.
     */
    // async deleteLatest() {

    //     const tab = new this.oasys.Pages.Offender.AssessmentsTab()
    //     const deleteAssessment = new this.oasys.Pages.Assessment.Other.DeleteAssessment()

    //     tab.assessments.purposeOfAssessment.clickFirstRow()
    //     deleteAssessment.goto(true)
    //     deleteAssessment.reasonForDeletion.setValue('Testing')
    //     deleteAssessment.ok.click()

    //     lib.log(`Deleted latest assessment`)
    // }

    /**
     * Checks that the given OASYS_SET pk is deleted (i.e. deleted_date is not null)
     */
    // async checkDeleted(pk: number) {

    //     checkIfDeleted(pk, true)
    // }

    /**
     * Checks that the given OASYS_SET pk is NOT deleted (i.e. deleted_date is null)
     */
    // async checkNotDeleted(pk: number) {

    //     checkIfDeleted(pk, false)
    // }

    // async checkIfDeleted(pk: number, expectDeleted: boolean) {

    //     this.oasys.Db.getData(`select deleted_date from eor.oasys_set where oasys_set_pk = ${pk}`, 'data')
    //     cy.get<string[][]>('@data').then((data) => {
    //         if (expectDeleted) {
    //             expect(data[0][0]).to.not.be.null
    //             lib.log(`Checked that assessment ${pk} has been deleted`)
    //         } else {
    //             expect(data[0][0]).to.be.null
    //             lib.log(`Checked that assessment ${pk} is NOT deleted`)
    //         }
    //     })
    // }


    /**
     * Reverses the deletion of an assessment or subassessment.  Optional comment (otherwise generic text is used)
     */
    // async reverseDeletion(offender: OffenderDef, type: 'Assessment' | 'Basic Custody Screening' | 'Sub Assessment - SARA', assessment: string, comment?: string) {

    //     const rev = new this.oasys.Pages.Admin.ReverseDeletion().goto()
    //     rev.type.setValue(type)
    //     rev.offenderSearch.setValue(offender.pnc)
    //     cy.get('#P10_SIGNING_COMMENTS').click()  // Force refresh to show offender LOV
    //     rev.offender.setValue(offender.surname)
    //     rev.assessment.setValue(assessment)
    //     rev.reason.setValue(comment ?? 'Reversing deletion')
    //     rev.ok.click()
    //     rev.ok.click()
    //     new this.oasys.Pages.Tasks.TaskManager().checkCurrent()
    //     lib.log(`Reversed deletion for ${offender.pnc}, ${type}, ${assessment} `)
    // }

    /**
     * Roll back the assessment.  Assumes you are on an assessment page.
     */
    // async rollBack(comment?: string) {

    //     const rollback = new this.oasys.Pages.Assessment.Other.RollbackAssessment().goto()
    //     rollback.ok.click()
    //     rollback.enterAComment.setValue(comment ?? 'Rollback test comment')
    //     rollback.ok.click()

    //     lib.log('Rolled back assessment')
    // }

    /**
     * Open the latest assessment, assuming you have the assessments tab showing.
     */
    // async openLatest() {

    //     new this.oasys.Pages.Offender.AssessmentsTab().assessments.clickFirstRow()
    //     lib.log('Opened latest assessment')
    // }

    /**
     * Open an assessment selected by the row number in the table (1 at the top), assuming you have the assessments tab showing.
     */
    // async open(row: number) {

    //     new this.oasys.Pages.Offender.AssessmentsTab().assessments.clickNthRow(row)
    //     lib.log('Opened latest assessment')
    // }

    /**
     * Assuming you have the offender details open with assessment tab showing, clicks the Lock Incomplete button,
     * then checks and accepts the alert message.  Checks the standard message unless otherwise specified
     */
    // async lockIncomplete(message?: string) {

    //     // Set up a Cypress event to trap the alert
    //     cy.on('window:confirm', (str) => {
    //         expect(str).to.equal(message ?? 'Do you wish to lock the assessment as incomplete?')
    //     })

    //     // Check the OGRS4 calculations
    //     new this.oasys.Pages.Offender.OffenderDetails().pnc.getValue('pnc')
    //     cy.get<string>('@pnc').then((pnc) => {
    //         this.oasys.Db.getLatestSetPkByPnc(pnc, 'pk')
    //         cy.get<number>('@pk').then((pk) => {
    //             checkOgrs4CalcsPk(pk)

    //             this.oasys.Nav.clickButton('Lock Incomplete', true)
    //             lib.log('Locked assessment incomplete')
    //         })
    //     })
    // }

    /**
     * Sign and lock an assessment.  The optional parameter is an object with optional properties as listed below.
     * 
     * The function will attempt to deal with normal process flows depending on the parameter values. Assumes you are on an assessment page with a Sign & Lock button, 
     * unless the 'page' property is specified - in that case you just need to be in the assessment.
     * 
     *   - page: an assessment page to select, e.g. pages.SentencePlan.IspSection52to8
     *   - expectOutstandingQuestion: if true, expect to get an Outstanding Question page
     *   - expectRsrScore: if true, expect to get an RSR Score page
     *   - expectRsrWarning: if true, expect to get an RSR Warning page
     *   - expectCountersigner: if true, expect countersigning
     *   - countersignCancel: allows you to cancel out after confirming that a countersignature is required
     *   - countersigner: either a predefined User object, or a string to enter as the countersigner
     *   - countersignComment: countersigner comment (a generic comment will be entered if this is not specified)
     *   - offender: an OffenderDef object, if specified the OGRS4 calculations will be checked
     */
    // async signAndLock(
    //     params?: {
    //         page?: IPage, expectOutstandingQuestions?: boolean, expectRsrScore?: boolean, expectRsrWarning?: boolean,
    //         expectCountersigner?: boolean, countersignCancel?: boolean, countersigner?: any, countersignComment?: string
    //     }) {

    //     lib.log(`Sign & lock assessment`)

    //     if (params?.page) {
    //         new params.page().goto(true)
    //     }

    //     new this.oasys.Pages.BaseAssessmentPage().getPncFromScreenContext('pnc')
    //     cy.get<string>('@pnc').then((pnc) => {  // Grab the PNC to find the oasys_set in the database for OGRS4 testing

    //         this.oasys.Nav.clickButton('Sign & Lock', true)

    //         const signingStatus = new this.oasys.Pages.Signing.SigningStatus()

    //         if (params?.expectOutstandingQuestions) {
    //             signingStatus.continueWithSigning.click()
    //         }
    //         if (params?.expectRsrScore) {
    //             new this.oasys.Pages.Signing.RsrConfirm().ok.click()
    //         }
    //         if (params?.expectRsrWarning) {
    //             signingStatus.continueWithSigning.click()
    //         }

    //         signingStatus.confirmSignAndLock.click()

    //         if (params?.expectCountersigner) {
    //             const cPage = new this.oasys.Pages.Signing.CountersignatureRequired()
    //             if (params?.countersignCancel) {
    //                 cPage.cancel.click()
    //             }
    //             else {
    //                 if (params.countersigner?.constructor?.name == 'User') {
    //                     cPage.countersigner.setValue((params.countersigner as User).lovLookup)
    //                 } else if (params.countersigner != null) {
    //                     cPage.countersigner.setValue(params.countersigner as string)
    //                 }
    //                 cPage.comments.setValue(params.countersignComment ?? 'Assessment needs to be countersigned')
    //                 cPage.confirm.click()
    //             }
    //         }

    //         // Check the OGRS4 calculations
    //         this.oasys.Db.getLatestSetPkByPnc(pnc, 'pk')
    //         cy.get<number>('@pk').then((pk) => {
    //             checkOgrs4CalcsPk(pk)
    //         })

    //         // Check for unwanted countersigning
    //         if (!params?.countersignCancel) {
    //             new this.oasys.Pages.Tasks.TaskManager().checkCurrent()
    //         }

    //     })
    // }

    /**
     * Countersign an assessment.  The optional parameter is a CountersignParams object which may contain:
     * 
     *   - page: an assessment page to select, e.g. this.oasys.pages.SentencePlan.IspSection52to8, assuming you are already in the assessment.
     * OR
     *   - offender: an Offender object; if this is provided, the assessment will be opened by searching for a countersigning task
     * 
     * If neither of the above are provided, you should already be on a page with the Countersigning button available.
     * 
     *   - comment: countersigning comment (a generic comment will be used if this is not provided)
     */
    // async countersign(params?: { page?: IPage, offender?: OffenderDef, comment?: string }) {

    //     lib.log(`Countersign assessment`)

    //     if (params?.offender) {
    //         this.oasys.Task.openAssessmentFromCountersigningTaskByName(params.offender.surname)
    //         this.oasys.Nav.clickButton('Return to Assessment')
    //     }

    //     if (params?.page) {
    //         new params.page().goto(true)
    //     }

    //     this.oasys.Nav.clickButton('Countersign')
    //     const countersigning = new this.oasys.Pages.Signing.Countersigning()
    //     countersigning.selectAction.setValue('Countersign')
    //     countersigning.comments.setValue(params?.comment ?? 'Countersigning the assessment')
    //     countersigning.ok.click()
    //     new this.oasys.Pages.Tasks.TaskManager().checkCurrent()
    // }

    /**
     * Checks that the expected set of OASYS_SIGNING records are found for a given assessment PK; the expectedActions parameter should include all actions, latest first.
     */
    // async checkSigningRecord(pk: number, expectedActions: AssessmentSigning[]) {

    //     this.oasys.Db.getData(`select signing_action_elm from eor.oasys_signing where oasys_set_pk = ${pk} order by create_date desc`, 'data')
    //     cy.get<string[][]>('@data').then((data) => {

    //         lib.log(`Checking OASYS_SIGNING actions for ${pk}: ${JSON.stringify(data)} `)

    //         expect(data.length).eq(expectedActions.length)
    //         for (let i = 0; i < expectedActions.length; i++) {
    //             expect(data[i][0]).eq(expectedActions[i])
    //         }
    //     })
    // }

}
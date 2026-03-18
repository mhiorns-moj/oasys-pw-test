import { Page, TestInfo } from '@playwright/test'

import * as lib from 'lib'
import { Oasys, Cms, Offender, OasysDb } from 'fixtures'
import { BaseAssessmentPage, Common, Layer1, Layer3, San, Risk, Signing, SentencePlan } from 'fixtures/assessment'
import * as pages from './pages'


export class Assessment {

    constructor(public readonly page: Page, public readonly testInfo: TestInfo, readonly oasys: Oasys, readonly cms: Cms, readonly offender: Offender, readonly oasysDb: OasysDb) { }

    assessmentPk: number // Updated on creating an assessment.  Used at lock incomplete and sign&lock to call the OGRS4 regression test

    readonly baseAssessmentPage = new BaseAssessmentPage(this.page)
    readonly createAssessmentPage = new pages.CreateAssessment(this.page)

    readonly common = new Common(this.page, this.testInfo, this.oasys)
    readonly layer1 = new Layer1(this.page, this.testInfo, this.oasys)
    readonly layer3 = new Layer3(this.page, this.testInfo, this.oasys)
    readonly san = new San(this.page, this.testInfo, this.oasys)
    readonly risk = new Risk(this.page, this.testInfo, this.oasys)
    readonly signing = new Signing(this.page, this.testInfo, this.oasys, this)
    readonly sentencePlan = new SentencePlan(this.page, this.testInfo, this.oasys)

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
     * 
     * Returns the assessment PK
     */
    async createProb(assessmentDetails: CreateAssessmentDetails, clonePreviousHistoric?: 'Yes' | 'No'): Promise<number> {

        await this.getToCreateAssessmentPage(true)

        await this.createAssessmentPage.setValues(assessmentDetails, true)
        await this.createAssessmentPage.create.click()
        if (clonePreviousHistoric) {
            await this.oasys.clickButton(clonePreviousHistoric)
        }

        const pnc = await this.baseAssessmentPage.getPncFromScreenContext()
        const pk = await this.getLatestSetPkByPnc(pnc)

        lib.log(`Created assessment PK ${pk}: ${JSON.stringify(assessmentDetails)}`, 'Assessment')
        return pk
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

    async populateMinimal(params?: PopulateAssessmentParams) {

        await this.common.populateMinimal(params)

        switch (params?.layer) {
            case 'Layer 1':
                await this.layer1.populateMinimal(params)
                break
            case 'Layer 1V2':
                break
            case 'Layer 3':
                await this.layer3.sections2To13NoIssues(params)
                break
            case 'Layer 3V2':
                await this.san.populateMinimal()
                break
        }
        await this.risk.populateMinimal(params)
        await this.sentencePlan.populateMinimal(params)
    }

    // export function fullyPopulated(params: PopulateAssessmentParams) {

    //     if (params.layer != 'Layer 1V2') {
    //         populate.CommonPages.OffendingInformation.fullyPopulated(params)
    //     }

    //     switch (params.layer) {
    //         case 'Layer 1':
    //             populate.Layer1Pages.Predictors.minimal()
    //             populate.Layer1Pages.Section2.fullyPopulated(params.maxStrings)
    //             break
    //         case 'Layer 1V2':
    //             populate.RoshaPages.RoshaPredictors.fullyPopulated()
    //             break
    //         case 'Layer 3':
    //             populate.Layer3Pages.Predictors.fullyPopulated(params)
    //             sections2To13FullyPopulated(params)
    //             break
    //     }

    //     if (params.layer != 'Layer 1V2') {
    //         populate.CommonPages.SelfAssessmentForm.fullyPopulated(params.maxStrings)
    //     }

    //     populate.Rosh.screeningFullyPopulated(params)
    //     populate.Rosh.fullAnalysisFullyPopulated(params)

    //     switch (params.layer) {
    //         case 'Layer 1':
    //             // TODO
    //             break
    //         case 'Layer 1V2':
    //             break
    //         case 'Layer 3':
    //             if (params.sentencePlan == 'Review') {
    //                 rspFullyPopulated(params)
    //             } else {
    //                 ispFullyPopulated(params)
    //             }
    //             break
    //     }

    //     cy.log(`Fully populated assessment: ${JSON.stringify(params)}`)
    // }


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

    // /**
    //  * Finds the latest non-deleted oasys_set record for a given offender
    //  * Uses the PNC stored in oasys_set, so doesn't account for merges etc.
    //  * 
    //  * Returns the pk using the resultAlias.
    //  */
    // async getLatestSetPk(offenderAlias: string, resultAlias: string) {

    //     cy.get<OffenderDef>(offenderAlias).then((offender) => {

    //         const query = `select oasys_set_pk from eor.oasys_set where pnc = '${offender.pnc}' and deleted_date is null order by initiation_date desc`
    //         getPk(query, resultAlias)
    //     })
    // }

    // /**
    //  * Finds the latest non-deleted oasys_set record for a given offender surname and forename.
    //  * 
    //  * Returns the pk using the resultAlias.
    //  */
    // async getLatestSetPkByName(surname: string, forename: string, resultAlias: string) {

    //     const query = `select oasys_set_pk from eor.oasys_set where family_name = '${surname}' and forename_1 = '${forename}' and deleted_date is null order by initiation_date desc`
    //     getPk(query, resultAlias)
    // }

    /**
     * Finds the latest non-deleted oasys_set record for a given offender PNC
     */
    async getLatestSetPkByPnc(pnc: string): Promise<number> {

        const query = `select oasys_set_pk from eor.oasys_set where pnc = '${pnc}' and deleted_date is null order by create_date desc`
        return await this.getPk(query) as number
    }

    // /**
    //  * Finds all oasys_set records for a given offender PNC (including deleted, unless optional parameter is true).
    //  * 
    //  * Returns the pks as a number[] (most recent first) using the resultAlias.
    //  */
    // async getAllSetPksByPnc(pnc: string, resultAlias: string, ignoreDeleted: boolean = false) {

    //     const query = ignoreDeleted ?
    //         `select oasys_set_pk from eor.oasys_set where pnc = '${pnc}' and deleted_date is null order by initiation_date desc`
    //         : `select oasys_set_pk from eor.oasys_set where pnc = '${pnc}' order by initiation_date desc`
    //     getPk(query, resultAlias, true)
    // }

    /**/

    async getPk(query: string, returnAll: boolean = false): Promise<number | number[]> {

        const data = await this.oasysDb.getData(query)

        if (data.length > 0) {
            if (returnAll) {
                const pks: number[] = []
                data.forEach((pk) => pks.push(Number.parseInt(pk[0])))
                lib.log(JSON.stringify(pks), 'Assessment PKs')
                return pks
            } else {
                const pk = Number.parseInt(data[0][0])
                lib.log(pk.toString(), 'Assessment PK')
                return pk
            }
        } else {
            return null
        }
    }

    /** 
     * Returns a string with x characters.  The string includes some spaces and carriage returns, and a counter at regular intervals.
     */
    oasysString(length: number): string {

        let result = ''
        let i = 0
        let letters = 'ABCD efg'
        let lineLength = 0

        while (i < length - 12) {
            // Add 10 characters at a time, including a counter, until nearly at the end
            i += 10
            lineLength += 10
            let counter = i.toString()
            result += `${letters.substring(0, 10 - counter.length)}${counter}`

            if (lineLength == 400) {
                result += '\n'  // newline counts 2 characters
                i += 2
                lineLength = 0
            }
        }

        return `${result}${'.'.repeat(length - i)}`
    }


}
import { Page, TestInfo } from '@playwright/test'

import * as lib from 'lib'
import { Oasys, Assessment, Tasks } from 'fixtures'
import * as pages from './pages'
import { User } from 'classes/user'
import { checkOgrs4CalcsPk } from 'lib/ogrs'

export class Signing {


    constructor(public readonly page: Page, public readonly testInfo: TestInfo, readonly oasys: Oasys, readonly assessment: Assessment, readonly tasks: Tasks) { }


    readonly signingStatus = new pages.SigningStatus(this.page)
    readonly rsrConfirm = new pages.RsrConfirm(this.page)
    readonly cPage = new pages.CountersignatureRequired(this.page)
    readonly countersigning = new pages.Countersigning(this.page)

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
    async signAndLock(
        params?: {
            page?: SigningPage, expectOutstandingQuestions?: boolean, expectRsrScore?: boolean, expectRsrWarning?: boolean,
            expectCountersigner?: boolean, countersignCancel?: boolean, countersigner?: any, countersignComment?: string
        }) {

        lib.log(`Sign & lock assessment`)
        await this.gotoSigningPage(params?.page)

        // Grab the PNC to find the oasys_set in the database for OGRS4 testing
        const pnc = await this.assessment.baseAssessmentPage.getPncFromScreenContext()

        await this.oasys.clickButton('Sign & Lock', true)

        if (params?.expectOutstandingQuestions) {
            await this.signingStatus.continueWithSigning.click()
        }
        if (params?.expectRsrScore) {
            await this.rsrConfirm.ok.click()
        }
        if (params?.expectRsrWarning) {
            await this.signingStatus.continueWithSigning.click()
        }

        await this.signingStatus.confirmSignAndLock.click()

        if (params?.expectCountersigner) {
            if (params?.countersignCancel) {
                await this.cPage.cancel.click()
            }
            else {
                if (params.countersigner?.constructor?.name == 'User') {
                    await this.cPage.countersigner.setValue((params.countersigner as User).lovLookup)
                } else if (params.countersigner != null) {
                    await this.cPage.countersigner.setValue(params.countersigner as string)
                }
                await this.cPage.comments.setValue(params.countersignComment ?? 'Assessment needs to be countersigned')
                await this.cPage.confirm.click()
            }
        }

        // Check the OGRS4 calculations
        const pk = await this.assessment.getLatestSetPkByPnc(pnc)
        // checkOgrs4CalcsPk(pk) // TODO

        // Check for unwanted countersigning
        if (!params?.countersignCancel) {
            await this.tasks.taskManager.checkCurrent(true)
        }
    }

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
    async countersign(params?: { page?: SigningPage, offender?: OffenderDef, comment?: string }) {

        lib.log(`Countersign assessment`)

        if (params?.offender) {
            await this.tasks.openAssessmentFromCountersigningTask(params.offender)
            await this.oasys.clickButton('Return to Assessment')
        }

        await this.gotoSigningPage(params?.page)

        await this.oasys.clickButton('Countersign')
        await this.countersigning.selectAction.setValue('Countersign')
        await this.countersigning.comments.setValue(params?.comment ?? 'Countersigning the assessment')
        await this.countersigning.ok.click()

        await this.tasks.taskManager.checkCurrent(true)
    }

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

    async gotoSigningPage(signingPage: SigningPage) {

        // TODO complete this
        switch (signingPage) {
            case 'basic':
                await this.assessment.sentencePlan.basicSentencePlan.goto(true)
                break
            case 'spService':
                await this.assessment.sentencePlan.spService.sentencePlanService.goto(true)
                break
        }

    }

}
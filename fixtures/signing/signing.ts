import { Page } from '@playwright/test'
import * as fs from 'fs-extra'

import { Oasys, Assessment, Tasks } from 'fixtures'
import * as pages from './pages'
import { User } from 'classes/user'

export class Signing {


    constructor(private readonly page: Page, private readonly oasys: Oasys, private readonly tasks: Tasks) { }


    readonly signingStatus = new pages.SigningStatus(this.page)
    readonly rsrConfirm = new pages.RsrConfirm(this.page)
    readonly cPage = new pages.CountersignatureRequired(this.page)
    readonly countersigning = new pages.Countersigning(this.page)
    readonly countersigningOverview = new pages.CountersigningOverview(this.page)

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
     *   - pk: if provided, the OGRS4 scores will be checked
     */
    async signAndLock(
        params?: {
            page?: SigningPage, expectOutstandingQuestions?: boolean, expectRsrScore?: boolean, expectRsrWarning?: boolean,
            expectCountersigner?: boolean, countersignCancel?: boolean, countersigner?: any, countersignComment?: string
        }) {

        log(`Sign & lock assessment`)
        await this.oasys.gotoSigningPage(params?.page)

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
        // checkOgrs4CalcsPk(params.pk) // TODO

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
    async countersign(params?: { page?: SigningPage, offender?: OffenderDef, comment?: string, expectSecondCountersigner?: boolean, secondCountersigner?: any }) {

        log(`Countersign assessment`)

        if (params?.offender) {
            await this.tasks.openAssessmentFromCountersigningTask(params.offender)
            await this.oasys.clickButton('Return to Assessment', true)
        }

        await this.oasys.gotoSigningPage(params?.page)

        await this.oasys.clickButton('Countersign', true)
        await this.countersigning.selectAction.setValue('Countersign')
        await this.countersigning.comments.setValue(params?.comment ?? 'Countersigning the assessment')
        await this.countersigning.ok.click()

        if (params?.expectSecondCountersigner) {

            this.cPage.comments.setValue('Sending for second countersignature')
            this.cPage.confirm.click()
        }

        await this.tasks.taskManager.checkCurrent(true)
        log('Countersigned assessment')
    }

    /**
     * Reject countersigning an assessment.  The optional parameter is a CountersignParams object which may contain:
     * 
     *   - page: an assessment page to select, e.g. this.oasys.pages.SentencePlan.IspSection52to8, assuming you are already in the assessment.
     * OR
     *   - offender: an Offender object; if this is provided, the assessment will be opened by searching for a countersigning task
     * 
     * If neither of the above are provided, you should already be on a page with the Countersigning button available.
     * 
     *   - comment: countersigning comment (a generic comment will be used if this is not provided)
     */
    async countersignReject(params?: { page?: SigningPage, offender?: OffenderDef, comment?: string }) {

        log(`Rejected countersigning`)

        if (params?.offender) {
            await this.tasks.openAssessmentFromCountersigningTask(params.offender)
            await this.oasys.clickButton('Return to Assessment')
        }

        await this.oasys.gotoSigningPage(params?.page)

        await this.oasys.clickButton('Countersign')
        await this.countersigning.selectAction.setValue('Reject for Rework')
        await this.countersigning.comments.setValue(params?.comment ?? 'Rejecting the assessment')
        await this.countersigning.ok.click()
        await this.oasys.clickButton('Yes')

        await this.tasks.taskManager.checkCurrent(true)
    }

    async gotoCountersignOverview(page: SigningPage) {

        await this.oasys.gotoSigningPage(page)
        await this.countersigningOverview.goto()
    }


    /**
     * Checks that the errors listed in the specified data file are visible on the sign & lock page.  Fails the test if any are missing.
     * 
     * Assumes that the file is in data/errorText; the parameter passed should be just the filename without folder or extension.
     */
    async checkSignAndLockErrorsVisible(errorFile: string) {

        log(`Checking for errors listed in data/errorText/${errorFile}`)
        let failed = false
        const errorFileContents = await fs.readFile(`tests/data/errorText/${errorFile}.json`)
        const errors = JSON.parse(errorFileContents.toString())

        for (let error of errors) {
            const count = await this.page.locator('td').filter({ hasText: error }).count()
            if (count == 0) {
                failed = true
                log(`Expected error text not found: ${error}`)
            }
        }
        expect(failed).toBeFalsy()
    }

    /**
     * Checks that the errors listed in the specified data file are NOT visible on the sign & lock page.  Fails the test if any are visible.
     * 
     * Assumes that the file is in data/errorText; the parameter passed should be just the filename without folder or extension.
     */
    async checkSignAndLockErrorsNotVisible(errorFile: string) {

        log(`Checking for errors listed in data/errorText/${errorFile}`)
        let failed = false
        const errorFileContents = await fs.readFile(`tests/data/errorText/${errorFile}.json`)
        const errors = JSON.parse(errorFileContents.toString())

        for (let error of errors) {
            const count = await this.page.locator('td').filter({ hasText: error }).count()
            failed = count != 0 || failed
        }
        expect(failed).toBeFalsy()
    }

    /**
     * Checks that single given error is visible/not visible on the sign & lock page, fails the test if not.
     */
    async checkSingleSignAndLockError(error: string, expectVisible: boolean) {

        const count = await this.page.locator('td').filter({ hasText: error }).count()
        if (expectVisible) {
            expect(count).toBe(1)
        } else {
            expect(count).toBe(0)
        }
    }

}
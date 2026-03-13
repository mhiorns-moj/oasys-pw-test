import { Page, TestInfo } from '@playwright/test'

import * as lib from 'lib'
import { Oasys } from 'fixtures'
import * as pages from './pages'


export class Cms {

    constructor(public readonly page: Page, public readonly testInfo: TestInfo, readonly oasys: Oasys) { }

    cmsStub = new pages.CmsStub(this.page)
    maintainCmsStub = new pages.MaintainCmsStub(this.page)
    cmsOffenderDetails = new pages.CmsOffenderDetails(this.page)
    cmsStubEvent = new pages.CmsStubEvent(this.page)
    cmsStubSentenceDetail = new pages.CmsStubSentenceDetail(this.page)
    cmsStubOffence = new pages.CmsStubOffence(this.page)
    cmsStubAlias = new pages.CmsStubAlias(this.page)
    cmsSearchResults = new pages.CmsSearchResults(this.page)
    crnAmendment = new pages.CrnAmendment(this.page)

    async createProbStub(offender: OffenderDef) {

        await this.cmsStub.goto(true)
        await this.cmsStub.createStub.click()

        let stubDetails = JSON.parse(JSON.stringify(offender)) as PageData
        if (stubDetails.event) delete stubDetails.event
        if (stubDetails.aliases) delete stubDetails.aliases

        await this.maintainCmsStub.setValues(stubDetails, true)
        await this.maintainCmsStub.addressLine4.setValue(this.oasys.appConfig.currentVersion)
        await this.maintainCmsStub.addressLine5.setValue(this.testInfo.title)
        await this.maintainCmsStub.save.click()

        // Add the event/offence/sentence if included in the offender details
        if (offender.event) {

            await this.maintainCmsStub.event.click()
            await this.maintainCmsStub.sentenceTypeColumn.clickFirstRow()

            if (offender.event.eventDetails) {
                await this.cmsStubEvent.setValues(offender.event.eventDetails, true)
            }
            await this.cmsStubEvent.save.click()

            if (offender.event.sentenceDetails) {

                await this.cmsStubEvent.sentenceDetail.click()
                await this.enterSentenceDetails(offender.event.sentenceDetails)
            }

            if (offender.event.offences) {

                await this.cmsStubEvent.offences.click()
                await this.enterOffences(offender.event.offences)
            }

            await this.cmsStubEvent.close.click()
        }

        if (offender.aliases) {

            await this.maintainCmsStub.offenderAlias.click()
            await this.enterAliases(offender.aliases)
        }
    }

    async cmsOffenderSearch() {

        await this.cmsSearchResults.cmsEventNumberColumn.clickFirstRow()
        await this.cmsOffenderDetails.createOffender.click()
    }
    async cmsAssessmentSearch() {

        await this.crnAmendment.ok.click()
        await this.cmsSearchResults.cmsEventNumberColumn.clickFirstRow()
        await this.cmsOffenderDetails.updateOffender.click()
    }

    /**
     * Create a reception event for an offender.
     * The offender should already have been created in Probation with a Cypress alias, this alias (beginning with '@') is used as the parameter for this function.
     * 
     * The offender should already have a NOMIS Id, but no stub record.
     */
    // export function createReceptionEvent(offenderAlias: string) {

    //     cy.get<OffenderDef>(offenderAlias).then((offender) => {

    //         enterPrisonStubDetailsAndCreateReceptionEvent(offender)
    //         oasys.log(`Created reception event for offender with PNC: ${offender.pnc}, surname: '${offender.surname}', NOMISId: ${offender.nomisId}`)
    //     })
    // }

    /**
     * Enter prison offender details on the stub page, and trigger a reception event.
     */
    async enterPrisonStubDetailsAndCreateReceptionEvent(offender: OffenderDef) {

        await this.cmsStub.goto(true)
        await this.cmsStub.createStub.click()

        let stubDetails = JSON.parse(JSON.stringify(offender)) as PageData
        if (stubDetails.event) delete stubDetails.event
        if (stubDetails.aliases) delete stubDetails.aliases

        await this.maintainCmsStub.setValues(stubDetails, true)
        await this.maintainCmsStub.addressLine4.setValue(this.oasys.appConfig.currentVersion)
        await this.maintainCmsStub.addressLine5.setValue(this.testInfo.title)

        // Set a default reception code if not defined in the offender
        if (offender.receptionCode == null) {
            await this.maintainCmsStub.receptionCode.setValue('LATE RETURN (INVOLUNTARY)')
        }
        await this.maintainCmsStub.save.click()

        if (offender.event != null) {

            await this.maintainCmsStub.event.click()
            await this.maintainCmsStub.sentenceTypeColumn.clickFirstRow()

            await this.cmsStubEvent.setValues(offender.event.eventDetails, true)
            await this.cmsStubEvent.save.click()

            if (offender.event.sentenceDetails != null) {
                await this.cmsStubEvent.sentenceDetail.click()
                await this.enterSentenceDetails(offender.event.sentenceDetails)
            }

            if (offender.event.offences != null) {
                // Use first offence only for prison offenders if there is more than one
                let offence = offender.event.offences.constructor.name == 'Array' ? offender.event.offences[0] : offender.event.offences
                await this.cmsStubEvent.offences.click()
                await this.enterOffence(offence)
            }

            await this.cmsStubEvent.close.click()
        }

        if (offender.aliases != null) {
            await this.maintainCmsStub.offenderAlias.click()
            await this.enterAliases(offender.aliases)
        }
        await this.maintainCmsStub.receptionEvent.click()
        await this.page.locator('#apexConfirmBtn').click()

        await this.maintainCmsStub.save.click()
        await this.maintainCmsStub.close.click()
    }

    /**
     * Create a discharge event for an offender.
     * The offender should already have been created with a Cypress alias, this alias (beginning with '@') is used as the parameter for this function.
     * 
     * Assumes that there is already a CMS stub record.
     */
    // export function createDischargeEvent(offenderAlias: string) {

    //     cy.get<OffenderDef>(offenderAlias).then((offender) => {
    //         createDischargeEventForOffenderObject(offender)
    //     })
    // }

    /**
     * Open an existing offender on the CMS stub, and generate a discharge event.
     */
    // export function createDischargeEventForOffenderObject(offender: OffenderDef) {

    //     openStubByNomisId(offender.nomisId)

    //     const cms = new oasys.Pages.Stub.MaintainCmsStub()
    //     cms.dischargeCode.setValue('END OF CUSTODY LICENCE')
    //     cms.releaseEvent.click()
    //     cy.contains('p', 'Are you sure you want to generate a release event for this stub?')
    //     cy.get('#apexConfirmBtn').click()

    //     oasys.log(`Created discharge event for offender with PNC: ${offender.pnc}, surname: '${offender.surname}', NOMISId: ${offender.nomisId}`)
    // }

    /**
     * Navigates to the CMS stub, searches for a NOMIS Id and opens the stub record
     */
    async openStubByNomisId(nomisId: string) {

        this.cmsStub.goto(true)
        this.cmsStub.nomisId.setValue(nomisId)
        this.cmsStub.search.click()
        this.cmsStub.nomisIdColumn.clickFirstRow()

        lib.log(`Opened stub record for ${nomisId}`)
    }

    /**
     * Add an existing offender to the stub (used when transferring to another probation provider).
     */
    // export function addProbationOffenderToStub(offender: OffenderDef) {

    //     const cmsStub = new oasys.Pages.Stub.CmsStub()
    //     cmsStub.goto(true)
    //     cmsStub.createStub.click()

    //     const maintainCmsStub = new oasys.Pages.Stub.MaintainCmsStub()

    //     let stubDetails = JSON.parse(JSON.stringify(offender)) as PageData
    //     if (stubDetails.event) delete stubDetails.event
    //     if (stubDetails.aliases) delete stubDetails.aliases
    //     if (stubDetails.nomisId) delete stubDetails.nomisId

    //     maintainCmsStub.setValues(stubDetails, true)
    //     cy.get<string>('@appVersion').then((version) => {
    //         maintainCmsStub.addressLine4.setValue(version)
    //     })
    //     maintainCmsStub.addressLine5.setValue(Cypress.currentTest.title)
    //     maintainCmsStub.save.click()
    //     maintainCmsStub.close.click()

    //     oasys.log(`Added offender ${JSON.stringify(offender)} to stub`)
    // }

    async enterSentenceDetails(sentenceDetails: SentenceDetails | SentenceDetails[]) {

        if (sentenceDetails.constructor.name == 'Array') {
            Array.prototype.forEach.call(sentenceDetails, (async (sentenceDetail: SentenceDetails) => {
                await this.enterSentenceDetail(sentenceDetail)
            }))
        }
        else {
            await this.enterSentenceDetail(sentenceDetails as SentenceDetails)
        }
    }

    async enterSentenceDetail(sentenceDetails: SentenceDetails) {

        await this.cmsStubEvent.createSentenceDetail.click()
        await this.cmsStubSentenceDetail.setValues(sentenceDetails, true)
        await this.cmsStubSentenceDetail.save.click()
        await this.cmsStubSentenceDetail.close.click()
    }

    async enterOffences(offences: Offence | Offence[]) {

        if (offences.constructor.name == 'Array') {
            await Array.prototype.forEach.call(offences, (async (offence: Offence) => { await this.enterOffence(offence) }))
        }
        else {
            await this.enterOffence(offences as Offence)
        }
    }

    async enterOffence(offence: Offence) {

        await this.cmsStubEvent.createOffence.click()
        await this.cmsStubOffence.setValues(offence, true)
        await this.cmsStubOffence.save.click()
        await this.cmsStubOffence.close.click()
    }

    async enterAliases(aliases: Alias | Alias[]) {

        if (aliases.constructor.name == 'Array') {
            await Array.prototype.forEach.call(aliases, (async (alias: Alias) => { await this.enterAlias(alias) }))
        }
        else {
            await this.enterAlias(aliases as Alias)
        }
    }

    async enterAlias(alias: Alias) {

        await this.maintainCmsStub.createAlias.click()
        await this.cmsStubAlias.setValues(alias, true)
        await this.cmsStubAlias.save.click()
        await this.cmsStubAlias.close.click()
    }

}

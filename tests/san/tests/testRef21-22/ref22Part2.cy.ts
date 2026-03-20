import * as oasys from 'oasys'

describe('SAN integration - test ref 22 part 2', () => {

    it('Test ref 22 part 2 - check offender 1', () => {

        // Get offender details
        cy.task('retrieveValue', 'offender1').then((offenderData) => {
            const offender1 = JSON.parse(offenderData as string)

            oasys.login(oasys.Users.probHeadPdu)
            oasys.Offender.searchAndSelectByCrn(offender1.probationCrn)
            new oasys.Pages.Offender.AssessmentsTab().assessments.checkCount(1)
            oasys.Assessment.openLatest()
            new oasys.Pages.Assessment.OffenderInformation().religion.checkStatus('readonly')
            oasys.logout()
        })
    })
})
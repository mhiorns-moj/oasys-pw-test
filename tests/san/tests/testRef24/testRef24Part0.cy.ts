import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefTwenty',
    gender: 'Male',
    dateOfBirth: { years: -40 },
    limitedAccessOffender: true,
    event: {
        eventDetails: {
            sentenceType: 'Fine',
            sentenceDate: { months: -6 },
        },
        offences:
        {
            offence: '028',
            subcode: '01',
        },
    },
}

describe('SAN integration - test ref 24', () => {
    /**
        Create a new Male probation offender in a SAN Pilot probation area
        Administrator flags the offender as LAO and grants access to this offender for an Assessor who has the SAN Service role
     */

    it('Test ref 24 part 0 - create offender and make LAO', () => {

        oasys.login(oasys.Users.probSanHeadPdu)

        oasys.Offender.createProb(offender, 'offender')
        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })

            oasys.logout()
            oasys.login(oasys.Users.admin, oasys.Users.probationSan)
            oasys.Offender.searchAndSelectByPnc(offender.pnc)
            const lao = new oasys.Pages.Offender.Lao().goto()
            lao.setLaoStatus.setValue('Yes')
            lao.laoReaders.addItemUsingFilter(oasys.Users.probSanHeadPdu.username) // No countersigning for this test
            lao.save.click()
            cy.log('Set LAO reader')
            lao.close.click()
            oasys.logout()
        })
    })
})
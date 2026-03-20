import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefTwentyThree',
    gender: 'Not known',
    dateOfBirth: { years: -25 },
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

describe('SAN integration - test ref 23', () => {
    /**
        ROLLBACK - ensure ROLLBACK API is sent with the parameters set correctly
        This test has an offender whose gender is 'Not known' which means OGRS, OGP, OVP and RSR cannot calculate but what do we get back for the alcohol sections questions 9.1 and 9.2
     */

    it('Test ref 23 part 0 - create offender', () => {

        oasys.login(oasys.Users.probSanHeadPdu)  // No countersigning for this test

        oasys.Offender.createProb(offender, 'offender')

        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })

            oasys.logout()
        })
    })
})
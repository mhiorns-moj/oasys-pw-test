import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefThirtyFive',
    gender: 'Male',
    dateOfBirth: { years: -21 },
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

describe('SAN integration - test ref 35', () => {
    /**
        Check the cloning of a standalone RSR into an OASys-SAN 3.2 assessment
        Includes Maturity Screening score
     */

    it('Test ref 35 part 0 - create offender', () => {

        oasys.login(oasys.Users.probSanHeadPdu)  // No countersigning for this test

        oasys.Offender.createProb(offender, 'offender')

        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })

            oasys.logout()
        })
    })
})
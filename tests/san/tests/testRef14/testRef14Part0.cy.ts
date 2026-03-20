import * as oasys from 'oasys'

const offender: OffenderDef = {

    forename1: 'TestRefFourteen',
    gender: 'Female',
    dateOfBirth: { years: -32 },
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

describe('SAN integration - test ref 14', () => {
    /**
        New FEMALE Probation Offender in SAN Area - check functionality when say 'No' to cloning from an Historic OASys-SAN assessment.
     */

    it('Test ref 14 part 0 - create offender', () => {

        oasys.login(oasys.Users.probSanHeadPdu)  // No countersigning for this test

        oasys.Offender.createProb(offender, 'offender')

        cy.get<OffenderDef>('@offender').then((offender) => {

            // Save the offender details for use in later tests
            cy.task('storeValue', { key: 'offender', value: JSON.stringify(offender) })

            oasys.logout()
        })
    })
})